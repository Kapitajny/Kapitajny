"""Villa Natura - open-plan living / dining / kitchen. Also the hero film set."""
import math
from lib import *

W, D, H = 12.0, 8.0, 3.4


def build(sun_az=228, sun_el=24, tall_units=True):
    reset()
    clear_cache()
    wall = m_plaster('#ECE6DC')
    floor = m_floor('natural')
    room(W, D, H, wall, floor, openings=[
        dict(wall='S', c=3.3, w=5.2, z0=0.0, z1=3.0, mull=2, transom=2.45),
        dict(wall='S', c=9.0, w=4.6, z0=0.0, z1=3.0, mull=2, transom=2.45),
        dict(wall='W', c=3.6, w=2.2, z0=0.5, z1=2.9, mull=1),
        dict(wall='E', c=2.6, w=2.0, z0=0.0, z1=3.0, mull=1, transom=2.45),
    ])
    beams(W, D, H, n=9, axis='Y', wood=m_wood('light', 'Y'), depth=0.2)
    garden(W, D, trees=7, seed=5)

    # living
    rug((3.6, 4.5), (3.8, 2.9), '#D9CDB9')
    sofa((3.6, 5.7), 0, L=3.0, Dp=1.05, n=3, pillows=('#B8A995', '#777765', '#E9E4DB'))
    coffee_table((3.6, 4.35), 0, 'slab')
    vase((3.25, 4.4, 0.37), 'bowl', '#6E6A5A', 0.9)
    books((3.95, 4.3, 0.37), 12, 3, seed=4)
    vase((4.15, 4.25, 0.37 + 0.09), 'moon', '#E2D8C6', 0.55)
    lounge_chair((2.3, 3.0), 200)
    lounge_chair((4.9, 3.0), 160)
    floor_lamp((1.55, 6.15, 0), 1.6, power=18)
    cyl('side', 0.24, 0.48, (5.55, 5.95, 0.24), m_stone('travertine'), bevel=0.006)
    vase((5.55, 5.95, 0.48), 'amphora', '#C9BBA4', 1.0)
    branches((5.55, 5.95, 0.9), n=6, h=0.8, spread=0.35, seed=8)

    # north wall: long low credenza + art + vases
    box('credenza', (3.8, 0.45, 0.6), (3.6, D - 0.24, 0.3), m_wood('smoked', 'X', fluted=160), bevel=0.004)
    box('credtop', (3.84, 0.47, 0.03), (3.6, D - 0.24, 0.615), m_stone('travertine'), bevel=0.003)
    artwork((3.1, D - 0.03, 1.75), (1.6, 1.05), palette=('#CDB89B', '#7E6B55', '#EDE6DA'), seed=2.0)
    vase((4.75, D - 0.25, 0.63), 'urn', '#B8A995', 0.75)
    vase((2.0, D - 0.25, 0.63), 'bottle', '#5F5B4C', 0.8)
    books((2.55, D - 0.25, 0.63), 0, 2, seed=9)

    # olive tree in the SW corner
    lathe('pot', [(0, 0), (0.28, 0), (0.36, 0.1), (0.38, 0.55)], (0.75, 1.0, 0), m_ceramic('#B5A68F', 0.85), thick=0.03)
    cyl('soil', 0.36, 0.02, (0.75, 1.0, 0.5), m_paint('#3B3128', 1.0), bevel=0)
    tree((0.75, 1.0, 0.5), height=2.3, spread=0.75, seed=21, leaves=5200, leaf=0.06, trunk_r=0.035)

    curtain(0.35, 1.1, 0.16, 0.02, 3.0)
    curtain(11.0, 11.75, 0.16, 0.02, 3.0)

    # kitchen + dining (east)
    if not tall_units:  # the hero film was rendered with the original, open kitchen run
        kitchen_run(7.0, 11.75, D, 'N', wood=m_wood('light', 'Z'), top=m_stone('travertine'))
    else:
        kitchen_run(7.65, 11.1, D, 'N', wood=m_wood('light', 'Z'), top=m_stone('travertine'))
    for x0, x1 in (((7.0, 7.65), (11.1, 11.75)) if tall_units else ()):
        box('tall', (x1 - x0, 0.64, H - 0.02), ((x0 + x1) / 2, D - 0.32, (H - 0.02) / 2), m_wood('light', 'Z', fluted=200), bevel=0.003)
    island((9.3, 5.6), L=2.8, Dp=1.0, wood=m_wood('light', 'Z', fluted=200), top=m_stone('travertine'), stools=3)
    dining_table((9.2, 2.7), 0, L=2.6, Wd=1.05, wood=m_wood('natural'), chairs=8)
    for x in (8.5, 9.9):
        pendant_lantern((x, 2.7, 2.05), H, r=0.3, h=0.26, power=14, strength=1.1)
    vase((9.0, 2.7, 0.77), 'bowl', '#E2D8C6', 1.1)
    vase((9.6, 2.65, 0.77), 'bottle', '#8B8670', 0.7)
    branches((9.6, 2.65, 1.1), n=5, h=0.6, spread=0.3, seed=14, dry=True)

    daylight(sun_el=sun_el, sun_az=sun_az, sun_strength=4.2, sky_strength=0.32)


# camera presets for stills (loc, target, lens, fstop)
STILLS = {
    'wide_east': ((11.3, 6.9, 1.5), (3.5, 3.0, 1.0), 22, 0),
    'living': ((3.6, 1.0, 1.25), (3.6, 5.6, 0.75), 28, 0),
    'dining': ((11.2, 1.2, 1.45), (8.6, 3.2, 0.95), 30, 0),
    'detail_table': ((4.5, 3.5, 0.75), (3.6, 4.4, 0.36), 50, 2.8),
    'kitchen': ((7.6, 3.4, 1.45), (10.4, 7.2, 1.0), 26, 0),
}
