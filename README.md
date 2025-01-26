## Terraria Wrapper

This is a node-based wrapper for the Terraria Dedicated Server software.

This app gets the current release version from [https://terraria.org/api/get/dedicated-servers-names](https://terraria.org/api/get/dedicated-servers-names), and downloads it from `https://terraria.org/api/download/pc-dedicated-server/<zipFile>`.

The user will then be prompted to set up their config file (with some sensible defaults). Once complete, the server can be started through `npm start`. The server prompt is passed through, so all the [normal terraria server commands are available](https://terraria.wiki.gg/wiki/Server#Command-line_parameters).

The user should use whatever platform-specific method they desire to run that as a background command, or add it to their system as a service.

## Getting Started

### TL;DR:
1. [Install NodeJS](https://nodejs.org/download/)
2. Clone or download and unpack this repository
3. `npm install`
4. `npm run setup`
5. `npm run start`

#### Install Nodejs
Before you can use the wrapper, make sure that you have NodeJS installed on your machine. Use the following link to find the correct installer. [Download Nodejs Installer](https://nodejs.org/download/)

#### Download the Wrapper
The server wrapper is easy to use, just [download the repository as a zip](https://github.com/DSurguy/TerrariaWrapper/archive/master.zip) and unzip it to the directory of your choice. You can also clone it through git/github.

#### Install node module dependencies
Once unloaded into your chosen directory, open a command/terminal prompt and type `npm install`.

#### Make sure Terraria ports are forwarded to your PC
If you have not [port-forwarded the port you intend to use for Terraria](https://www.google.com/search?q=how+to+forward+ports), you need to do so! This wrapper will not do it for you.

#### Download and Configure Terraria Server
Next, you need to download the server and configure it for your worlds and players. `npm run setup`. Follow the prompts provided to configure your server.

Once this is complete, you can check serverconfig.txt in the server's directory to make sure it all looks right.

#### Start your server!
It's time to start the server! Open a command/terminal prompt and run `npm run start`. Happy digging, Terrarian!
