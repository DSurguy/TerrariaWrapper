import { createServerConfig } from './serverConfig.js';
import { downloadServer, unzipServer } from './serverZip.js';
import { doPlatformSpecificSetup } from './platformSetup.js';

await downloadServer();
await unzipServer();
console.log("Server downloaded, now setting up config")
await createServerConfig();
console.log("Performing platform-specific setup")
await doPlatformSpecificSetup();
console.log('Setup Finished, run \'npm start\' to start the server! ');