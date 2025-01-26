import { platform } from "os";

let platformConfig;
switch( platform() ) {
  case "linux": {
    platformConfig = {
      zipPath: "Linux",
      executablePath: "Linux/TerrariaServer.bin.x86_64"
    };
    break;
  }
  case "win32": {
    platformConfig = {
      zipPath: "Windows",
      executablePath: "Windows/TerrariaServer.exe"
    };
    break;
  }
  default: throw new Error("Unsupported Platform");
}

export const getPlatformConfig = () => {
  return {
    ...platformConfig
  };
}

export default {
  // url to the latest release of the dedicated server software
  dedicatedServerDownload: 'https://terraria.org/api/download/pc-dedicated-server/',
  // directory to install the server in
  serverDirectory: './server'
};