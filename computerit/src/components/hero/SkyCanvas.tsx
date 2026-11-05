"use client";

import { useEffect, useRef } from "react";

/**
 * Niebo z chmurami renderowane shaderem WebGL. Chmury są generowane proceduralnie (fBm z deformacją domeny),
 * więc tło jest unikalne dla ComputerIT i nie wymaga ciężkich zdjęć.
 *
 * Wydajność: render w połowie rozdzielczości (chmury są miękkie), maks. ~30 kl./s, pauza poza ekranem
 * i w ukrytej karcie. Przy `prefers-reduced-motion` rysowana jest jedna, nieruchoma klatka.
 * Bez WebGL zostaje gradient nieba z tła sekcji.
 */

const VERTEX = `attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}`;

const FRAGMENT = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;

float hash(vec2 p){vec3 q=fract(vec3(p.xyx)*.1031);q+=dot(q,q.yzx+33.33);return fract((q.x+q.y)*q.z);}
float noise(vec2 p){
  vec2 i=floor(p),f=fract(p),u=f*f*(3.-2.*f);
  return mix(mix(hash(i),hash(i+vec2(1,0)),u.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),u.x),u.y);
}
float fbm(vec2 p){
  float v=0.,a=.5;
  for(int i=0;i<5;i++){v+=a*noise(p);p=p*2.03+vec2(17.1,9.2);a*=.5;}
  return v;
}

// Gęstość chmur: morze chmur przy dolnej krawędzi i rzadkie, wysokie smugi pod zenitem.
float clouds(vec2 p,float t){
  float h=p.y;
  vec2 q=vec2(p.x*.85+t*.016,h*2.4);
  float warp=fbm(q*.8+vec2(0.,t*.008));
  float n=fbm(q*1.7+warp*1.5-vec2(t*.011,0.));
  float sea=1.-smoothstep(.0,.3,h);
  float band=smoothstep(.5,.66,h)*(1.-smoothstep(.8,1.,h));
  float wisp=band*smoothstep(.45,.75,fbm(vec2(p.x*.7-t*.009,h*6.)))*.5;
  float cov=max(sea,wisp);
  return smoothstep(.66-cov*.6,.95-cov*.45,n+cov*.22);
}

void main(){
  vec2 uv=gl_FragCoord.xy/uRes;
  float aspect=uRes.x/uRes.y;
  vec2 p=vec2(uv.x*aspect,uv.y);
  float t=uTime;

  vec3 zen=vec3(.039,.133,.36);
  vec3 mid=vec3(.098,.318,.73);
  vec3 hor=vec3(.47,.67,.93);
  vec3 sky=mix(hor,mid,smoothstep(.06,.48,uv.y));
  sky=mix(sky,zen,smoothstep(.42,1.,uv.y));
  float sd=distance(p,vec2(aspect*.88,1.05));
  sky+=vec3(1.,.85,.6)*.2*exp(-sd*2.6);

  float d=clouds(p,t);
  float above=clouds(p+vec2(-.01,.03),t);
  float lit=clamp(.55+(d-above)*2.6+(1.-uv.y)*.35,0.,1.);
  vec3 shade=vec3(.68,.76,.88);
  vec3 light=vec3(1.,.992,.975);
  vec3 cloud=mix(shade,light,lit);

  vec3 col=mix(sky,cloud,d);
  // Delikatna winieta u góry porządkuje kompozycję i wzmacnia kontrast białej typografii.
  col*=1.-.18*smoothstep(.55,1.,uv.y);
  gl_FragColor=vec4(col,1.);
}`;

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export function SkyCanvas({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false, depth: false, powerPreference: "low-power" });
    if (!gl) return;

    const vs = compile(gl, gl.VERTEX_SHADER, VERTEX);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT);
    const program = gl.createProgram();
    if (!vs || !fs || !program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const attribute = gl.getAttribLocation(program, "a");
    gl.enableVertexAttribArray(attribute);
    gl.vertexAttribPointer(attribute, 2, gl.FLOAT, false, 0, 0);
    const uRes = gl.getUniformLocation(program, "uRes");
    const uTime = gl.getUniformLocation(program, "uTime");

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    // Start w środku „pogody”, żeby chmury były uformowane od pierwszej klatki.
    const offset = 40 + Math.random() * 20;
    const start = performance.now();
    let frame = 0;
    let last = 0;
    let onScreen = true;

    const draw = (now: number) => {
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, offset + (now - start) / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const resize = () => {
      const scale = Math.min(window.devicePixelRatio || 1, 2) * 0.5;
      const width = Math.max(1, Math.round(canvas.clientWidth * scale));
      const height = Math.max(1, Math.round(canvas.clientHeight * scale));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }
      draw(performance.now());
    };

    const loop = (now: number) => {
      frame = requestAnimationFrame(loop);
      if (now - last < 33) return;
      last = now;
      draw(now);
    };

    const sync = () => {
      cancelAnimationFrame(frame);
      if (onScreen && !document.hidden && !reduceMotion.matches) frame = requestAnimationFrame(loop);
    };

    resize();
    canvas.dataset.ready = "true";

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    const intersection = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      sync();
    });
    intersection.observe(canvas);
    document.addEventListener("visibilitychange", sync);
    reduceMotion.addEventListener("change", sync);
    sync();

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersection.disconnect();
      document.removeEventListener("visibilitychange", sync);
      reduceMotion.removeEventListener("change", sync);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className={`opacity-0 transition-opacity duration-[1.2s] data-[ready=true]:opacity-100 ${className ?? ""}`}
    />
  );
}
