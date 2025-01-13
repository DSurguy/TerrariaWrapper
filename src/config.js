import { platform } from "os";

let platformPath;

switch( platform() ) {
  case "linux": platformPath = "Linux"; break;
  case "darwin": platformPath = "Mac"; break;
  case "win32": platformPath = "Windows"; break;
  default: throw new Error("Unsupported Platform");
}

export default {
	// url to the latest release of the dedicated server software
	dedicatedServerDownload: 'https://terraria.org/api/download/pc-dedicated-server/terraria-server-1449.zip',
	// directory to install the server in
	serverDirectory: './server',
	// OS-Specific folder to unzip from archive
	zipPlatformPath: platformPath,
};