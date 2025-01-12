import { createServerConfig } from './serverConfig.js';
import { downloadServer, unzipServer } from './serverZip.js';
import config from './config.js';
import { spawn } from 'child_process';

if( process.argv[2] == "-setup" ){
	downloadServer(config.dedicatedServerDownload, {
		downloadLocation: config.downloadDirectory,
		zipName: config.zipName
	}).then(function (fileLoc){
		return unzipServer({
			fullZipPath: fileLoc,
			unzipPath: config.serverDirectory
		});
	}).then(function (){
		console.log("Server downloaded, now setting up config")
		return createServerConfig(config.serverDirectory);
	}).then(function (){
		console.log('Setup Finished, run \'npm start\' to start the server! ');
	}).catch(function (err){
		console.error(err);
		console.error(err.stack)
	});
}
else if( process.argv[2] == "-start" ){
	try{
		spawn('TerrariaServer.exe', ['-config','serverconfig.txt'], {
			stdio: 'inherit',
			cwd: './Server'
		});
	} catch(e){
		console.log(e);
	}
}