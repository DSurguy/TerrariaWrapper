import decompress from 'decompress';
import { createWriteStream } from 'fs';
import { mkdir } from 'fs/promises';
import { resolve, sep } from 'path';
import { Readable } from 'stream';
import { finished } from 'stream/promises';
import config from './config.js';

const zipFilePath = resolve(config.serverDirectory, 'server.zip');

export async function downloadServer(){
  //create the local directory to house the actual terraria server
  await mkdir(config.serverDirectory, {
    recursive: true
  })

  //we created the directory or it already exists, attempt to download the server zip
  var zipFileStream = createWriteStream(zipFilePath);
  const { body } = await fetch(config.dedicatedServerDownload);
  await finished(Readable.fromWeb(body).pipe(zipFileStream));
  return zipFilePath;
}

export async function unzipServer () {
  
  try{
    const files = await decompress(zipFilePath, config.serverDirectory, {
      filter: file =>
        file.type !== 'directory' &&
        !file.path.endsWith(sep) &&
        file.data.length !== 0 &&
        file.path.includes(`${config.zipPlatformPath}/`),
      map: file => {
        file.path = file.path.replace(new RegExp(`^.+${config.zipPlatformPath}`), config.zipPlatformPath)
        return file;
      }
    });
  } catch (e) {
    console.error(`Error extracting server (${options.fullZipPath}) to unzip directory(${options.unzipPath})`)
    throw e;
  }
}