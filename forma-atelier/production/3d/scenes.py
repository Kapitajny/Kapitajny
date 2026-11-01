"""Project rooms for FORMA ATELIER. Each builder creates one room; SHOTS maps photo -> camera."""
import math
from lib import *
import scene_villa


def _start():
    reset()
    clear_cache()


# ----------------------------------------------------------------- Quiet Residence (apartment 115 m2)

def qr_living():
    _start()
    W, D, H = 7.0, 5.6, 2.95
    room(W, D, H, m_plaster('#EFEBE4', 0.04), m_floor('ash', 0.18, 1.6), openings=[
        dict(wall='S', c=1.9, w=2.3, z0=0.0, z1=2.65, mull=1),
        dict(wall='S', c=5.1, w=2.3, z0=0.0, z1=2.65, mull=1),
    ])
    garden(W, D, trees=8, seed=12, hedge=False)
    curtain(0.15, 0.6, 0.17, 0.02, 2.9)
    curtain(3.25, 3.75, 0.17, 0.02, 2.9)
    curtain(6.4, 6.85, 0.17, 0.02, 2.9)
    rug((3.4, 3.65), (3.4, 2.5), '#E3DACC')
    sofa((3.4, 4.75), 0, L=2.7, Dp=1.0, n=2, arms=True, fab=m_fabric('#E6E0D5', 'linen'),
         base=m_wood('ash'), pillows=('#A3A58C', '#D8CDB9'))
    coffee_table((3.25, 3.55), 0, 'pair', stone=m_stone('travertine'))
    vase((3.05, 3.5, 0.34), 'bowl', '#E8E1D4', 0.8)
    books((3.45, 3.62, 0.34), 20, 2, seed=11)
    lounge_chair((5.55, 2.75), 135, fab=m_fabric('#CFC5B3', 'boucle'), tone='ash')
    floor_lamp((1.55, 5.1, 0), 1.55, power=10)
    cyl('side', 0.2, 0.5, (5.2, 5.05, 0.25), m_wood('ash', 'Z'), bevel=0.006)
    vase((5.2, 5.05, 0.5), 'bottle', '#9EA08A', 0.9)
    branches((5.2, 5.05, 0.94), n=5, h=0.75, spread=0.3, seed=31)
    artwork((3.4, D - 0.03, 1.72), (1.25, 0.85), palette=('#C9C7B3', '#8F937A', '#EFECE4'), seed=7.0, frame='oak')
    shelf_niche(0.2, 1.3, D, 0.55, rows=4, gap=0.4, wood=m_wood('ash'), seed=5)
    daylight(sun_el=26, sun_az=150, sun_strength=3.6, sky_strength=0.34)


def qr_bed():
    _start()
    W, D, H = 4.8, 4.5, 2.95
    room(W, D, H, m_plaster('#EDE7DE', 0.04), m_floor('ash', 0.18, 1.6), openings=[
        dict(wall='E', c=1.9, w=1.9, z0=0.25, z1=2.65, mull=1),
    ])
    garden(W, D, trees=8, seed=13, hedge=False)
    curtain(0.4, 1.0, W - 0.17, 0.02, 2.9, axis='Y')
    curtain(2.8, 3.3, W - 0.17, 0.02, 2.9, axis='Y')
    rug((2.4, 2.4), (2.6, 3.0), '#E6DDCF')
    bed((2.4, 3.25), 0, linen='#F0EBE2', throw='#8F937A', headboard='#DCD1C1', tone='ash')
    table_lamp((1.02, 4.1, 0.5), 10, base_hex='#E3DACB')
    table_lamp((3.78, 4.1, 0.5), 10, base_hex='#E3DACB')
    vase((3.62, 3.98, 0.5), 'moon', '#B8A995', 0.45)
    box('bench', (1.3, 0.42, 0.42), (2.4, 1.7, 0.21), m_wood('ash'), bevel=0.006)
    box('benchpad', (1.26, 0.4, 0.06), (2.4, 1.7, 0.45), m_fabric('#C9C0AE', 'boucle'), soft=0.02)
    artwork((0.03, 2.4, 1.6), (0.9, 1.2), rz=90, palette=('#D8CCB8', '#A7A08A', '#F0ECE4'), seed=3.0)
    daylight(sun_el=18, sun_az=92, sun_strength=3.4, sky_strength=0.32)


# ----------------------------------------------------------------- Sandstone House (house 185 m2)

def ss_living():
    _start()
    W, D, H = 8.0, 6.0, 3.6
    walls = room(W, D, H, m_plaster('#E3D4BD', 0.09, 0.95), m_tiles('limestone', 0.6), openings=[
        dict(wall='S', c=1.7, w=1.7, z0=0.0, z1=3.0, kind='arch'),
        dict(wall='S', c=4.0, w=1.7, z0=0.0, z1=3.0, kind='arch'),
        dict(wall='S', c=6.3, w=1.7, z0=0.0, z1=3.0, kind='arch'),
    ], skirting=False)
    garden(W, D, trees=8, seed=21)
    # arched niche in the north wall
    cb = box('cut', (1.3, 0.34, 1.5), (5.9, D - 0.01, 0.6 + 0.75), None, bevel=0)
    cc = cyl('cutc', 0.65, 0.34, (5.9, D - 0.01, 2.1), None, rot=(90, 0, 0), bevel=0)
    boolean_cut(walls['N'], cb)
    boolean_cut(walls['N'], cc)
    box('nicheshelf', (1.3, 0.16, 0.04), (5.9, D + 0.08, 1.35), m_plaster('#E3D4BD', 0.09), bevel=0.004)
    vase((5.6, D + 0.08, 0.6), 'urn', '#C7B08F', 0.85)
    vase((6.2, D + 0.08, 0.6), 'bottle', '#8F8466', 0.7)
    vase((5.95, D + 0.08, 1.37), 'moon', '#E4D9C6', 0.6)
    # built-in plaster bench along the west wall
    box('bench', (0.6, 4.2, 0.42), (0.3, 3.2, 0.21), m_plaster('#E3D4BD', 0.09), bevel=0.02)
    box('benchpad', (0.56, 4.1, 0.08), (0.3, 3.2, 0.46), m_fabric('#D8C8AE', 'linen'), soft=0.025)
    for i, c in enumerate(('#B8A995', '#777765', '#E9E4DB')):
        box('pillow', (0.14, 0.5, 0.42), (0.12, 2.0 + i * 0.75, 0.68), m_fabric(c, 'linen'), soft=0.06, rot=(0, 12, 0))
    rug((3.8, 3.3), (3.2, 2.4), '#D6C6AC')
    sofa((3.8, 4.55), 0, L=2.6, Dp=1.0, n=2, fab=m_fabric('#E2D6C3', 'boucle'), base=m_wood('smoked'),
         pillows=('#A89878', '#E9E4DB'))
    coffee_table((3.8, 3.3), 0, 'drum', stone=m_stone('sandstone'))
    vase((3.6, 3.3, 0.36), 'bowl', '#6E6A5A', 0.85)
    branches((4.05, 3.15, 0.55), n=4, h=0.6, spread=0.22, seed=44, dry=True)
    vase((4.05, 3.15, 0.36), 'bottle', '#E2D3BC', 0.5)
    lounge_chair((5.9, 2.6), 125, fab=m_fabric('#C9B89B', 'linen'), tone='smoked')
    lathe('pot', [(0, 0), (0.24, 0), (0.33, 0.12), (0.34, 0.5)], (7.4, 0.8, 0), m_tiles('terracotta'), thick=0.03)
    tree((7.4, 0.8, 0.46), height=2.1, spread=0.7, seed=55, leaves=4500, leaf=0.06, trunk_r=0.03)
    beams(W, D, H, n=5, axis='Y', wood=m_wood('smoked', 'Y'), depth=0.24)
    daylight(sun_el=17, sun_az=205, sun_strength=4.4, sky_strength=0.3, warm='#FFE6C4')


def ss_bath():
    _start()
    W, D, H = 4.2, 3.4, 3.0
    room(W, D, H, m_microcement('#DCCBB2'), m_tiles('limestone', 0.6), openings=[
        dict(wall='S', c=1.5, w=1.1, z0=0.75, z1=2.65, kind='arch'),
    ], skirting=False)
    garden(W, D, trees=6, seed=31, hedge=False)
    tub((1.55, 1.3, 0), 0, '#F0EBE3')
    box('vanity', (0.5, 1.3, 0.14), (W - 0.25, 2.0, 0.84), m_stone('limestone'), bevel=0.006)
    lathe('basin', VASES['bowl'], (W - 0.28, 2.0, 0.91), m_ceramic('#EFEAE1', 0.4, False), thick=0.012)
    tube('tap', [(W - 0.01, 2.0, 1.2), (W - 0.1, 2.0, 1.2), (W - 0.18, 2.0, 1.17)], 0.01, m_metal('#7A6650', 0.3))
    round_mirror((W - 0.01, 2.0, 1.62), axis='X', r=0.4, side=-1)
    for k, c in enumerate(('#E9E4DB', '#B8A995')):
        box('towel', (0.42, 0.3, 0.05), (W - 0.27, 2.45, 0.66 - k * 0.055), m_fabric(c, 'linen'), soft=0.02)
    box('shelf', (0.5, 1.3, 0.03), (W - 0.25, 2.0, 0.5), m_wood('smoked'), bevel=0.003)
    cyl('stool', 0.18, 0.45, (2.8, 0.75, 0.225), m_wood('smoked', 'Z'), bevel=0.006)
    vase((2.8, 0.75, 0.45), 'cyl', '#E4D9C6', 0.6)
    branches((2.8, 0.75, 0.6), n=4, h=0.55, spread=0.25, seed=61)
    point_light((W - 0.3, 2.0, 2.4), 8, 0.1)
    daylight(sun_el=24, sun_az=170, sun_strength=4.0, sky_strength=0.3, warm='#FFE9CC')


# ----------------------------------------------------------------- Urban Harmony (apartment 78 m2)

def uh_kitchen():
    _start()
    W, D, H = 6.4, 5.0, 2.8
    room(W, D, H, m_plaster('#DCD5CB', 0.05), m_floor('smoked', 0.2, 1.8), openings=[
        dict(wall='S', c=3.4, w=3.8, z0=0.0, z1=2.6, mull=2),
    ])
    cityscape(W, D, seed=4)
    kitchen_run(0.3, 4.2, D, 'N', wood=m_wood('walnut', 'Z'), top=m_stone('graphite'))
    box('tallunit', (1.8, 0.62, H), (5.2, D - 0.31, H / 2), m_wood('walnut', 'Z', fluted=170), bevel=0.003)
    dining_table((3.0, 2.0), 0, round_=True, chairs=4, chair_fab='#8F8A73', tone='walnut')
    pendant_lantern((3.0, 2.0, 1.9), H, r=0.28, h=0.24, power=12, strength=1.2)
    vase((2.9, 2.0, 0.77), 'bowl', '#B8A995', 0.8)
    vase((3.25, 1.9, 0.77), 'bottle', '#3F3C35', 0.6)
    branches((3.25, 1.9, 1.07), n=4, h=0.55, spread=0.25, seed=71)
    rug((3.0, 2.0), (2.4, 2.4), '#BEB3A1')
    curtain(0.2, 1.3, 0.17, 0.02, 2.75, mat=m_sheer('#E9E2D6', 0.6))
    daylight(sun_el=20, sun_az=215, sun_strength=3.8, sky_strength=0.34)


def uh_living():
    _start()
    W, D, H = 5.6, 4.8, 2.8
    room(W, D, H, m_plaster('#D9D1C5', 0.05), m_floor('smoked', 0.2, 1.8), openings=[
        dict(wall='W', c=2.4, w=2.4, z0=0.0, z1=2.6, mull=1),
    ])
    cityscape(W, D, seed=8)
    slats(0.3, W - 0.3, D, H, wood=m_wood('walnut', 'Z'), pitch=0.065)
    rug((2.9, 2.4), (3.0, 2.2), '#B9AE9C')
    sofa((3.0, 3.75), 0, L=2.6, Dp=1.0, n=2, fab=m_fabric('#BDB3A3', 'boucle'), base=m_wood('walnut'),
         pillows=('#777765', '#D8CDBB'))
    box('ctable', (1.1, 0.7, 0.32), (2.9, 2.45, 0.16), m_wood('walnut'), bevel=0.01)
    vase((2.7, 2.45, 0.32), 'bowl', '#CFC2AE', 0.7)
    books((3.15, 2.45, 0.32), -8, 3, seed=23)
    lounge_chair((1.2, 1.6), 140, fab=m_fabric('#6F7258', 'velvet'), tone='walnut')
    cyl('side', 0.22, 0.48, (4.75, 3.85, 0.24), m_stone('graphite'), bevel=0.006)
    table_lamp((4.75, 3.85, 0.48), 14, base_hex='#3F3C35')
    floor_lamp((0.8, 3.9, 0), 1.6, power=16)
    artwork((5.57, 2.3, 1.55), (0.9, 1.25), rz=90, palette=('#8D8571', '#3F3C35', '#D8CFC0'), seed=11.0)
    daylight(sun_el=12, sun_az=262, sun_strength=4.2, sky_strength=0.3, warm='#FFDDB3')


# ----------------------------------------------------------------- The Oak Residence (house 210 m2)

def oak_dining():
    _start()
    W, D, H = 8.0, 5.6, 3.2
    room(W, D, H, m_plaster('#EAE3D8', 0.05), m_floor('natural', 0.24, 2.2), openings=[
        dict(wall='S', c=4.0, w=6.2, z0=0.0, z1=2.85, mull=3),
    ])
    garden(W, D, trees=9, seed=41)
    slats(0.4, W - 0.4, D, H, wood=m_wood('natural', 'Z'), pitch=0.07)
    beams(W, D, H, n=7, axis='X', wood=m_wood('natural', 'X'), depth=0.2)
    dining_table((4.0, 2.75), 0, L=3.4, Wd=1.1, chairs=10, chair_fab='#CBBFA9')
    pendant_linear((4.0, 2.75, 1.65), H, L=2.2, power=40)
    for i, (x, k, c, sc) in enumerate([(3.2, 'bowl', '#E2D8C6', 0.9), (3.9, 'amphora', '#B8A995', 0.8),
                                        (4.3, 'bottle', '#777765', 0.7), (4.9, 'moon', '#E9E4DB', 0.6)]):
        vase((x, 2.75 + (0.08 if i % 2 else -0.06), 0.77), k, c, sc)
    branches((3.9, 2.69, 1.1), n=6, h=0.75, spread=0.35, seed=81)
    box('sideboard', (2.4, 0.48, 0.75), (1.6, D - 0.3, 0.375), m_wood('smoked', 'X'), bevel=0.004)
    vase((1.1, D - 0.3, 0.75), 'urn', '#C9BBA4', 0.7)
    daylight(sun_el=22, sun_az=200, sun_strength=4.0, sky_strength=0.32)


def oak_bed():
    _start()
    W, D, H = 5.2, 4.6, 3.0
    room(W, D, H, m_plaster('#ECE5DA', 0.05), m_floor('natural', 0.24, 2.2), openings=[
        dict(wall='W', c=2.0, w=2.0, z0=0.0, z1=2.7, mull=1),
    ])
    garden(W, D, trees=8, seed=43)
    # full-height oak panelling behind the bed
    for i in range(14):
        x = 0.9 + i * 0.25
        box('panel', (0.245, 0.04, H), (x, D - 0.02, H / 2), m_wood('natural', 'Z'), bevel=0.003)
    bed((2.55, 3.4), 0, linen='#F1ECE3', throw='#777765', tone='natural', stands='oak', head=False)
    for x in (1.17, 3.93):
        pendant_lantern((x, 4.25, 1.15), H, r=0.13, h=0.18, power=6, strength=1.5)
    vase((3.95, 4.2, 0.5), 'cyl', '#B8A995', 0.5)
    books((1.15, 4.15, 0.5), 8, 2, seed=5)
    curtain(0.45, 1.05, 0.17, 0.02, 2.95, axis='Y')
    curtain(2.95, 3.55, 0.17, 0.02, 2.95, axis='Y')
    lounge_chair((4.3, 1.1), 210, fab=m_fabric('#E0D6C6', 'boucle'))
    rug((2.55, 2.5), (2.8, 3.2), '#DED3C1')
    daylight(sun_el=16, sun_az=255, sun_strength=4.0, sky_strength=0.3, warm='#FFE2BC')


# ----------------------------------------------------------------- Minimal Living (apartment 92 m2)

def min_living():
    _start()
    W, D, H = 7.2, 5.4, 3.0
    room(W, D, H, m_microcement('#E8E4DC'), m_microcement('#DAD4CA'), ceil=m_plaster('#F2EFEA', 0.02), openings=[
        dict(wall='S', c=3.6, w=5.8, z0=0.0, z1=2.75, mull=1),
    ], skirting=False)
    garden(W, D, trees=8, seed=51, hedge=False)
    sofa((3.6, 4.55), 0, L=3.4, Dp=1.05, n=2, fab=m_fabric('#ECE7DE', 'boucle'), base=m_paint('#D9D3C9', 0.6),
         pillows=())
    box('ctable', (1.2, 0.6, 0.3), (3.6, 3.3, 0.15), m_stone('travertine'), bevel=0.01)
    vase((3.25, 3.3, 0.3), 'moon', '#E9E4DB', 0.75)
    branches((3.25, 3.3, 0.5), n=1, h=0.9, spread=0.25, seed=93)
    artwork((6.0, D - 0.35, 0.86), (1.1, 1.6), palette=('#E2DBCF', '#B8A995', '#F2EEE8'), seed=21.0,
            frame='#E9E4DB', lean=-6)
    cyl('pouf', 0.32, 0.36, (1.3, 2.4, 0.18), m_fabric('#B8A995', 'boucle'), bevel=0.06)
    daylight(sun_el=24, sun_az=165, sun_strength=3.8, sky_strength=0.34)


def min_bed():
    _start()
    W, D, H = 4.8, 4.4, 3.0
    room(W, D, H, m_microcement('#E8E4DC'), m_microcement('#DAD4CA'), ceil=m_plaster('#F2EFEA', 0.02), openings=[
        dict(wall='E', c=2.2, w=2.2, z0=0.0, z1=2.75, mull=0),
    ], skirting=False)
    garden(W, D, trees=8, seed=53, hedge=False)
    curtain(0.3, 1.1, W - 0.17, 0.02, 2.95, axis='Y')
    bed((2.2, 3.3), 0, linen='#F2EEE7', throw='#E2DBCF', headboard='#E8E4DC', tone='ash', stands='limestone')
    pendant_lantern((0.82, 4.15, 1.2), H, r=0.16, h=0.22, power=6, strength=1.5)
    vase((3.58, 4.15, 0.5), 'bottle', '#D9D3C9', 0.6)
    daylight(sun_el=20, sun_az=100, sun_strength=3.6, sky_strength=0.32)


# ----------------------------------------------------------------- the studio itself (about / contact)

def studio():
    _start()
    W, D, H = 7.0, 5.5, 3.3
    room(W, D, H, m_plaster('#ECE6DC', 0.05), m_floor('light', 0.22, 2.0), openings=[
        dict(wall='W', c=2.6, w=3.2, z0=0.0, z1=2.9, mull=2, transom=2.3),
    ])
    garden(W, D, trees=8, seed=61)
    box('table', (2.6, 1.1, 0.05), (2.4, 2.6, 0.745), m_wood('light'), bevel=0.006)
    for s in (-1, 1):
        box('trestle', (0.08, 0.9, 0.72), (2.4 + s * 0.95, 2.6, 0.36), m_wood('light', 'Z'), bevel=0.005)
    z = 0.77
    # material samples: stone, timber, fabric swatches, drawings
    box('s1', (0.3, 0.3, 0.02), (1.7, 2.45, z + 0.01), m_stone('travertine'), bevel=0.002, rot=(0, 0, 8))
    box('s2', (0.22, 0.22, 0.02), (1.95, 2.75, z + 0.01), m_stone('marble'), bevel=0.002, rot=(0, 0, -6))
    box('s3', (0.25, 0.25, 0.02), (1.62, 2.82, z + 0.01), m_stone('verde'), bevel=0.002, rot=(0, 0, 14))
    box('w1', (0.45, 0.09, 0.018), (2.25, 2.3, z + 0.009), m_wood('natural'), bevel=0.002, rot=(0, 0, 4))
    box('w2', (0.45, 0.09, 0.018), (2.3, 2.42, z + 0.009), m_wood('smoked'), bevel=0.002, rot=(0, 0, 9))
    box('w3', (0.45, 0.09, 0.018), (2.28, 2.54, z + 0.009), m_wood('walnut'), bevel=0.002, rot=(0, 0, 2))
    for i, c in enumerate(('#E4DCCF', '#B8A995', '#777765', '#D2C2A6')):
        box('fab', (0.2, 0.28, 0.006), (2.75 + i * 0.07, 2.75 - i * 0.03, z + 0.003 + i * 0.004),
            m_fabric(c, 'linen' if i % 2 else 'boucle'), bevel=0.001, rot=(0, 0, -10 + i * 7))
    for i in range(3):
        box('paper', (0.42, 0.3, 0.002), (3.0 + i * 0.05, 2.35 + i * 0.03, z + 0.001 + i * 0.002),
            m_art('#BFB6A6', '#5E5A4B', '#F5F2EC', seed=30.0 + i), bevel=0, rot=(0, 0, -4 + i * 5))
    vase((3.4, 2.85, z), 'cyl', '#E9E4DB', 0.55)
    branches((3.4, 2.85, z + 0.15), n=3, h=0.5, spread=0.2, seed=101)
    for x in (1.7, 3.1):
        dining_chair((x, 3.3, 0), 180, '#CFC5B3')
    shelf_niche(4.2, 6.8, D, 0.45, rows=4, gap=0.42, wood=m_wood('light'), seed=9)
    pendant_lantern((2.4, 2.6, 1.85), H, r=0.3, h=0.24, power=10, strength=1.2)
    lathe('pot', [(0, 0), (0.26, 0), (0.34, 0.1), (0.36, 0.5)], (0.7, 4.7, 0), m_ceramic('#B5A68F', 0.85), thick=0.03)
    tree((0.7, 4.7, 0.46), height=2.2, spread=0.7, seed=77, leaves=4500, leaf=0.06, trunk_r=0.03)
    artwork((W - 0.03, 2.6, 1.6), (1.4, 1.0), rz=90, palette=('#D8CCB8', '#8C7358', '#F0ECE4'), seed=17.0, frame='oak')
    sofa((W - 0.55, 2.6), -90, L=2.2, Dp=0.95, n=2, fab=m_fabric('#DCD2C2', 'linen'), pillows=('#777765',))
    daylight(sun_el=20, sun_az=250, sun_strength=4.0, sky_strength=0.32)


def villa_dusk():
    scene_villa.build(sun_az=262, sun_el=4)
    # warmer, lower sky, lamps already on
    w = bpy.context.scene.world
    w.node_tree.nodes['Background'].inputs['Strength'].default_value = 0.22


BUILDERS = {
    'villa': scene_villa.build, 'villa_dusk': villa_dusk,
    'qr_living': qr_living, 'qr_bed': qr_bed, 'ss_living': ss_living, 'ss_bath': ss_bath,
    'uh_kitchen': uh_kitchen, 'uh_living': uh_living, 'oak_dining': oak_dining, 'oak_bed': oak_bed,
    'min_living': min_living, 'min_bed': min_bed, 'studio': studio,
}

L, P, S = (1800, 1200), (1200, 1500), (1500, 1500)  # landscape 3:2, portrait 4:5, square

# name: (builder, loc, target, lens, fstop, size, exposure)
SHOTS = {
    # Villa Natura
    'villa-natura-1': ('villa', (3.6, 0.9, 1.3), (3.6, 5.6, 0.8), 26, 0, L, 0.0),
    'villa-natura-2': ('villa', (11.3, 1.1, 1.45), (8.4, 3.3, 0.95), 28, 0, L, 0.0),
    'villa-natura-3': ('villa', (4.55, 3.6, 0.72), (3.6, 4.45, 0.36), 50, 2.8, P, 0.0),
    'villa-natura-4': ('villa', (8.1, 3.2, 1.5), (10.0, 7.4, 1.05), 24, 0, L, 0.0),
    'cta-dusk': ('villa_dusk', (11.4, 7.2, 1.6), (3.8, 3.2, 1.0), 22, 0, (2000, 1125), 0.6),
    # Quiet Residence
    'quiet-residence-1': ('qr_living', (0.55, 0.6, 1.3), (4.2, 4.7, 0.75), 24, 0, L, 0.0),
    'quiet-residence-2': ('qr_living', (4.15, 3.7, 1.05), (5.1, 4.95, 0.95), 35, 2.8, P, 0.0),
    'quiet-residence-3': ('qr_bed', (0.45, 0.4, 1.4), (2.6, 3.7, 0.6), 24, 0, L, 0.0),
    'quiet-residence-4': ('qr_bed', (2.85, 2.55, 0.95), (3.75, 4.05, 0.72), 45, 2.8, P, 0.0),
    # Sandstone House
    'sandstone-house-1': ('ss_living', (7.5, 5.5, 1.55), (2.6, 0.6, 1.1), 22, 0, L, 0.0),
    'sandstone-house-2': ('ss_living', (5.9, 3.3, 1.2), (5.9, 6.1, 1.25), 32, 0, P, 0.0),
    'sandstone-house-3': ('ss_bath', (0.35, 3.1, 1.6), (2.4, 0.8, 0.7), 22, 0, L, 0.0),
    'sandstone-house-4': ('ss_bath', (2.6, 2.0, 1.25), (4.1, 2.0, 1.15), 32, 0, P, 0.0),
    # Urban Harmony
    'urban-harmony-1': ('uh_kitchen', (0.45, 0.5, 1.5), (3.8, 4.6, 0.95), 22, 0, L, 0.35),
    'urban-harmony-2': ('uh_kitchen', (4.4, 0.9, 1.2), (3.0, 2.0, 0.8), 40, 2.8, P, 0.0),
    'urban-harmony-3': ('uh_living', (5.2, 0.45, 1.4), (1.8, 3.8, 0.75), 24, 0, L, 0.0),
    'urban-harmony-4': ('uh_living', (2.25, 2.75, 1.0), (1.15, 1.55, 0.55), 38, 2.8, P, 0.0),
    # The Oak Residence
    'oak-residence-1': ('oak_dining', (7.6, 0.6, 1.5), (2.0, 4.3, 0.9), 22, 0, L, 0.0),
    'oak-residence-2': ('oak_dining', (5.1, 1.3, 1.15), (3.9, 2.75, 0.85), 40, 2.8, P, 0.0),
    'oak-residence-3': ('oak_bed', (4.8, 0.5, 1.45), (2.2, 3.9, 0.75), 24, 0, L, 0.0),
    'oak-residence-4': ('oak_bed', (3.3, 2.7, 0.95), (4.0, 4.15, 0.65), 40, 2.8, P, 0.0),
    # Minimal Living
    'minimal-living-1': ('min_living', (3.6, 1.15, 1.2), (3.6, 5.0, 0.9), 28, 0, L, -0.7),
    'minimal-living-2': ('min_living', (4.6, 2.5, 0.75), (3.3, 3.3, 0.5), 45, 2.8, P, -0.6),
    'minimal-living-3': ('min_bed', (0.4, 0.4, 1.45), (2.4, 3.8, 0.7), 24, 0, L, -0.3),
    'minimal-living-4': ('min_bed', (2.9, 2.5, 0.95), (3.6, 4.15, 0.65), 45, 2.8, P, -0.4),
    # studio
    'studio-table': ('studio', (3.7, 1.2, 1.45), (2.2, 2.6, 0.78), 35, 2.8, P, 0.0),
    'studio-wide': ('studio', (6.1, 1.0, 1.45), (2.0, 3.0, 0.95), 26, 0, L, 0.0),
    'studio-samples': ('studio', (2.2, 1.85, 1.15), (1.95, 2.6, 0.77), 50, 2.4, S, 0.0),
    'studio-shelf': ('studio', (4.6, 3.0, 1.35), (5.6, 5.45, 1.05), 38, 2.8, P, 0.0),
}
