import { chmod } from "fs/promises";
import config from './config.js';
import { resolve } from "path";

export async function doPlatformSpecificSetup() {
  switch(config.zipPlatformPath) {
    case "Linux": await linuxSetup(); break;
    case "Windows": await windowsSetup(); break;
    case "Mac": await macSetup(); break;
  }
}

async function linuxSetup() {
  await chmod(resolve(config.serverDirectory, config.zipPlatformPath, 'TerrariaServer.bin.x86_64'), 744)
}

function macSetup() {
  // TODO
}

function windowsSetup() {
  // TODO
}