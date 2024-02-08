import { promises as fs } from 'fs';
import * as os from 'os';
import * as path from 'path';
import * as esbuild from 'esbuild'
//import open, { openApp, apps } from 'open';
import { copy } from 'fs-extra';

const tempDirectory = path.join(os.tmpdir(), 'trowser');

async function createEntryPoint(inputFile: string) {
    const content = `import '${path.resolve('./src/assets/index.ts')}';
import '${path.resolve(inputFile)}';`;
    const entryPointPath = path.join(tempDirectory, 'entry.ts');
    
    await fs.writeFile(entryPointPath, content);
    console.log(`WRITTEN\n` + content);
    return entryPointPath;
}

async function bundleEntryPoint(entryPointPath: string) {
    await esbuild.build({
        entryPoints: [entryPointPath],
        outfile: path.join(tempDirectory, 'bundle.js'),
        bundle: true,
    });
    console.log("Output bundle to: "+path.join(tempDirectory, 'bundle.js'));
}

async function copyHtml() {
    await copy(path.resolve('./static/index.html'), path.join(tempDirectory, 'index.html'));
}

async function openInBrowser(file: string) {
    /*
    This would be easier with: 
    import open, {openApp, apps} from 'open';
    But we're targetting commonjs (cjs in tsup.config.ts), and open only supports ESM. 
    */
    const { default: open } = await import('open');
        
    await open(file, { app: { name: 'google chrome' } });
        
}

export default async function main(inputFile: string) {
    const entryPoint = await createEntryPoint(inputFile);
    await bundleEntryPoint(entryPoint);
    await copyHtml();
    await openInBrowser(path.join(tempDirectory, 'index.html'));
}