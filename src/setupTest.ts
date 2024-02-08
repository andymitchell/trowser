import { promises as fs } from 'fs';
import * as os from 'os';
import * as path from 'path';
import * as esbuild from 'esbuild'
import * as crypto from 'crypto';
//import open, { openApp, apps } from 'open';
import { copy } from 'fs-extra';

const tempDirectory = path.join(os.tmpdir(), 'trowser');

function absoluteAssetPath(assetFile:string) {
    // __dirname is the script's directory, which when this is compiled will be ./dist 
    return path.resolve(__dirname, `../static/${assetFile}`);
}

async function createEntryPoint(inputFile: string) {
    const content = `import '${absoluteAssetPath('./globalTestFunctions.ts')}';
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
    await copy(absoluteAssetPath('./index.html'), path.join(tempDirectory, 'index.html'));
}

async function openInBrowser(file: string) {
    /*
    This would be easier with: 
    import open, {openApp, apps} from 'open';
    But we're targetting commonjs (cjs in tsup.config.ts), and 'open' only supports ESM, so forced to use dynamic import. 
    */
    const { default: open } = await import('open');
        
    await open(file, { app: { name: 'google chrome' } });
        
}

async function exec(inputFile: string) {
    const entryPoint = await createEntryPoint(inputFile);
    await bundleEntryPoint(entryPoint);
    await copyHtml();
    await openInBrowser(path.join(tempDirectory, 'index.html'));
}

async function getFileHash(filePath: string): Promise<string> {
    const data = await fs.readFile(filePath);
    const hash = crypto.createHash('sha256');
    hash.update(data);
    return hash.digest('hex');
}

export default async function main(inputFile: string, watch?: boolean) {
    let fileHash = await getFileHash(inputFile);
    await exec(inputFile);

    if( watch ) {
        console.log(`Watching for file changes on ${inputFile}`);
        const watcher = fs.watch(inputFile);
        for await (const event of watcher) {
            if (event.eventType === 'change') {
                const newFileHash = await getFileHash(inputFile);
                if(newFileHash !== fileHash) {
                    console.log(`${event.filename} file Changed `+Date.now());
                    fileHash = newFileHash;
                    await exec(inputFile)
                }
            }
        }
    }
}