"""FORMA ATELIER - procedural interior library for Blender (bpy 5.2, Cycles).

Everything is authored from scratch: geometry, procedural materials and daylight.
Units are metres. Rooms span x in [0, W], y in [0, D], floor z = 0.
"""
import bpy, bmesh, math, random, os
MAXD = float(os.environ.get('FA_MAXD', '16'))
from mathutils import Vector, Euler

rnd = random.Random(7)

# --------------------------------------------------------------------------- utils

def lin(h, a=1.0):
    h = h.lstrip('#')
    c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    f = lambda x: x / 12.92 if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4
    return tuple(f(x) for x in c) + (a,)


def scale_col(c, k):
    return tuple(min(1.0, x * k) for x in c[:3]) + (1.0,)


def reset():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    global rnd
    rnd = random.Random(7)


def link(ob):
    bpy.context.scene.collection.objects.link(ob)
    return ob


# --------------------------------------------------------------------------- materials

class NB:
    """Small node-tree builder."""

    def __init__(self, name):
        self.m = bpy.data.materials.new(name)
        self.nt = self.m.node_tree
        self.N = self.nt.nodes
        self.L = self.nt.links
        self.bsdf = self.N['Principled BSDF']
        self.out = self.N['Material Output']

    def n(self, t, **props):
        node = self.N.new(t)
        for k, v in props.items():
            setattr(node, k, v)
        return node

    def set(self, sock, v):
        if isinstance(v, bpy.types.NodeSocket):
            self.L.new(v, sock)
        else:
            sock.default_value = v

    def coord(self, kind='Object', scale=(1, 1, 1), rot=(0, 0, 0), loc=(0, 0, 0)):
        tc = self.n('ShaderNodeTexCoord')
        mp = self.n('ShaderNodeMapping')
        mp.inputs['Scale'].default_value = scale
        mp.inputs['Rotation'].default_value = rot
        mp.inputs['Location'].default_value = loc
        self.L.new(tc.outputs[kind], mp.inputs['Vector'])
        return mp.outputs['Vector']

    def noise(self, vec, scale, detail=4.0, rough=0.5, distortion=0.0):
        t = self.n('ShaderNodeTexNoise')
        t.inputs['Scale'].default_value = scale
        t.inputs['Detail'].default_value = min(detail, MAXD)
        t.inputs['Roughness'].default_value = rough
        t.inputs['Distortion'].default_value = distortion
        if vec is not None:
            self.L.new(vec, t.inputs['Vector'])
        return t.outputs['Fac']

    def voronoi(self, vec, scale, rand=1.0, out='Distance'):
        t = self.n('ShaderNodeTexVoronoi')
        t.inputs['Scale'].default_value = scale
        t.inputs['Randomness'].default_value = rand
        if vec is not None:
            self.L.new(vec, t.inputs['Vector'])
        return t.outputs[out]

    def wave(self, vec, scale, distortion=2.0, detail=3.0, direction='X', profile='SIN'):
        t = self.n('ShaderNodeTexWave', wave_type='BANDS', bands_direction=direction, wave_profile=profile)
        t.inputs['Scale'].default_value = scale
        t.inputs['Distortion'].default_value = distortion
        t.inputs['Detail'].default_value = min(detail, MAXD)
        if vec is not None:
            self.L.new(vec, t.inputs['Vector'])
        return t.outputs['Fac']

    def ramp(self, fac, stops, interp='LINEAR'):
        r = self.n('ShaderNodeValToRGB')
        cr = r.color_ramp
        cr.interpolation = interp
        stops = sorted(stops, key=lambda s: s[0])
        cr.elements[0].position = stops[0][0]
        cr.elements[0].color = stops[0][1]
        cr.elements[1].position = stops[-1][0]
        cr.elements[1].color = stops[-1][1]
        for p, c in stops[1:-1]:
            e = cr.elements.new(p)
            e.color = c
        self.L.new(fac, r.inputs['Fac'])
        return r.outputs['Color']

    def mix(self, fac, a, b, blend='MIX'):
        m = self.n('ShaderNodeMix', data_type='RGBA', blend_type=blend)
        ins = [s for s in m.inputs if s.type == 'RGBA']
        facs = [s for s in m.inputs if s.name == 'Factor' and s.type == 'VALUE']
        self.set(facs[0], fac)
        self.set(ins[0], a)
        self.set(ins[1], b)
        return [s for s in m.outputs if s.type == 'RGBA'][0]

    def math(self, op, a, b=0.0):
        m = self.n('ShaderNodeMath', operation=op)
        self.set(m.inputs[0], a)
        self.set(m.inputs[1], b)
        return m.outputs[0]

    def bump(self, height, strength=0.2, distance=0.01, normal=None):
        b = self.n('ShaderNodeBump')
        b.inputs['Strength'].default_value = strength
        b.inputs['Distance'].default_value = distance
        self.L.new(height, b.inputs['Height'])
        if normal is not None:
            self.L.new(normal, b.inputs['Normal'])
        return b.outputs['Normal']

    def p(self, **kw):
        names = {'color': 'Base Color', 'rough': 'Roughness', 'metal': 'Metallic', 'normal': 'Normal',
                 'sheen': 'Sheen Weight', 'sheen_tint': 'Sheen Tint', 'spec': 'Specular IOR Level',
                 'coat': 'Coat Weight', 'sss': 'Subsurface Weight', 'emit': 'Emission Color',
                 'emit_s': 'Emission Strength', 'trans': 'Transmission Weight', 'ior': 'IOR'}
        for k, v in kw.items():
            self.set(self.bsdf.inputs[names[k]], v)
        return self


_cache = {}


def cached(fn):
    def w(*a, **k):
        key = (fn.__name__, a, tuple(sorted(k.items())))
        if key not in _cache or _cache[key].name not in bpy.data.materials:
            _cache[key] = fn(*a, **k)
        return _cache[key]
    return w


def clear_cache():
    _cache.clear()


@cached
def m_plaster(hexc, var=0.06, rough=0.92):
    b = NB('plaster')
    c = lin(hexc)
    v = b.coord(scale=(1, 1, 1))
    n1 = b.noise(v, 1.6, 8, 0.62)
    col = b.ramp(n1, [(0.3, scale_col(c, 1 - var)), (0.7, scale_col(c, 1 + var * 0.6))])
    n2 = b.noise(v, 9.0, 10, 0.7)
    b.p(color=col, rough=rough, normal=b.bump(n2, 0.06, 0.02), spec=0.25)
    return b.m


@cached
def m_microcement(hexc):
    b = NB('microcement')
    c = lin(hexc)
    v = b.coord()
    n1 = b.noise(v, 0.9, 12, 0.7, 0.3)
    col = b.ramp(n1, [(0.35, scale_col(c, 0.9)), (0.5, c), (0.68, scale_col(c, 1.08))])
    n2 = b.noise(v, 40, 6, 0.6)
    r = b.ramp(n1, [(0.3, (0.55, 0.55, 0.55, 1)), (0.7, (0.75, 0.75, 0.75, 1))])
    b.p(color=col, rough=r, normal=b.bump(n2, 0.04, 0.01), spec=0.35)
    return b.m


def _wood_color(b, v, tone):
    tones = {
        'light': ('#DCCAAE', '#C0A585'),
        'natural': ('#C8AE8E', '#A08466'),
        'smoked': ('#8E6A4A', '#5E432E'),
        'walnut': ('#6B4A33', '#3E2A1D'),
        'ash': ('#DCCBB0', '#BFA987'),
    }
    a, d = tones[tone]
    g1 = b.noise(v, 1.2, 6, 0.65, 0.8)
    col = b.ramp(g1, [(0.38, lin(a)), (0.62, lin(d))])
    return col


@cached
def m_wood(tone='natural', axis='X', rough=0.5, fluted=0.0):
    """Furniture wood; grain runs along local `axis`."""
    b = NB('wood_' + tone)
    sc = {'X': (0.6, 22, 22), 'Y': (22, 0.6, 22), 'Z': (22, 22, 0.6)}[axis]
    v = b.coord(scale=sc)
    col = _wood_color(b, v, tone)
    v2 = b.coord(scale=tuple(x * 0.25 for x in sc))
    fig = b.noise(v2, 1.5, 3, 0.5, 2.5)
    col = b.mix(0.35, col, b.ramp(fig, [(0.3, (1, 1, 1, 1)), (0.7, (0.78, 0.72, 0.66, 1))]), 'MULTIPLY')
    g = b.noise(b.coord(scale=tuple(x * 4 for x in sc)), 2.0, 2, 0.5)
    nrm = b.bump(g, 0.08, 0.002)
    if fluted:
        # vertical flutes on the fronts
        fv = b.coord(scale=(1, 1, 1))
        w = b.wave(fv, fluted, 0.0, 0.0, 'X', 'SIN')
        nrm = b.bump(w, 0.9, 0.006, nrm)
    b.p(color=col, rough=rough, normal=nrm, spec=0.4)
    return b.m


@cached
def m_floor(tone='natural', plank_w=0.2, plank_l=1.9, rough=0.48):
    b = NB('floor_' + tone)
    v = b.coord()
    br = b.n('ShaderNodeTexBrick', offset=0.37, offset_frequency=1, squash=1.0, squash_frequency=1)
    br.inputs['Color1'].default_value = (0.82, 0.82, 0.82, 1)
    br.inputs['Color2'].default_value = (1.0, 1.0, 1.0, 1)
    br.inputs['Mortar'].default_value = (0.35, 0.35, 0.35, 1)
    br.inputs['Scale'].default_value = 1.0
    br.inputs['Mortar Size'].default_value = 0.0012
    br.inputs['Mortar Smooth'].default_value = 0.3
    br.inputs['Bias'].default_value = 0.0
    br.inputs['Brick Width'].default_value = plank_l
    br.inputs['Row Height'].default_value = plank_w
    b.L.new(v, br.inputs['Vector'])
    vg = b.coord(scale=(0.5, 26, 26))
    col = _wood_color(b, vg, tone)
    col = b.mix(1.0, col, br.outputs['Color'], 'MULTIPLY')
    g = b.noise(b.coord(scale=(2, 90, 90)), 2.0, 2, 0.5)
    nrm = b.bump(g, 0.05, 0.002)
    nrm = b.bump(br.outputs['Fac'], 0.25, 0.002, nrm)
    rr = b.ramp(b.noise(v, 3.0, 4, 0.5), [(0.3, (rough - 0.08,) * 3 + (1,)), (0.7, (rough + 0.1,) * 3 + (1,))])
    b.p(color=col, rough=rr, normal=nrm, spec=0.45)
    return b.m


@cached
def m_stone(kind='travertine'):
    b = NB('stone_' + kind)
    v = b.coord()
    if kind in ('travertine', 'sandstone', 'limestone'):
        pal = {'travertine': ('#E2D5C0', '#C9B497', '#B09A7A'),
               'sandstone': ('#D9C3A2', '#C2A47C', '#A88B66'),
               'limestone': ('#E6DECF', '#D4C8B4', '#BFB29B')}[kind]
        vb = b.coord(scale=(0.35, 3.0, 3.0), rot=(0.0, 0.0, 0.06))
        w = b.wave(vb, 3.2, 5.0, 6.0, 'Y')
        col = b.ramp(w, [(0.15, lin(pal[0])), (0.45, lin(pal[1])), (0.55, lin(pal[2])), (0.7, lin(pal[1])),
                         (0.95, lin(pal[0]))])
        n = b.noise(v, 6, 8, 0.6)
        col = b.mix(0.35, col, b.ramp(n, [(0.4, lin(pal[0])), (0.6, lin(pal[2]))]), 'MIX')
        if kind == 'travertine':
            pores = b.voronoi(b.coord(scale=(1, 1, 3)), 70, 1.0)
            pm = b.ramp(pores, [(0.0, (0.55, 0.5, 0.45, 1)), (0.09, (1, 1, 1, 1))], 'CONSTANT')
            col = b.mix(1.0, col, pm, 'MULTIPLY')
            nrm = b.bump(b.math('MINIMUM', pores, 0.09), 0.5, 0.004)
        else:
            nrm = b.bump(b.noise(v, 60, 4, 0.6), 0.1, 0.004)
        b.p(color=col, rough=0.62, normal=nrm, spec=0.4)
    elif kind == 'marble':
        n = b.noise(v, 1.3, 9, 0.62, 3.0)
        col = b.ramp(n, [(0.0, lin('#EEEBE5')), (0.47, lin('#ECE8E1')), (0.5, lin('#9C978F')),
                         (0.53, lin('#E9E5DE')), (1.0, lin('#F2EFEA'))])
        b.p(color=col, rough=0.18, spec=0.5, normal=b.bump(b.noise(v, 30, 3), 0.02, 0.002))
    elif kind == 'graphite':
        n = b.noise(v, 5, 10, 0.65)
        col = b.ramp(n, [(0.35, lin('#2C2B28')), (0.65, lin('#45423C'))])
        b.p(color=col, rough=0.42, spec=0.5, normal=b.bump(b.noise(v, 80, 3), 0.05, 0.002))
    elif kind == 'verde':
        n = b.noise(v, 1.6, 9, 0.62, 2.6)
        col = b.ramp(n, [(0.0, lin('#5F6352')), (0.48, lin('#777865')), (0.5, lin('#C9C6B4')),
                         (0.52, lin('#6E705E')), (1.0, lin('#5A5C4C'))])
        b.p(color=col, rough=0.22, spec=0.5)
    return b.m


@cached
def m_fabric(hexc, kind='linen', sheen=0.4):
    b = NB('fabric_' + kind)
    c = lin(hexc)
    v = b.coord()
    n = b.noise(v, 4, 4, 0.5)
    col = b.ramp(n, [(0.3, scale_col(c, 0.93)), (0.7, scale_col(c, 1.04))])
    if kind == 'boucle':
        h = b.voronoi(b.coord(), 260, 1.0)
        h2 = b.noise(v, 180, 4, 0.7)
        hh = b.math('ADD', h, h2)
        nrm = b.bump(hh, 0.6, 0.003)
        col = b.mix(0.25, col, b.ramp(h, [(0.0, scale_col(c, 0.8)), (0.6, c)]), 'MIX')
        rough = 1.0
    elif kind == 'wool':
        nrm = b.bump(b.noise(v, 120, 6, 0.7), 0.4, 0.004)
        rough = 1.0
    elif kind == 'velvet':
        nrm = b.bump(b.noise(v, 50, 4, 0.5), 0.1, 0.002)
        rough = 0.9
        sheen = 0.9
    else:  # linen
        w1 = b.wave(b.coord(), 260, 0.4, 1.0, 'X')
        w2 = b.wave(b.coord(), 260, 0.4, 1.0, 'Y')
        slub = b.noise(b.coord(scale=(1, 30, 1)), 8, 2, 0.5)
        hh = b.math('ADD', b.math('MULTIPLY', w1, w2), b.math('MULTIPLY', slub, 0.6))
        nrm = b.bump(hh, 0.35, 0.002)
        rough = 0.95
    b.p(color=col, rough=rough, normal=nrm, sheen=sheen, spec=0.25)
    return b.m


@cached
def m_sheer(hexc='#F3EEE6', density=0.55):
    b = NB('sheer')
    tr = b.n('ShaderNodeBsdfTransparent')
    tl = b.n('ShaderNodeBsdfTranslucent')
    tl.inputs['Color'].default_value = lin(hexc)
    df = b.n('ShaderNodeBsdfDiffuse')
    df.inputs['Color'].default_value = lin(hexc)
    m1 = b.n('ShaderNodeMixShader')
    m1.inputs[0].default_value = 0.35
    b.L.new(tl.outputs[0], m1.inputs[1])
    b.L.new(df.outputs[0], m1.inputs[2])
    m2 = b.n('ShaderNodeMixShader')
    m2.inputs[0].default_value = density
    b.L.new(tr.outputs[0], m2.inputs[1])
    b.L.new(m1.outputs[0], m2.inputs[2])
    b.L.new(m2.outputs[0], b.out.inputs['Surface'])
    return b.m


@cached
def m_metal(hexc='#2A2723', rough=0.38):
    b = NB('metal')
    b.p(color=lin(hexc), metal=1.0, rough=rough)
    return b.m


@cached
def m_paint(hexc, rough=0.5):
    b = NB('paint')
    b.p(color=lin(hexc), rough=rough, spec=0.4)
    return b.m


@cached
def m_ceramic(hexc, rough=0.55, speckle=True):
    b = NB('ceramic')
    c = lin(hexc)
    v = b.coord()
    n = b.noise(v, 6, 4, 0.5)
    col = b.ramp(n, [(0.3, scale_col(c, 0.92)), (0.7, scale_col(c, 1.05))])
    if speckle:
        s = b.voronoi(b.coord(), 140, 1.0)
        col = b.mix(1.0, col, b.ramp(s, [(0.0, (0.45, 0.42, 0.4, 1)), (0.05, (1, 1, 1, 1))], 'CONSTANT'), 'MULTIPLY')
    b.p(color=col, rough=rough, spec=0.5, normal=b.bump(b.noise(v, 25, 3), 0.05, 0.003))
    return b.m


@cached
def m_paper_lamp(hexc='#F4EBDD', strength=6.0):
    b = NB('paperlamp')
    tl = b.n('ShaderNodeBsdfTranslucent')
    tl.inputs['Color'].default_value = lin(hexc)
    em = b.n('ShaderNodeEmission')
    em.inputs['Color'].default_value = lin('#FFD2A0')
    em.inputs['Strength'].default_value = strength
    m = b.n('ShaderNodeMixShader')
    m.inputs[0].default_value = 0.35
    b.L.new(tl.outputs[0], m.inputs[1])
    b.L.new(em.outputs[0], m.inputs[2])
    b.L.new(m.outputs[0], b.out.inputs['Surface'])
    return b.m


@cached
def m_emit(hexc='#FFE2B8', strength=8.0):
    b = NB('emit')
    em = b.n('ShaderNodeEmission')
    em.inputs['Color'].default_value = lin(hexc)
    em.inputs['Strength'].default_value = strength
    b.L.new(em.outputs[0], b.out.inputs['Surface'])
    return b.m


@cached
def m_leaf(hexc='#6F7356'):
    b = NB('leaf')
    c = lin(hexc)
    v = b.coord()
    n = b.noise(v, 3, 2, 0.5)
    col = b.ramp(n, [(0.3, scale_col(c, 0.75)), (0.7, scale_col(c, 1.15))])
    b.p(color=col, rough=0.55, spec=0.4)
    tl = b.n('ShaderNodeBsdfTranslucent')
    tl.inputs['Color'].default_value = scale_col(c, 1.4)
    m = b.n('ShaderNodeMixShader')
    m.inputs[0].default_value = 0.3
    b.L.new(b.bsdf.outputs[0], m.inputs[1])
    b.L.new(tl.outputs[0], m.inputs[2])
    b.L.new(m.outputs[0], b.out.inputs['Surface'])
    return b.m


@cached
def m_art(p1='#C8B396', p2='#8C7358', p3='#EFE8DC', seed=0.0):
    b = NB('art')
    v = b.coord('Generated', loc=(seed, seed * 0.5, 0))
    n = b.noise(v, 1.1, 3, 0.45, 1.2)
    col = b.ramp(n, [(0.38, lin(p3)), (0.46, lin(p1)), (0.6, lin(p1)), (0.66, lin(p2))])
    b.p(color=col, rough=0.85, normal=b.bump(b.noise(b.coord(), 90, 4), 0.15, 0.002))
    return b.m


@cached
def m_mirror():
    b = NB('mirror')
    b.p(color=(0.9, 0.9, 0.88, 1), metal=1.0, rough=0.02)
    return b.m


@cached
def m_grass():
    b = NB('grass')
    v = b.coord()
    n = b.noise(v, 2, 8, 0.6)
    col = b.ramp(n, [(0.35, lin('#5E5F3C')), (0.65, lin('#7F7C50'))])
    b.p(color=col, rough=1.0, spec=0.1, normal=b.bump(b.noise(v, 60, 4), 0.4, 0.01))
    return b.m


@cached
def m_glass():
    b = NB('glass')
    b.p(color=(1, 1, 1, 1), rough=0.0, trans=1.0, ior=1.45)
    return b.m


# --------------------------------------------------------------------------- geometry

def _ob(name, me, mat, parent=None):
    ob = bpy.data.objects.new(name, me)
    if mat is not None:
        me.materials.append(mat)
    link(ob)
    if parent is not None:
        ob.parent = parent
    return ob


def empty(name, loc=(0, 0, 0), rz=0.0, parent=None):
    e = bpy.data.objects.new(name, None)
    e.location = tuple(loc) + (0.0,) * (3 - len(loc))
    e.rotation_euler = (0, 0, math.radians(rz))
    link(e)
    if parent is not None:
        e.parent = parent
    return e


def smooth(me):
    for p in me.polygons:
        p.use_smooth = True


def box(name, dims, loc, mat, bevel=0.004, segs=3, rot=(0, 0, 0), parent=None, soft=0.0, sub=0):
    """Box centred at loc. `soft` adds a big rounded bevel + subdivision (cushions)."""
    bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=1.0)
    for v in bm.verts:
        v.co.x *= dims[0]
        v.co.y *= dims[1]
        v.co.z *= dims[2]
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    ob = _ob(name, me, mat, parent)
    ob.location = loc
    ob.rotation_euler = tuple(math.radians(r) for r in rot)
    if soft > 0:
        smooth(me)
        md = ob.modifiers.new('bev', 'BEVEL')
        md.width = soft
        md.segments = 4
        md.limit_method = 'NONE'
        ss = ob.modifiers.new('sub', 'SUBSURF')
        ss.levels = ss.render_levels = 2
    elif bevel > 0:
        smooth(me)
        md = ob.modifiers.new('bev', 'BEVEL')
        md.width = bevel
        md.segments = segs
        md.limit_method = 'ANGLE'
        md.harden_normals = True
    if sub:
        ss = ob.modifiers.new('sub2', 'SUBSURF')
        ss.levels = ss.render_levels = sub
    return ob


def cyl(name, r, h, loc, mat, verts=64, bevel=0.003, r2=None, rot=(0, 0, 0), parent=None, caps=True):
    bm = bmesh.new()
    bmesh.ops.create_cone(bm, cap_ends=caps, cap_tris=False, segments=verts, radius1=r,
                          radius2=r if r2 is None else r2, depth=h)
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    ob = _ob(name, me, mat, parent)
    ob.location = loc
    ob.rotation_euler = tuple(math.radians(x) for x in rot)
    smooth(me)
    if bevel > 0 and caps:
        md = ob.modifiers.new('bev', 'BEVEL')
        md.width = bevel
        md.segments = 3
        md.limit_method = 'ANGLE'
        md.harden_normals = True
    return ob


def sphere(name, r, loc, mat, scale=(1, 1, 1), parent=None, seg=48):
    bm = bmesh.new()
    bmesh.ops.create_uvsphere(bm, u_segments=seg, v_segments=seg // 2, radius=r)
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    ob = _ob(name, me, mat, parent)
    ob.location = loc
    ob.scale = scale
    smooth(me)
    return ob


def lathe(name, prof, loc, mat, thick=0.006, steps=72, parent=None, sx=1.0, sub=1):
    """Revolve a (r, z) profile around Z. Open shells get a solidify."""
    bm = bmesh.new()
    vs = [bm.verts.new((r, 0, z)) for r, z in prof]
    for a, b_ in zip(vs[:-1], vs[1:]):
        bm.edges.new((a, b_))
    bmesh.ops.spin(bm, geom=bm.verts[:] + bm.edges[:], cent=(0, 0, 0), axis=(0, 0, 1),
                   angle=math.tau, steps=steps, use_merge=True)
    bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=1e-5)
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    ob = _ob(name, me, mat, parent)
    ob.location = loc
    ob.scale = (sx, 1, 1)
    smooth(me)
    if thick:
        so = ob.modifiers.new('sol', 'SOLIDIFY')
        so.thickness = thick
        so.offset = -1
    if sub:
        ss = ob.modifiers.new('sub', 'SUBSURF')
        ss.levels = ss.render_levels = sub
    return ob


def tube(name, pts, radius, mat, parent=None, res=6):
    cu = bpy.data.curves.new(name, 'CURVE')
    cu.dimensions = '3D'
    cu.bevel_depth = radius
    cu.bevel_resolution = 3
    cu.use_fill_caps = True
    sp = cu.splines.new('NURBS')
    sp.points.add(len(pts) - 1)
    for p, c in zip(sp.points, pts):
        p.co = (c[0], c[1], c[2], 1)
    sp.use_endpoint_u = True
    sp.order_u = min(4, len(pts))
    sp.resolution_u = res
    ob = bpy.data.objects.new(name, cu)
    if mat:
        cu.materials.append(mat)
    link(ob)
    if parent is not None:
        ob.parent = parent
    return ob


def boolean_cut(target, cutter):
    md = target.modifiers.new('cut', 'BOOLEAN')
    md.operation = 'DIFFERENCE'
    md.solver = 'EXACT'
    md.object = cutter
    cutter.hide_render = True
    cutter.hide_viewport = True
    cutter.display_type = 'WIRE'
    # boolean must come before the bevel
    if len(target.modifiers) > 1:
        target.modifiers.move(len(target.modifiers) - 1, 0)


# --------------------------------------------------------------------------- room

def room(W, D, H, wall, floor, ceil=None, openings=(), t=0.25, frame_mat=None, skirting=True,
         portals=True, ceiling=True):
    """openings: dicts with wall in N,S,E,W; c = centre along wall; w; z0; z1; kind window|door|arch; mull."""
    ceil = ceil or wall
    frame_mat = frame_mat or m_metal('#24221E', 0.45)
    box('floor', (W + 2 * t, D + 2 * t, 0.1), (W / 2, D / 2, -0.05), floor, bevel=0)
    if ceiling:
        box('ceiling', (W + 2 * t, D + 2 * t, 0.1), (W / 2, D / 2, H + 0.05), ceil, bevel=0)
    walls = {
        'S': box('wall_S', (W + 2 * t, t, H), (W / 2, -t / 2, H / 2), wall, bevel=0),
        'N': box('wall_N', (W + 2 * t, t, H), (W / 2, D + t / 2, H / 2), wall, bevel=0),
        'W': box('wall_W', (t, D, H), (-t / 2, D / 2, H / 2), wall, bevel=0),
        'E': box('wall_E', (t, D, H), (W + t / 2, D / 2, H / 2), wall, bevel=0),
    }
    sk = m_paint('#E9E4DB', 0.6) if skirting is True else skirting
    for o in openings:
        side, c, w, z0, z1 = o['wall'], o['c'], o['w'], o.get('z0', 0.0), o['z1']
        kind = o.get('kind', 'window')
        h = z1 - z0
        zc = z0 + h / 2
        if side in 'NS':
            y = -t / 2 if side == 'S' else D + t / 2
            if kind == 'arch':
                cb = box('cut', (w, t * 3, h - w / 2), (c, y, z0 + (h - w / 2) / 2), None, bevel=0)
                cc = cyl('cutc', w / 2, t * 3, (c, y, z0 + h - w / 2), None, rot=(90, 0, 0), bevel=0)
                boolean_cut(walls[side], cb)
                boolean_cut(walls[side], cc)
            else:
                boolean_cut(walls[side], box('cut', (w, t * 3, h), (c, y, zc), None, bevel=0))
            if kind == 'window':
                _frame_ns(c, y, w, z0, z1, o.get('mull', 2), frame_mat, o.get('transom'))
            if portals and kind != 'door_inner':
                yy = (-t - 0.01) if side == 'S' else (D + t + 0.01)
                portal((c, yy, zc), w, h, 90 if side == 'S' else -90, 'X')
        else:
            x = -t / 2 if side == 'W' else W + t / 2
            if kind == 'arch':
                cb = box('cut', (t * 3, w, h - w / 2), (x, c, z0 + (h - w / 2) / 2), None, bevel=0)
                cc = cyl('cutc', w / 2, t * 3, (x, c, z0 + h - w / 2), None, rot=(0, 90, 0), bevel=0)
                boolean_cut(walls[side], cb)
                boolean_cut(walls[side], cc)
            else:
                boolean_cut(walls[side], box('cut', (t * 3, w, h), (x, c, zc), None, bevel=0))
            if kind == 'window':
                _frame_ew(x, c, w, z0, z1, o.get('mull', 2), frame_mat, o.get('transom'))
            if portals and kind != 'door_inner':
                xx = (-t - 0.01) if side == 'W' else (W + t + 0.01)
                portal((xx, c, zc), h, w, -90 if side == 'W' else 90, 'Y')
    if skirting:
        # shadow-gap skirting reads as quiet detailing
        box('sk_N', (W, 0.012, 0.08), (W / 2, D - 0.006, 0.04), sk, bevel=0.001)
        box('sk_W', (0.012, D, 0.08), (0.006, D / 2, 0.04), sk, bevel=0.001)
        box('sk_E', (0.012, D, 0.08), (W - 0.006, D / 2, 0.04), sk, bevel=0.001)
    return walls


def _frame_ns(c, y, w, z0, z1, mull, mat, transom):
    f, d = 0.045, 0.07
    box('fr', (w, d, f), (c, y, z0 + f / 2), mat, bevel=0.002)
    box('fr', (w, d, f), (c, y, z1 - f / 2), mat, bevel=0.002)
    box('fr', (f, d, z1 - z0), (c - w / 2 + f / 2, y, (z0 + z1) / 2), mat, bevel=0.002)
    box('fr', (f, d, z1 - z0), (c + w / 2 - f / 2, y, (z0 + z1) / 2), mat, bevel=0.002)
    for i in range(1, mull + 1):
        xx = c - w / 2 + w * i / (mull + 1)
        box('mu', (0.035, d, z1 - z0), (xx, y, (z0 + z1) / 2), mat, bevel=0.002)
    if transom:
        box('tr', (w, d, 0.035), (c, y, transom), mat, bevel=0.002)


def _frame_ew(x, c, w, z0, z1, mull, mat, transom):
    f, d = 0.045, 0.07
    box('fr', (d, w, f), (x, c, z0 + f / 2), mat, bevel=0.002)
    box('fr', (d, w, f), (x, c, z1 - f / 2), mat, bevel=0.002)
    box('fr', (d, f, z1 - z0), (x, c - w / 2 + f / 2, (z0 + z1) / 2), mat, bevel=0.002)
    box('fr', (d, f, z1 - z0), (x, c + w / 2 - f / 2, (z0 + z1) / 2), mat, bevel=0.002)
    for i in range(1, mull + 1):
        yy = c - w / 2 + w * i / (mull + 1)
        box('mu', (d, 0.035, z1 - z0), (x, yy, (z0 + z1) / 2), mat, bevel=0.002)
    if transom:
        box('tr', (d, w, 0.035), (x, c, transom), mat, bevel=0.002)


def portal(loc, sx, sy, ang, axis):
    ld = bpy.data.lights.new('portal', 'AREA')
    ld.shape = 'RECTANGLE'
    ld.size = sx
    ld.size_y = sy
    ld.cycles.is_portal = True
    ob = bpy.data.objects.new('portal', ld)
    ob.location = loc
    ob.rotation_euler = (math.radians(ang), 0, 0) if axis == 'X' else (0, math.radians(ang), 0)
    link(ob)
    return ob


def point_light(loc, power=40, radius=0.08, kelvin_hex='#FFC98A'):
    ld = bpy.data.lights.new('pt', 'POINT')
    ld.energy = power
    ld.shadow_soft_size = radius
    ld.color = lin(kelvin_hex)[:3]
    ob = bpy.data.objects.new('pt', ld)
    ob.location = loc
    link(ob)
    return ob


def area_light(loc, rot, size, power, hexc='#FFF4E8', sy=None):
    ld = bpy.data.lights.new('ar', 'AREA')
    ld.energy = power
    ld.color = lin(hexc)[:3]
    if sy:
        ld.shape = 'RECTANGLE'
        ld.size = size
        ld.size_y = sy
    else:
        ld.size = size
    ob = bpy.data.objects.new('ar', ld)
    ob.location = loc
    ob.rotation_euler = tuple(math.radians(r) for r in rot)
    link(ob)
    return ob


def daylight(sun_el=28, sun_az=200, sun_strength=4.0, sky_strength=0.35, sun_angle=2.5, warm='#FFF1DE'):
    """sun_az: compass angle, 0 = sun at +Y, 90 = sun at +X."""
    w = bpy.data.worlds.new('world')
    bpy.context.scene.world = w
    nt = w.node_tree
    bg = nt.nodes['Background']
    sky = nt.nodes.new('ShaderNodeTexSky')
    sky.sky_type = 'MULTIPLE_SCATTERING'
    sky.sun_disc = False
    sky.sun_elevation = math.radians(sun_el)
    sky.sun_rotation = math.radians(sun_az)
    sky.altitude = 100
    sky.air_density = 1.0
    sky.aerosol_density = 1.6
    nt.links.new(sky.outputs[0], bg.inputs['Color'])
    bg.inputs['Strength'].default_value = sky_strength
    el, az = math.radians(sun_el), math.radians(sun_az)
    d = Vector((math.cos(el) * math.sin(az), math.cos(el) * math.cos(az), math.sin(el)))
    ld = bpy.data.lights.new('sun', 'SUN')
    ld.energy = sun_strength
    ld.angle = math.radians(sun_angle)
    ld.color = lin(warm)[:3]
    ob = bpy.data.objects.new('sun', ld)
    ob.rotation_euler = (-d).to_track_quat('-Z', 'Y').to_euler()
    link(ob)
    return ob


# --------------------------------------------------------------------------- exterior

def garden(W, D, extent=40, trees=6, seed=3, hedge=True):
    box('ground', (extent * 2, extent * 2, 0.1), (W / 2, D / 2, -0.12), m_grass(), bevel=0)
    terrace = m_stone('limestone')
    box('terrace', (W + 6, 3.5, 0.06), (W / 2, -1.9, -0.05), terrace, bevel=0.003)
    r = random.Random(seed)
    for i in range(trees):
        side = r.choice(['S', 'E', 'W', 'S'])
        if side == 'S':
            x, y = r.uniform(-6, W + 6), r.uniform(-14, -7)
        elif side == 'E':
            x, y = r.uniform(W + 5, W + 14), r.uniform(-4, D + 4)
        else:
            x, y = r.uniform(-14, -5), r.uniform(-4, D + 4)
        tree((x, y, -0.07), height=r.uniform(4.5, 7.5), spread=r.uniform(1.8, 3.0), seed=seed + i,
             leaves=7000, leaf=0.2, leaf_hex='#7B7D58')
    if hedge:
        box('hedge', (W + 4, 0.9, 1.1), (W / 2, -6.2, 0.5), m_foliage('#7A7B56'), soft=0.2)
    backdrop(W, D, seed)


@cached
def m_foliage(hexc='#5E6548'):
    b = NB('foliage')
    c = lin(hexc)
    v = b.coord()
    n = b.noise(v, 3, 6, 0.6)
    col = b.ramp(n, [(0.35, scale_col(c, 0.6)), (0.65, scale_col(c, 1.2))])
    b.p(color=col, rough=0.85, spec=0.3, normal=b.bump(b.noise(v, 14, 4, 0.7), 0.8, 0.08))
    return b.m


def backdrop(W, D, seed=1, n=56, rmin=34, rmax=52):
    """Distant ring of soft tree masses so windows read as a garden, not a horizon."""
    r = random.Random(seed + 100)
    tex = bpy.data.textures.new('clouds', 'CLOUDS')
    tex.noise_scale = 1.4
    mats = [m_foliage('#7A7A55'), m_foliage('#868660'), m_foliage('#6B6E4C')]
    for i in range(n):
        a = i / n * math.tau + r.uniform(-0.05, 0.05)
        d = r.uniform(rmin, rmax)
        x, y = W / 2 + math.cos(a) * d, D / 2 + math.sin(a) * d
        rad = r.uniform(3.0, 5.5)
        bm = bmesh.new()
        bmesh.ops.create_icosphere(bm, subdivisions=4, radius=rad)
        me = bpy.data.meshes.new('mass')
        bm.to_mesh(me)
        bm.free()
        ob = _ob('mass', me, r.choice(mats))
        ob.location = (x, y, rad * r.uniform(0.1, 0.45))
        ob.scale = (1.3, 1.3, r.uniform(0.9, 1.25))
        ob.visible_shadow = False
        ob.visible_diffuse = False
        ob.visible_transmission = False
        smooth(me)
        md = ob.modifiers.new('disp', 'DISPLACE')
        md.texture = tex
        md.strength = rad * 0.35
        md.texture_coords = 'GLOBAL'


def tree(loc, height=3.0, spread=1.0, seed=1, leaves=900, leaf=0.05, leaf_hex='#6E7455', bark='#4A4036',
         trunk_r=None, parent=None):
    r = random.Random(seed)
    bark_m = m_paint(bark, 0.9)
    trunk_r = trunk_r or height * 0.02
    x0, y0, z0 = loc
    tips = []
    trunk = [(x0, y0, z0), (x0 + r.uniform(-.1, .1) * height, y0 + r.uniform(-.1, .1) * height, z0 + height * 0.35),
             (x0 + r.uniform(-.15, .15) * height, y0 + r.uniform(-.15, .15) * height, z0 + height * 0.55)]
    tube('trunk', trunk, trunk_r, bark_m, parent=parent)
    top = Vector(trunk[-1])
    for i in range(7):
        a = i / 7 * math.tau + r.uniform(-0.3, 0.3)
        ln = spread * r.uniform(0.6, 1.0)
        mid = top + Vector((math.cos(a) * ln * 0.4, math.sin(a) * ln * 0.4, height * r.uniform(0.12, 0.2)))
        end = top + Vector((math.cos(a) * ln * 0.8, math.sin(a) * ln * 0.8, height * r.uniform(0.25, 0.42)))
        tube('br', [tuple(top), tuple(mid), tuple(end)], trunk_r * 0.45, bark_m, parent=parent)
        tips.append(end)
        tips.append(mid.lerp(end, 0.5))
    # leaves: one mesh, many small quads around tips
    bm = bmesh.new()
    per = leaves // len(tips)
    for t in tips:
        for _ in range(per):
            c = t + Vector((r.gauss(0, spread * 0.26), r.gauss(0, spread * 0.26), r.gauss(0, height * 0.06)))
            rot = Euler((r.uniform(0, 6.28), r.uniform(0, 6.28), r.uniform(0, 6.28))).to_matrix()
            L, Wd = leaf * r.uniform(0.7, 1.2), leaf * 0.28
            pts = [Vector((-L / 2, 0, 0)), Vector((0, -Wd / 2, 0)), Vector((L / 2, 0, 0)), Vector((0, Wd / 2, 0))]
            vs = [bm.verts.new(c + rot @ p) for p in pts]
            bm.faces.new(vs)
    me = bpy.data.meshes.new('leaves')
    bm.to_mesh(me)
    bm.free()
    _ob('leaves', me, m_leaf(leaf_hex), parent)


# --------------------------------------------------------------------------- furniture

def sofa(loc, rz=0, L=2.8, Dp=1.05, fab=None, base=None, n=3, arms=False, pillows=('#B8A995', '#777765'),
         parent=None):
    fab = fab or m_fabric('#E4DCCF', 'boucle')
    base = base or m_wood('smoked')
    g = empty('sofa', loc, rz, parent)
    box('plinth', (L - 0.16, Dp - 0.16, 0.08), (0, 0, 0.04), base, bevel=0.004, parent=g)
    box('base', (L, Dp, 0.2), (0, 0, 0.18), fab, soft=0.03, parent=g)
    cw = (L - 0.04) / n
    for i in range(n):
        x = -L / 2 + 0.02 + cw * (i + 0.5)
        box('seat', (cw - 0.015, Dp - 0.26, 0.17), (x, -0.11, 0.36), fab, soft=0.06, parent=g)
        box('back', (cw - 0.02, 0.2, 0.42), (x, Dp / 2 - 0.2, 0.58), fab, soft=0.08, rot=(-10, 0, 0), parent=g)
    box('backbase', (L, 0.16, 0.36), (0, Dp / 2 - 0.08, 0.44), fab, soft=0.05, parent=g)
    if arms:
        for s in (-1, 1):
            box('arm', (0.18, Dp, 0.34), (s * (L / 2 - 0.09), 0, 0.42), fab, soft=0.06, parent=g)
    for i, hc in enumerate(pillows):
        x = -L / 2 + 0.45 + i * 0.42
        box('pillow', (0.48, 0.14, 0.44), (x, Dp / 2 - 0.36, 0.66), m_fabric(hc, 'linen'), soft=0.06,
            rot=(-14, 0, 8 - i * 12), parent=g)
    return g


def lounge_chair(loc, rz=0, fab=None, wood=None, parent=None, tone='natural'):
    fab = fab or m_fabric('#D9CDBB', 'linen')
    wood = wood or m_wood(tone, 'Z')
    g = empty('chair', loc, rz, parent)
    for sx in (-1, 1):
        for sy in (-1, 1):
            box('leg', (0.045, 0.045, 0.38), (sx * 0.34, sy * 0.36, 0.19), wood, bevel=0.006, parent=g)
        box('rail', (0.045, 0.8, 0.045), (sx * 0.34, 0, 0.36), m_wood(tone, 'Y'), bevel=0.006, parent=g)
        box('armrest', (0.07, 0.72, 0.035), (sx * 0.34, 0.02, 0.6), m_wood(tone, 'Y'), bevel=0.01, parent=g)
        box('armpost', (0.04, 0.04, 0.24), (sx * 0.34, -0.3, 0.48), wood, bevel=0.006, parent=g)
    box('seat', (0.68, 0.72, 0.14), (0, -0.02, 0.44), fab, soft=0.05, parent=g)
    box('back', (0.66, 0.16, 0.5), (0, 0.32, 0.74), fab, soft=0.06, rot=(-16, 0, 0), parent=g)
    return g


def coffee_table(loc, rz=0, kind='slab', stone=None, parent=None):
    stone = stone or m_stone('travertine')
    g = empty('ctable', loc, rz, parent)
    if kind == 'slab':
        box('top', (1.4, 0.8, 0.07), (0, 0, 0.335), stone, bevel=0.006, parent=g)
        for s in (-1, 1):
            box('leg', (0.26, 0.62, 0.3), (s * 0.45, 0, 0.15), stone, bevel=0.006, parent=g)
    elif kind == 'drum':
        cyl('drum', 0.55, 0.36, (0, 0, 0.18), stone, bevel=0.008, parent=g)
    elif kind == 'pair':
        cyl('d1', 0.5, 0.34, (0, 0, 0.17), stone, bevel=0.008, parent=g)
        cyl('d2', 0.34, 0.26, (0.62, -0.32, 0.13), stone, bevel=0.008, parent=g)
    return g


def rug(loc, dims=(3.2, 2.3), hexc='#D8CCB8', rz=0, parent=None):
    g = empty('rug', loc, rz, parent)
    box('rug', (dims[0], dims[1], 0.014), (0, 0, 0.007), m_fabric(hexc, 'wool'), bevel=0.006, parent=g)
    return g


def dining_table(loc, rz=0, L=2.4, Wd=1.0, wood=None, chairs=8, chair_fab='#D6CBB9', parent=None, round_=False,
                 tone='natural'):
    wood = wood or m_wood(tone)
    g = empty('dtable', loc, rz, parent)
    if round_:
        cyl('top', 0.65, 0.045, (0, 0, 0.7475), wood, bevel=0.006, parent=g)
        cyl('ped', 0.22, 0.72, (0, 0, 0.36), m_stone('travertine'), r2=0.16, bevel=0.004, parent=g)
        for i in range(chairs):
            a = i / chairs * math.tau
            dining_chair((math.cos(a) * 0.82, math.sin(a) * 0.82, 0), math.degrees(a) + 90, chair_fab, parent=g, tone=tone)
        return g
    box('top', (L, Wd, 0.05), (0, 0, 0.745), wood, bevel=0.006, parent=g)
    for s in (-1, 1):
        box('leg', (0.09, Wd - 0.25, 0.72), (s * (L / 2 - 0.35), 0, 0.36), m_wood(tone, 'Z'), bevel=0.006,
            parent=g)
    per = chairs // 2
    for i in range(per):
        x = -L / 2 + L * (i + 0.5) / per
        dining_chair((x, -Wd / 2 - 0.12, 0), 0, chair_fab, parent=g, tone=tone)
        dining_chair((x, Wd / 2 + 0.12, 0), 180, chair_fab, parent=g, tone=tone)
    return g


def dining_chair(loc, rz=0, fab='#D6CBB9', parent=None, tone='natural'):
    wood = m_wood(tone, 'Z')
    g = empty('dchair', loc, rz + rnd.uniform(-4, 4), parent)
    for sx in (-1, 1):
        for sy in (-1, 1):
            cyl('leg', 0.019, 0.45, (sx * 0.2, sy * 0.2, 0.225), wood, r2=0.014, verts=24, bevel=0, parent=g)
        cyl('post', 0.017, 0.38, (sx * 0.2, -0.2, 0.64), wood, verts=24, bevel=0, parent=g)
    box('seat', (0.46, 0.46, 0.035), (0, 0, 0.462), m_wood(tone, 'X'), bevel=0.006, parent=g)
    box('pad', (0.42, 0.42, 0.04), (0, 0.01, 0.497), m_fabric(fab, 'linen'), soft=0.015, parent=g)
    box('backrest', (0.44, 0.025, 0.11), (0, -0.21, 0.78), m_wood(tone, 'X'), bevel=0.008, rot=(-6, 0, 0),
        parent=g)
    return g


def pendant_lantern(loc, ceil_z, r=0.32, h=0.26, power=25, parent=None, strength=5.0):
    x, y, z = loc
    cyl('cable', 0.003, ceil_z - z, (x, y, (ceil_z + z) / 2), m_metal('#1E1C19', 0.5), verts=8, bevel=0, parent=parent)
    sphere('lantern', 1.0, (x, y, z - h / 2), m_paper_lamp(strength=strength), scale=(r, r, h / 2), parent=parent)
    if power:
        point_light((x, y, z - h / 2), power, 0.12)


def pendant_linear(loc, ceil_z, L=1.6, power=30, parent=None, rz=0):
    x, y, z = loc
    g = empty('lin', (x, y, z), rz, parent)
    box('bar', (L, 0.045, 0.035), (0, 0, 0), m_metal('#3A3229', 0.35), bevel=0.003, parent=g)
    box('diff', (L - 0.04, 0.03, 0.004), (0, 0, -0.019), m_emit('#FFDDB0', 6), bevel=0, parent=g)
    for s in (-1, 1):
        cyl('cab', 0.0025, ceil_z - z, (s * (L / 2 - 0.1), 0, (ceil_z - z) / 2), m_metal('#1E1C19'), verts=8, bevel=0,
            parent=g)
    if power:
        area_light((x, y, z - 0.03), (0, 0, rz), L * 0.9, power, '#FFD9A8', 0.04)
    return g


def floor_lamp(loc, h=1.55, power=25, parent=None):
    x, y, _ = loc
    cyl('base', 0.15, 0.025, (x, y, 0.0125), m_metal('#2B2620', 0.35), bevel=0.003, parent=parent)
    cyl('stem', 0.009, h, (x, y, h / 2), m_metal('#2B2620', 0.35), verts=16, bevel=0, parent=parent)
    sh = cyl('shade', 0.2, 0.32, (x, y, h), m_fabric('#EFE7DA', 'linen'), r2=0.15, caps=False, bevel=0, parent=parent)
    sh.modifiers.new('s', 'SOLIDIFY').thickness = 0.004
    if power:
        point_light((x, y, h - 0.02), power, 0.06)


def table_lamp(loc, power=12, parent=None, base_hex='#CFC2AE'):
    x, y, z = loc
    lathe('lampbase', [(0.0, 0.0), (0.07, 0.0), (0.11, 0.08), (0.1, 0.2), (0.04, 0.3), (0.012, 0.34)],
          (x, y, z), m_ceramic(base_hex, 0.6), thick=0, parent=parent)
    sh = cyl('shade', 0.17, 0.2, (x, y, z + 0.42), m_fabric('#F1EADF', 'linen'), r2=0.13, caps=False, bevel=0,
             parent=parent)
    sh.modifiers.new('s', 'SOLIDIFY').thickness = 0.003
    if power:
        point_light((x, y, z + 0.4), power, 0.05)


VASES = {
    'amphora': [(0.0, 0.0), (0.06, 0.0), (0.11, 0.07), (0.13, 0.19), (0.1, 0.31), (0.05, 0.38), (0.045, 0.41),
                (0.055, 0.43)],
    'bottle': [(0.0, 0.0), (0.07, 0.0), (0.085, 0.05), (0.085, 0.22), (0.05, 0.3), (0.022, 0.36), (0.022, 0.48),
               (0.028, 0.5)],
    'bowl': [(0.0, 0.0), (0.06, 0.0), (0.13, 0.03), (0.18, 0.08), (0.2, 0.11)],
    'moon': [(0.0, 0.0), (0.05, 0.0), (0.12, 0.05), (0.15, 0.14), (0.12, 0.24), (0.06, 0.28), (0.06, 0.3)],
    'cyl': [(0.0, 0.0), (0.08, 0.0), (0.085, 0.01), (0.085, 0.28)],
    'urn': [(0.0, 0.0), (0.1, 0.0), (0.16, 0.12), (0.2, 0.32), (0.17, 0.5), (0.13, 0.56), (0.14, 0.6)],
}


def vase(loc, kind='amphora', hexc='#CDBFA9', scale=1.0, parent=None, rough=0.6):
    prof = [(r * scale, z * scale) for r, z in VASES[kind]]
    return lathe('vase', prof, loc, m_ceramic(hexc, rough), thick=0.006 * scale, parent=parent)


def branches(loc, n=7, h=0.9, spread=0.35, seed=1, leaves=True, leaf_hex='#7C7F60', parent=None, dry=False):
    r = random.Random(seed)
    x, y, z = loc
    stem = m_paint('#4B3E31' if not dry else '#8C7A62', 0.8)
    bm = bmesh.new()
    for i in range(n):
        a = r.uniform(0, math.tau)
        lean = r.uniform(0.15, 1.0) * spread
        pts = [(x, y, z),
               (x + math.cos(a) * lean * 0.25, y + math.sin(a) * lean * 0.25, z + h * 0.35),
               (x + math.cos(a) * lean * 0.7, y + math.sin(a) * lean * 0.7, z + h * r.uniform(0.65, 0.85)),
               (x + math.cos(a + 0.4) * lean, y + math.sin(a + 0.4) * lean, z + h * r.uniform(0.85, 1.05))]
        tube('stem', pts, 0.0035 if not dry else 0.0022, stem, parent=parent)
        if leaves or dry:
            for k in range(26 if not dry else 14):
                t = r.uniform(0.35, 1.0)
                # rough point along polyline
                seg = min(2, int(t * 3))
                lt = t * 3 - seg
                p = Vector(pts[seg]).lerp(Vector(pts[seg + 1]), lt)
                rot = Euler((r.uniform(0, 6.28), r.uniform(0, 6.28), r.uniform(0, 6.28))).to_matrix()
                L, Wd = (0.055, 0.012) if not dry else (0.035, 0.018)
                q = [Vector((0, 0, 0)), Vector((L * 0.5, -Wd / 2, 0)), Vector((L, 0, 0)), Vector((L * 0.5, Wd / 2, 0))]
                vs = [bm.verts.new(p + rot @ v) for v in q]
                bm.faces.new(vs)
    me = bpy.data.meshes.new('leaves')
    bm.to_mesh(me)
    bm.free()
    _ob('leaves', me, m_leaf(leaf_hex) if not dry else m_fabric('#C9B48F', 'linen'), parent)


def books(loc, rz=0, n=4, parent=None, seed=2, palette=('#D9CFC0', '#8D8571', '#B8A995', '#E9E4DB', '#5E5A4B')):
    r = random.Random(seed)
    g = empty('books', loc, rz, parent)
    z = 0
    for i in range(n):
        w, d, t = r.uniform(0.22, 0.3), r.uniform(0.17, 0.24), r.uniform(0.022, 0.04)
        box('book', (w, d, t), (r.uniform(-.01, .01), r.uniform(-.01, .01), z + t / 2),
            m_fabric(r.choice(palette), 'linen', 0.2), bevel=0.002, rot=(0, 0, r.uniform(-6, 6)), parent=g)
        z += t
    return z


def artwork(loc, size=(1.0, 1.3), rz=0, palette=('#C8B396', '#8C7358', '#EFE8DC'), seed=0.0, parent=None,
            frame='#2A2621', lean=0.0):
    g = empty('art', loc, rz, parent)
    if lean:
        g.rotation_euler.x = math.radians(lean)
    box('frame', (size[0] + 0.04, 0.035, size[1] + 0.04), (0, 0, 0), m_wood('smoked') if frame == 'oak' else m_paint(frame, 0.5),
        bevel=0.003, parent=g)
    box('canvas', (size[0], 0.01, size[1]), (0, -0.02, 0), m_art(*palette, seed=seed), bevel=0, parent=g)
    return g


def curtain(x0, x1, y, z0, z1, mat=None, folds=None, axis='X', parent=None):
    """Sheer curtain hanging in a line along X (or Y) at fixed y (or x)."""
    mat = mat or m_sheer()
    L = abs(x1 - x0)
    folds = folds or max(2, int(L / 0.14))
    nx, nz = folds * 8, 4
    bm = bmesh.new()
    grid = []
    for j in range(nz + 1):
        row = []
        for i in range(nx + 1):
            u = i / nx
            a = x0 + (x1 - x0) * u
            off = math.sin(u * folds * math.tau) * 0.045
            zz = z0 + (z1 - z0) * j / nz
            co = (a, y + off, zz) if axis == 'X' else (y + off, a, zz)
            row.append(bm.verts.new(co))
        grid.append(row)
    for j in range(nz):
        for i in range(nx):
            bm.faces.new((grid[j][i], grid[j][i + 1], grid[j + 1][i + 1], grid[j + 1][i]))
    me = bpy.data.meshes.new('curtain')
    bm.to_mesh(me)
    bm.free()
    smooth(me)
    return _ob('curtain', me, mat, parent)


def kitchen_run(x0, x1, y_wall, side='N', wood=None, top=None, H=2.6, tall=True, parent=None):
    """Base cabinets + worktop along N wall (y_wall is the wall face)."""
    wood = wood or m_wood('natural', 'Z')
    top = top or m_stone('travertine')
    L = x1 - x0
    s = -1 if side == 'N' else 1
    yc = y_wall + s * 0.31
    n = max(1, int(L / 0.6))
    dw = L / n
    for i in range(n):
        box('door', (dw - 0.004, 0.02, 0.86), (x0 + dw * (i + 0.5), y_wall + s * 0.61, 0.47), wood, bevel=0.002)
    box('carcass', (L, 0.6, 0.86), (x0 + L / 2, yc, 0.47), m_paint('#D9D2C6', 0.6), bevel=0)
    box('plinth', (L, 0.58, 0.04), (x0 + L / 2, yc - s * 0.02, 0.02), m_paint('#3A352E', 0.7), bevel=0)
    box('worktop', (L + 0.02, 0.64, 0.03), (x0 + L / 2, y_wall + s * 0.32, 0.915), top, bevel=0.003)
    box('splash', (L, 0.02, 0.6), (x0 + L / 2, y_wall + s * 0.01, 1.23), top, bevel=0.002)
    if tall:
        box('shelf', (L * 0.55, 0.28, 0.04), (x0 + L * 0.3, y_wall + s * 0.14, 1.7), wood, bevel=0.003)
        for k in range(3):
            vase((x0 + L * 0.12 + k * 0.28, y_wall + s * 0.14, 1.72), ['cyl', 'moon', 'bottle'][k],
                 ['#E2DACB', '#B8A995', '#8B8670'][k], 0.7)


def island(loc, L=2.6, Dp=1.0, wood=None, top=None, stools=3, rz=0):
    wood = wood or m_wood('natural', 'Z', fluted=180)
    top = top or m_stone('travertine')
    g = empty('island', loc, rz)
    box('body', (L, Dp, 0.86), (0, 0, 0.45), wood, bevel=0.004, parent=g)
    box('plinth', (L - 0.08, Dp - 0.08, 0.04), (0, 0, 0.02), m_paint('#3A352E', 0.7), bevel=0, parent=g)
    box('top', (L + 0.06, Dp + 0.06, 0.05), (0, 0, 0.905), top, bevel=0.004, parent=g)
    tube('tap', [(0.5, 0.25, 0.93), (0.5, 0.25, 1.22), (0.5, 0.1, 1.24), (0.5, 0.02, 1.15)], 0.011,
         m_metal('#6E5A44', 0.3), parent=g)
    box('sink', (0.6, 0.4, 0.002), (0.5, -0.05, 0.931), m_paint('#4A443C', 0.7), bevel=0, parent=g)
    for i in range(stools):
        x = -L / 2 + L * (i + 0.5) / stools
        cyl('stool', 0.19, 0.04, (x, -Dp / 2 - 0.42, 0.66), m_fabric('#8A8268', 'linen'), bevel=0.012, parent=g)
        for k in range(3):
            a = k / 3 * math.tau
            tube('sl', [(x + math.cos(a) * 0.17, -Dp / 2 - 0.42 + math.sin(a) * 0.17, 0.0),
                        (x + math.cos(a) * 0.1, -Dp / 2 - 0.42 + math.sin(a) * 0.1, 0.64)], 0.012,
                 m_wood('smoked', 'Z'), parent=g)
    return g


def bed(loc, rz=0, linen='#EFE9DF', throw='#777765', headboard='#D8CDBB', parent=None, tone='natural',
        stands='travertine', head=True):
    g = empty('bed', loc, rz, parent)
    box('platform', (2.0, 2.15, 0.22), (0, 0, 0.13), m_wood(tone), bevel=0.006, parent=g)
    box('mattress', (1.85, 2.0, 0.22), (0, -0.02, 0.35), m_fabric('#F2EEE7', 'linen'), soft=0.04, parent=g)
    box('duvet', (1.95, 1.45, 0.09), (0, -0.33, 0.49), m_fabric(linen, 'linen'), soft=0.05, sub=1, parent=g)
    box('fold', (1.95, 0.22, 0.07), (0, 0.42, 0.5), m_fabric(linen, 'linen'), soft=0.04, parent=g)
    for s in (-1, 1):
        box('pillow', (0.72, 0.18, 0.46), (s * 0.43, 0.82, 0.62), m_fabric('#F4F0EA', 'linen'), soft=0.07,
            rot=(-20, 0, 0), parent=g)
        box('pillow2', (0.6, 0.16, 0.36), (s * 0.4, 0.7, 0.6), m_fabric('#E4D9C8', 'linen'), soft=0.06,
            rot=(-16, 0, s * 4), parent=g)
    box('throw', (1.98, 0.5, 0.05), (0, -0.78, 0.53), m_fabric(throw, 'wool'), soft=0.02, parent=g)
    if head:
        box('headboard', (2.6, 0.1, 1.15), (0, 1.1, 0.68), m_fabric(headboard, 'linen'), soft=0.03, parent=g)
    if stands:
        for s in (-1, 1):
            box('nightstand', (0.5, 0.42, 0.5), (s * 1.38, 0.85, 0.25), m_stone(stands) if stands != 'oak' else m_wood(tone),
                bevel=0.006, parent=g)
    return g


def shelf_niche(x0, x1, y_wall, z0, rows=3, gap=0.42, wood=None, side='N', seed=3):
    wood = wood or m_wood('natural')
    s = -1 if side == 'N' else 1
    r = random.Random(seed)
    L = x1 - x0
    for k in range(rows):
        z = z0 + k * gap
        box('sh', (L, 0.3, 0.035), (x0 + L / 2, y_wall + s * 0.15, z), wood, bevel=0.003)
        x = x0 + 0.15
        while x < x1 - 0.3:
            c = r.random()
            if c < 0.4:
                hb = books((x + 0.12, y_wall + s * 0.14, z + 0.0175), r.uniform(-5, 5), r.randint(3, 6), seed=r.randint(0, 99))
                x += 0.38
            elif c < 0.75:
                vase((x + 0.1, y_wall + s * 0.15, z + 0.0175), r.choice(['amphora', 'bottle', 'moon', 'cyl']),
                     r.choice(['#E2DACB', '#B8A995', '#8B8670', '#CFC2AE', '#6E6A5A']), r.uniform(0.5, 0.8))
                x += 0.3
            else:
                x += 0.25


def beams(W, D, H, n=6, axis='Y', wood=None, depth=0.22):
    wood = wood or m_wood('natural', axis)
    for i in range(n):
        if axis == 'Y':
            x = W * (i + 0.5) / n
            box('beam', (0.16, D, depth), (x, D / 2, H - depth / 2), wood, bevel=0.006)
        else:
            y = D * (i + 0.5) / n
            box('beam', (W, 0.16, depth), (W / 2, y, H - depth / 2), wood, bevel=0.006)


def slats(x0, x1, y_wall, H, wood=None, pitch=0.06, side='N'):
    wood = wood or m_wood('natural', 'Z')
    s = -1 if side == 'N' else 1
    x = x0
    while x < x1:
        box('slat', (0.035, 0.03, H), (x, y_wall + s * 0.015, H / 2), wood, bevel=0.002)
        x += pitch


# --------------------------------------------------------------------------- camera / render

def camera(loc, target, lens=28, fstop=0.0, focus=None, shift=(0, 0)):
    cd = bpy.data.cameras.new('cam')
    cd.lens = lens
    cd.sensor_width = 36
    cd.shift_x, cd.shift_y = shift
    cd.clip_start = 0.05
    cd.clip_end = 200
    ob = bpy.data.objects.new('cam', cd)
    link(ob)
    aim(ob, loc, target)
    if fstop:
        cd.dof.use_dof = True
        cd.dof.aperture_fstop = fstop
        cd.dof.focus_distance = focus if focus else (Vector(target) - Vector(loc)).length
    bpy.context.scene.camera = ob
    return ob


def aim(ob, loc, target, roll=0.0):
    ob.location = loc
    d = Vector(target) - Vector(loc)
    q = d.to_track_quat('-Z', 'Y')
    e = q.to_euler()
    if roll:
        e.y += math.radians(roll)
    ob.rotation_euler = e


def setup_render(w, h, samples=128, exposure=0.0, look='AgX - Medium High Contrast', threshold=0.015,
                 bounces=8):
    sc = bpy.context.scene
    sc.render.engine = 'CYCLES'
    cy = sc.cycles
    cy.device = 'CPU'
    cy.samples = samples
    cy.use_adaptive_sampling = True
    cy.adaptive_threshold = threshold
    cy.use_denoising = True
    cy.denoiser = 'OPENIMAGEDENOISE'
    cy.denoising_input_passes = 'RGB_ALBEDO_NORMAL'
    cy.denoising_prefilter = 'ACCURATE'
    cy.max_bounces = bounces
    cy.diffuse_bounces = 5
    cy.glossy_bounces = 4
    cy.transmission_bounces = 8
    cy.transparent_max_bounces = 16
    cy.caustics_reflective = False
    cy.caustics_refractive = False
    cy.blur_glossy = 1.0
    cy.sample_clamp_indirect = 8.0
    cy.seed = 11
    cy.use_animated_seed = False
    sc.render.resolution_x = w
    sc.render.resolution_y = h
    sc.render.resolution_percentage = 100
    sc.render.use_persistent_data = True
    vs = sc.view_settings
    vs.view_transform = 'AgX'
    try:
        vs.look = look
    except Exception:
        try:
            vs.look = look.replace('AgX - ', '')
        except Exception as e:
            print('look not set', e)
    vs.exposure = exposure
    print('LOOK', vs.view_transform, vs.look)
    sc.render.image_settings.file_format = 'PNG'
    sc.render.image_settings.color_depth = '8'
    return sc


def render(path):
    sc = bpy.context.scene
    sc.render.filepath = path
    bpy.ops.render.render(write_still=True)


@cached
def m_tiles(kind='limestone', size=0.6):
    b = NB('tiles_' + kind)
    v = b.coord()
    pal = {'limestone': ('#E3D9C8', '#CFC2AC'), 'sandstone': ('#DCC8A8', '#C4AB86'),
           'terracotta': ('#C79B7A', '#A97C5D')}[kind]
    br = b.n('ShaderNodeTexBrick', offset=0.5, offset_frequency=2)
    br.inputs['Color1'].default_value = lin(pal[0])
    br.inputs['Color2'].default_value = lin(pal[1])
    br.inputs['Mortar'].default_value = lin('#BDB2A0')
    br.inputs['Scale'].default_value = 1.0
    br.inputs['Mortar Size'].default_value = 0.003
    br.inputs['Bias'].default_value = -0.3
    br.inputs['Brick Width'].default_value = size * 1.5
    br.inputs['Row Height'].default_value = size
    b.L.new(v, br.inputs['Vector'])
    n = b.noise(v, 8, 6, 0.6)
    col = b.mix(0.25, br.outputs['Color'], b.ramp(n, [(0.4, lin(pal[1])), (0.6, lin(pal[0]))]), 'MIX')
    nrm = b.bump(br.outputs['Fac'], 0.4, 0.003)
    nrm = b.bump(b.noise(v, 40, 4), 0.08, 0.003, nrm)
    b.p(color=col, rough=0.7, normal=nrm, spec=0.35)
    return b.m


@cached
def m_facade(hexc):
    b = NB('facade')
    c = lin(hexc)
    v = b.coord()
    br = b.n('ShaderNodeTexBrick', offset=0.0, offset_frequency=1)
    br.inputs['Color1'].default_value = c
    br.inputs['Color2'].default_value = scale_col(c, 0.95)
    br.inputs['Mortar'].default_value = scale_col(c, 0.35)
    br.inputs['Scale'].default_value = 1.0
    br.inputs['Mortar Size'].default_value = 0.6
    br.inputs['Brick Width'].default_value = 2.2
    br.inputs['Row Height'].default_value = 3.2
    tc = b.n('ShaderNodeTexCoord')
    sep = b.coord(rot=(math.pi / 2, 0, 0))
    b.L.new(sep, br.inputs['Vector'])
    b.p(color=br.outputs['Color'], rough=0.7)
    return b.m


def cityscape(W, D, seed=4, n=40):
    r = random.Random(seed)
    cols = ['#CFC6B8', '#BDB4A6', '#D9D2C6', '#A9A196', '#C8BCA8']
    for i in range(n):
        a = r.uniform(math.pi * 1.05, math.pi * 1.95)  # south half
        d = r.uniform(26, 60)
        x, y = W / 2 + math.cos(a) * d, D / 2 + math.sin(a) * d
        h = r.uniform(10, 34)
        ob = box('bld', (r.uniform(8, 16), r.uniform(8, 14), h), (x, y, h / 2 - 8), m_facade(r.choice(cols)), bevel=0,
                 rot=(0, 0, r.uniform(-8, 8)))
        ob.visible_shadow = False
        ob.visible_diffuse = False
    box('street', (200, 200, 0.1), (W / 2, D / 2, -8.0), m_paint('#8C877E', 0.9), bevel=0)
    for i in range(14):
        x, y = r.uniform(-10, W + 10), r.uniform(-24, -9)
        tree((x, y, -8.0), height=r.uniform(7, 10), spread=r.uniform(2.2, 3.2), seed=seed + i, leaves=5000, leaf=0.22,
             leaf_hex='#7B7D58')


def tub(loc, rz=0, hexc='#F1EDE6', parent=None):
    g = empty('tub', loc, rz, parent)
    lathe('tub', [(0.0, 0.0), (0.26, 0.0), (0.36, 0.08), (0.42, 0.3), (0.44, 0.56), (0.42, 0.58)], (0, 0, 0),
          m_ceramic(hexc, 0.35, False), thick=0.035, parent=g, sx=2.0)
    return g


def round_mirror(loc, axis='Y', r=0.42, side=1, parent=None):
    rot = (90, 0, 0) if axis == 'Y' else (0, 90, 0)
    cyl('mirror', r, 0.012, loc, m_mirror(), rot=rot, bevel=0.002, parent=parent)
    off = Vector((0, -side * 0.006, 0)) if axis == 'Y' else Vector((-side * 0.006, 0, 0))
    cyl('mframe', r + 0.015, 0.02, tuple(Vector(loc) + off), m_metal('#7A6650', 0.3), rot=rot, bevel=0.003,
        parent=parent)
