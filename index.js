var unzip = require('unzip'),
	config = require('./config.js'),
	GetServer = require('./GetServer.js'),
	spawn = require('child_process').spawn,
	exec = require('child_process').exec,
	Q = require('q');

var GetDefer = Q.defer();
GetServer.downloadServer(config.dedicatedServerDownload, {
	downloadLocation: config.downloadDirectory,
	zipName: config.zipName
}).then(function (fileLoc){

	GetServer.unzipServer({
		fullZipPath: fileLoc,
		unzipPath: config.unzipDirectory
	}).then(function (){

		console.log('unzipped');
		GetDefer.resolve();

	}).catch(function (errorString){
		console.error(errorString);
	})
}).catch(function (errorString){
	console.error(errorString);
});

//the server is downloaded, spawn a child process to run it
GetDefer.promise.then(function(){
	try{
		var serverProcess = spawn('.\\Server\\TerrariaServer.exe', ['-config','serverconfig.txt'], {
			stdio: 'inherit'
		});
	} catch(e){
		console.log(e);
	}
});