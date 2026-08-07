import os
from pathlib import Path

def human(n):
    for u in ['B','KB','MB','GB']:
        if n<1024: return f"{n:.2f}{u}"
        n/=1024
    return f"{n:.2f}TB"

root = Path('dist')
if not root.exists():
    print('NO_DIST')
    raise SystemExit(0)

files = list(root.rglob('*'))
files = [f for f in files if f.is_file()]
summary = {}
for f in files:
    s = f.stat().st_size
    ext = f.suffix.lower() or '[noext]'
    summary.setdefault(ext, {'count':0,'size':0})
    summary[ext]['count'] += 1
    summary[ext]['size'] += s

total = sum(v['size'] for v in summary.values())
print('files:', len(files))
print('total:', human(total))
for ext, v in sorted(summary.items(), key=lambda kv: kv[1]['size'], reverse=True):
    print(ext.ljust(8), str(v['count']).rjust(4), human(v['size']).rjust(10))

# list top 15 biggest files
print('\nTop files:')
files_sorted = sorted(files, key=lambda f: f.stat().st_size, reverse=True)
for f in files_sorted[:15]:
    print(human(f.stat().st_size).rjust(8), f.relative_to(root))
