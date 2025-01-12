import decompress from 'decompress';
import { createWriteStream } from 'fs';
import { mkdir } from 'fs/promises';
import { resolve, sep } from 'path';
import { Readable } from 'stream';
import { finished } from 'stream/promises';

export async function downloadServer(downloadURL, options = {}){
	//prep the options
	options = {
		zipName: 'server.zip',
		downloadLocation: './Server',
		...options
	};

	//create the local directory to house the actual terraria server
	await mkdir(options.downloadLocation, {
		recursive: true
	})

	//we created the directory or it already exists, attempt to download the server zip
	const zipFilePath = resolve(options.downloadLocation, options.zipName);
	var zipFileStream = createWriteStream(zipFilePath);
	const { body } = await fetch(downloadURL);
	await finished(Readable.fromWeb(body).pipe(zipFileStream));
	return zipFilePath;
}

export async function unzipServer (options = {}){
	//prep the options
	options = {
		fullZipPath: './Server/server.zip',
		unzipPath: undefined,
		...options
	};

	if( options.unzipPath === undefined ){
		options.unzipPath = options.fullZipPath.split(/[\/\\]/g).slice(0,-1).join('/');
	}

	try{
		await decompress(options.fullZipPath, options.unzipPath, {
			filter: file =>
				file.type !== 'directory' &&
				!file.path.endsWith(sep) &&
				file.data.length !== 0
		});
	} catch (e) {
		console.error(`Error extracting server (${options.fullZipPath}) to unzip directory(${options.unzipPath})`)
		throw e;
	}
}