import { chmod } from "fs/promises";
import config, { getPlatformConfig } from './config.js';
import { resolve } from "path";

export async function doPlatformSpecificSetup() {
  switch(getPlatformConfig().zipPath) {
    case "Linux": await linuxSetup(); break;
    case "Windows": await windowsSetup(); break;
    case "Mac": await macSetup(); break;
  }
}

async function linuxSetup() {
  await chmod(resolve(config.serverDirectory, getPlatformConfig().zipPath, 'TerrariaServer.bin.x86_64'), 744)
}

function macSetup() {
  console.error("The mac platform is not supported at this time");
  process.exit(1);
}

async function windowsSetup() {
  await chmod(resolve(config.serverDirectory, getPlatformConfig().zipPath, 'TerrariaServer.exe'), 744)
}