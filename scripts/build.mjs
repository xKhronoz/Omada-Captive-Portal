import { readFileSync, writeFileSync, mkdirSync, mkdtempSync, cpSync, readdirSync, rmSync, existsSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { tmpdir } from 'node:os';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { runInNewContext } from 'node:vm';
import { prepareController, prepareSurveyStyles } from './prepare-controller.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const options = {};
const allowed = new Set(['--template', '--output', '--zip', '--brand-config', '--brand-assets', '--preview']);
for (let i = 0; i < args.length; i++) {
  if (!allowed.has(args[i])) throw new Error('Unknown option: ' + args[i]);
  const key = args[i];
  if (key === '--preview') options[key] = true;
  else { if (!args[i + 1] || args[i + 1].startsWith('--')) throw new Error('Missing value for ' + key); options[key] = args[++i]; }
}
if (!options['--template']) {
  console.error('Usage: npm run build -- --template /absolute/path/demo.zip [--preview] [--brand-config /path/brand.json --brand-assets /path/assets]');
  process.exit(1);
}
const template = resolve(options['--template']);
const output = resolve(options['--output'] || join(root, 'build/portal'));
const archive = resolve(options['--zip'] || join(root, 'build/guest-portal.zip'));
if (output === root || output === join(root, 'src')) throw new Error('Choose a separate output directory.');
if (existsSync(output) && readdirSync(output).length) throw new Error('Output directory must be empty: ' + output);
mkdirSync(output, { recursive: true });
mkdirSync(dirname(archive), { recursive: true });
const temporary = mkdtempSync(join(tmpdir(), 'guest-portal-template-'));
const python = process.env.PYTHON || 'python3';
try {
  execFileSync(python, ['-c', `import sys, zipfile, pathlib
destination=pathlib.Path(sys.argv[2])
with zipfile.ZipFile(sys.argv[1]) as z:
 for entry in z.infolist():
  name=pathlib.PurePosixPath(entry.filename)
  if name.is_absolute() or '..' in name.parts: raise ValueError('Unsafe archive path')
  if entry.filename in ('index.js','index.css','jquery.min.js') or entry.filename.startswith('img/'):
   if not entry.is_dir():
    target=destination.joinpath(*name.parts);target.parent.mkdir(parents=True,exist_ok=True);target.write_bytes(z.read(entry))
`, template, temporary]);
  cpSync(join(root, 'src'), output, { recursive: true });
  for (const notice of ['LICENSE', 'THIRD_PARTY_NOTICES.md']) cpSync(join(root, notice), join(output, notice));
  writeFileSync(join(output, 'controller.js'), prepareController(readFileSync(join(temporary, 'index.js'), 'utf8')));
  writeFileSync(join(output, 'survey.css'), prepareSurveyStyles(readFileSync(join(temporary, 'index.css'), 'utf8')));
  cpSync(join(temporary, 'jquery.min.js'), join(output, 'jquery.min.js'));
  if (existsSync(join(temporary, 'img'))) cpSync(join(temporary, 'img'), join(output, 'img'), { recursive: true });
  if (!options['--preview']) writeFileSync(join(output, 'preview.js'), '/* Production: authentication is handled exclusively by the network controller. */\n');
  if (options['--brand-config']) {
    const window = {};
    runInNewContext(readFileSync(join(output, 'portal-config.js'), 'utf8'), { window }, { timeout: 1000 });
    const brand = JSON.parse(readFileSync(resolve(options['--brand-config']), 'utf8'));
    writeFileSync(join(output, 'portal-config.js'), 'window.PORTAL_CONFIG = ' + JSON.stringify({ ...window.PORTAL_CONFIG, ...brand }, null, 2) + ';\n');
  }
  if (options['--brand-assets']) cpSync(resolve(options['--brand-assets']), join(output, 'assets'), { recursive: true });
  execFileSync(python, ['-c', `import pathlib,sys,zipfile
source=pathlib.Path(sys.argv[1])
with zipfile.ZipFile(sys.argv[2],'w',zipfile.ZIP_DEFLATED,compresslevel=9) as z:
 for path in sorted(source.rglob('*')):
  if path.is_file(): z.write(path,path.relative_to(source))
`, output, archive]);
  console.log(JSON.stringify({ output, archive, preview: !!options['--preview'] }));
} finally { rmSync(temporary, { recursive: true, force: true }); }
