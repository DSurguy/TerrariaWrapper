## Terraria Wrapper

This is a node-based wrapper for the Terraria Dedicated Server software. The current release of that software can be found [here](http://terraria.org/system/dedicated_servers/archives/000/000/005/original/terraria-server-1303.zip). 

This wrapper will download the latest server, walk you through the configuration process, and then run the server silently as a windows process.

This wrapper only supports Windows, and has no plans to support linux at this time.

##
## Getting Started

###TL;DR:
1. [Install NodeJS](https://nodejs.org/download/)
2. [Download](https://github.com/DSurguy/TerrariaWrapper/archive/master.zip) and unzip the wrapper
3. Double-click `nodeSetup.bat`
	- Or run `npm install` in cmd prompt
4. Double-click `serverSetup.bat`
	- Or run `npm run-script setup` in cmd prompt
5. Double-click `startServer.bat`
	- Or run `npm run-script start` in cmd prompt

##### Install Nodejs
Before you can use the wrapper, make sure that you have NodeJS installed on your machine. Use the following link to find the correct installer. [Download Nodejs Installer](https://nodejs.org/download/)

##### Download the Wrapper
The server wrapper is easy to use, just [download the repository as a zip](https://github.com/DSurguy/TerrariaWrapper/archive/master.zip) and unzip it to the directory of your choice. You can also clone it through git/github.

##### Install node module dependencies
Once unloaded into your chosen directory, there are two ways to install the required node dependencies. You can run the file `nodeSetup.bat` by double-clicking it, or you can open a command prompt (SHIFT+right-click->Open Command Window Here), and type `npm install`. Either method will install the required node modules.

##### Make sure Terraria ports are forwarded to your PC
If you have not [port-forwarded the port you intend to use for Terraria](https://www.google.com/webhp?sourceid=chrome-instant&ion=1&espv=2&ie=UTF-8#q=how%20to%20port%20forward%20terraria), you need to do so! This wrapper will not do it for you.

##### [Advanced] Modify environment variables
This is not necessary to run the wrapper, but could give you addition control over the server you wish to run. You can edit the file `config.js` to change server environment variables before installing the server files.

##### Download and Configure Terraria Server
Next, you need to download the server and configure it for your worlds and players. To do this, you can double-click `serverSetup.bat` or open a command prompt and run `npm run-script -setup`. Follow the prompts provided to configure your server.

Once this is complete, you can check serverconfig.txt in the server's directory to make sure it all looks right.

##### Start your server!
It's time to start the server! You can double-click `startServer.bat` to start the server, or open a command prompt and run `npm run-script start`. Happy digging, Terrarian!

##
## Release Notes
### Current Release (0.2.0)
The current release adds the following features, but is not feature-complete. Version 1.0.0 will be feature-complete.

- Automatic Server Download
- Interactive Server Setup (serverconfig.txt)
- Configurable server directories and filenames
- node-wrapped server process

### Next Planned Release (0.3.0)
The next release will have the following features:

- Console-based manager
- Dynamic Update Checker (No hard-coded paths for server software)
