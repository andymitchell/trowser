import { promises as fs } from 'fs';
import * as os from 'os';
import * as path from 'path';
import * as esbuild from 'esbuild'
import * as crypto from 'crypto';
//import open, { openApp, apps } from 'open';
import { copy } from 'fs-extra';
import chokidar = require('chokidar');
import { Platform } from './types';
//import chokidar from 'chokidar';

const tempDirectory = path.join(os.tmpdir(), 'trowser');

function absoluteAssetPath(assetFile:string) {
    // __dirname is the script's directory, which when this is compiled will be ./dist 
    return path.resolve(__dirname, `../static/${assetFile}`);
}

async function createEntryPoint(inputFile: string) {
    const content = `import '${absoluteAssetPath('./globalTestFunctions.ts')}';
import '${path.resolve(inputFile)}';`;


    await fs.mkdir(tempDirectory, { recursive: true }); // Creates temp directory if it doesn't exist
    const entryPointPath = path.join(tempDirectory, 'entry.ts');
    
    try {
        await fs.writeFile(entryPointPath, content);
        console.log(`Created entry point at ${entryPointPath}`);
        return entryPointPath;
    } catch(e) {
        console.warn(`Failed to write to ${entryPointPath}. Error: ${e?.message ?? ''}`);
    }
    
    
}

async function bundleEntryPoint(entryPointPath: string, platform?: Platform) {
    const config:esbuild.BuildOptions = {
        entryPoints: [entryPointPath],
        outfile: path.join(tempDirectory, 'bundle.js'),
        bundle: true,
        sourcemap: true,
    }
    if( platform ) {
        config.platform = platform;
        console.log("Building for a different platform: "+platform);
    }
    
    await esbuild.build(config);
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

async function exec(inputFile: string, open?:boolean, platform?: Platform) {
    const entryPoint = await createEntryPoint(inputFile);
    await bundleEntryPoint(entryPoint, platform);
    await copyHtml();
    const finalFile = path.join(tempDirectory, 'index.html');
    console.log(`Built ${finalFile}`);
    if( open ) await openInBrowser(finalFile);
}

async function getFileHash(filePath: string): Promise<string> {
    const data = await fs.readFile(filePath);
    const hash = crypto.createHash('sha256');
    hash.update(data);
    return hash.digest('hex');
}

export default async function main(inputFile: string, watch?: boolean, platform?: Platform) {
    let fileHash = await getFileHash(inputFile);
    await exec(inputFile, true, platform);

    if (watch) {
        console.log(`Watching for file changes in . and its sub directories.`);
        const watcher = chokidar.watch('.', { ignored: /(^|[\/\\])\../ }); // '.' to watch the current directory and its subdirectories, ignoring dotfiles

        watcher.on('change', async (path) => {
            console.log(`${path} file changed`);
            await exec(inputFile); // Consider whether you want to pass the changed `path` instead of `inputFile` to exec depending on your use case
        });
    }

    /*
    if( watch ) {
        console.log(`Watching for file changes on ${inputFile}`);
        const watcher = fs.watch(inputFile);
        for await (const event of watcher) {
            if (event.eventType === 'change') {
                const newFileHash = await getFileHash(inputFile);
                if(newFileHash !== fileHash) {
                    console.log(`${event.filename} file changed`);
                    fileHash = newFileHash;
                    await exec(inputFile);
                }
            }
        }
    }
    */
}