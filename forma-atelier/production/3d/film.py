"""Hero film renderer. Usage: python film.py preview|render [take ...]
Renders 12 fps PNG frames per take; frames already on disk are skipped (resumable)."""
import sys, os, time, math
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import bpy
from mathutils import Vector
import lib, scene_villa as villa

FPS = 12
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'out', 'film')

# (seconds, [(loc, target, lens, fstop)...]) - keys are evenly spaced in time
TAKES = {
    'A': (7.0, [((3.3, -3.4, 1.5), (3.5, 6.0, 1.05), 26, 0),
                ((3.3, -1.0, 1.46), (3.45, 6.2, 1.0), 26, 0),
                ((3.25, 1.5, 1.4), (3.5, 6.4, 0.9), 27, 0)]),
    'B': (5.0, [((5.55, 3.15, 1.05), (3.9, 4.75, 0.5), 34, 4.0),
                ((4.95, 3.45, 0.8), (3.65, 4.55, 0.4), 40, 3.2),
                ((4.6, 3.55, 0.66), (3.6, 4.3, 0.33), 40, 3.2)]),
    'C': (5.0, [((7.0, 0.95, 1.38), (9.0, 2.95, 1.1), 30, 0),
                ((7.6, 0.85, 1.36), (9.45, 3.0, 1.1), 30, 0),
                ((8.25, 0.8, 1.34), (9.9, 3.05, 1.1), 30, 0)]),
    'D': (5.0, [((10.2, 6.45, 1.45), (4.4, 3.4, 1.0), 25, 0),
                ((10.8, 6.95, 1.58), (4.2, 3.35, 1.0), 23.5, 0),
                ((11.35, 7.3, 1.7), (4.0, 3.3, 1.0), 22, 0)]),
}


def smoothstep(t):
    return t * t * (3 - 2 * t)


def catmull(ps, u):
    """Uniform Catmull-Rom through points ps, u in [0, 1]."""
    n = len(ps) - 1
    x = u * n
    i = min(int(x), n - 1)
    t = x - i
    p0 = ps[max(i - 1, 0)]
    p1, p2 = ps[i], ps[i + 1]
    p3 = ps[min(i + 2, n)]
    if i == 0:
        p0 = p1 + (p1 - p2)
    if i + 2 > n:
        p3 = p2 + (p2 - p1)
    t2, t3 = t * t, t * t * t
    return 0.5 * ((2 * p1) + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 + (-p0 + 3 * p1 - 3 * p2 + p3) * t3)


def pose(take, u):
    dur, keys = TAKES[take]
    # gentle ease: blend linear and smoothstep so takes never fully stop (they overlap in dissolves)
    e = 0.65 * u + 0.35 * smoothstep(u)
    loc = catmull([Vector(k[0]) for k in keys], e)
    tgt = catmull([Vector(k[1]) for k in keys], e)
    lens = catmull([Vector((k[2], 0, 0)) for k in keys], e).x
    fst = catmull([Vector((k[3], 0, 0)) for k in keys], e).x
    return loc, tgt, lens, fst


def main():
    mode = sys.argv[1]
    takes = sys.argv[2:] or list(TAKES)
    villa.build()
    cam = lib.camera((0, 0, 1), (0, 1, 1), 26)
    if mode == 'preview':
        lib.setup_render(480, 270, 8, threshold=0.1, bounces=4)
    else:
        lib.setup_render(1280, 720, 12, threshold=0.05, bounces=4)
    sc = bpy.context.scene
    cy = sc.cycles
    cy.diffuse_bounces = 3
    cy.glossy_bounces = 2
    cy.transmission_bounces = 4
    cy.transparent_max_bounces = 8
    os.makedirs(OUT, exist_ok=True)
    for tk in takes:
        dur = TAKES[tk][0]
        n = int(round(dur * FPS))
        frames = [0, n // 2, n - 1] if mode == 'preview' else range(n)
        for f in frames:
            path = os.path.join(OUT, f'{"prev_" if mode == "preview" else ""}{tk}_{f:04d}.png')
            if mode != 'preview' and os.path.exists(path):
                continue
            loc, tgt, lens, fst = pose(tk, f / (n - 1))
            lib.aim(cam, tuple(loc), tuple(tgt))
            cam.data.lens = lens
            if fst > 0.5:
                cam.data.dof.use_dof = True
                cam.data.dof.aperture_fstop = fst
                cam.data.dof.focus_distance = (tgt - loc).length
            else:
                cam.data.dof.use_dof = False
            t = time.time()
            lib.render(path)
            print(f'FRAME {tk} {f + 1}/{n} {time.time() - t:.1f}s', flush=True)
    print('DONE', flush=True)


main()
