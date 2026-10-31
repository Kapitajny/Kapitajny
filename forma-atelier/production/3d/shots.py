"""Render project photos. Usage: python shots.py <scale 0..1> <spp> <outdir> [name-prefix ...]
Groups shots by builder so each room is built once. Existing files are skipped."""
import sys, os, time
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import bpy
import lib, scenes

scale, spp, outdir = float(sys.argv[1]), int(sys.argv[2]), sys.argv[3]
prefixes = sys.argv[4:]
os.makedirs(outdir, exist_ok=True)
todo = [n for n in scenes.SHOTS if (not prefixes or any(n.startswith(p) for p in prefixes))]
by_builder = {}
for n in todo:
    by_builder.setdefault(scenes.SHOTS[n][0], []).append(n)
for bname, names in by_builder.items():
    names = [n for n in names if not os.path.exists(os.path.join(outdir, n + '.png'))]
    if not names:
        continue
    scenes.BUILDERS[bname]()
    cam = lib.camera((0, 0, 1), (0, 1, 1), 24)
    for n in names:
        _, loc, tgt, lens, fstop, size, expo = scenes.SHOTS[n]
        lib.aim(cam, loc, tgt)
        cam.data.lens = lens
        cam.data.dof.use_dof = fstop > 0
        if fstop:
            cam.data.dof.aperture_fstop = fstop
            cam.data.dof.focus_distance = (lib.Vector(tgt) - lib.Vector(loc)).length
        lib.setup_render(int(size[0] * scale), int(size[1] * scale), spp, exposure=expo, threshold=0.02, bounces=6)
        t = time.time()
        lib.render(os.path.join(outdir, n + '.png'))
        print(f'SHOT {n} {time.time() - t:.0f}s', flush=True)
print('ALLDONE', flush=True)
