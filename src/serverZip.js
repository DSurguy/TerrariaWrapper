import decompress from 'decompress';
import { createWriteStream } from 'fs';
import { mkdir } from 'fs/promises';
import { resolve, sep } from 'path';
import { Readable } from 'stream';
import { finished } from 'stream/promises';
import config from './config.js';

const zipFilePath = resolve(config.serverDirectory, 'server.zip');

export async function downloadServer(){
  // create the local directory to house the actual terraria server
  await mkdir(config.serverDirectory, {
    recursive: true
  })

  // fetch the latest server release zip file name
  const data = await fetch("https://terraria.org/api/get/dedicated-servers-names");
  const zipName = (await data.json())[0];
  const serverZipFullUrl = `${config.dedicatedServerDownload}${zipName}`

  // attempt to download the server zip
  const { body } = await fetch(serverZipFullUrl);
  var zipFileStream = createWriteStream(zipFilePath);
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