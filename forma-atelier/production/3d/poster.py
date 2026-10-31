"""Render the hero poster (= first frame of the looped film) in full 1920x1080."""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
sys.argv = [sys.argv[0], 'noop']
import importlib.util
spec = importlib.util.spec_from_file_location('filmmod', os.path.join(os.path.dirname(os.path.abspath(__file__)), 'film.py'))
src = open(spec.origin).read().replace('\nmain()\n', '\n')
ns = {'__file__': spec.origin, '__name__': 'filmmod'}
exec(compile(src, spec.origin, 'exec'), ns)
import lib
ns['villa'].build(tall_units=False)
cam = lib.camera((0, 0, 1), (0, 1, 1), 26)
n = int(round(ns['TAKES']['A'][0] * ns['FPS']))
loc, tgt, lens, fst = ns['pose']('A', 12 / (n - 1))
lib.aim(cam, tuple(loc), tuple(tgt))
cam.data.lens = lens
lib.setup_render(1920, 1080, 48, threshold=0.02, bounces=6)
lib.render(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'out', 'poster_1080.png'))
print('POSTER DONE')
