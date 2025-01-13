import { EOL } from 'os';
import { resolve } from 'path';
import { writeFile } from 'fs/promises';
import config from './config.js';

export async function createServerConfig (){
  try {
    const configData = await gatherConfig();
    
    var configString = [
      '# World File Settings',
      'world='+resolve(config.serverDirectory, 'worlds', configData.world.worldName+'.wld'),
      'worldpath='+resolve(config.serverDirectory, 'worlds'),
      '',
      '# Server Setup',
      'motd='+configData.server.motd,
      'port='+configData.server.port,
      'password='+configData.server.password || '',
      'maxplayers='+configData.server.maxPlayers,
      'secure=1',
      'lang='+configData.server.language,
      'priority=1',
      '#upnp=1',
      '#npcstream=60',
      '',
      '# World Setup',
      'worldname='+configData.world.worldName,
      'autocreate='+configData.world.worldSize,
      'diffculty='+configData.world.difficulty,
    ]

    await writeFile(resolve(config.serverDirectory, 'serverconfig.txt'), configString.join(EOL));
  } catch (e) {
    console.error('Error writing serverconfig.txt');
    throw e;
  }
}

async function gatherConfig() {
  const configData = {};
  const serverConfig = await collectConfigPrompts('server');
  const worldConfig = await collectConfigPrompts('world');
  configData.server = serverConfig;
  configData.world = worldConfig;

  return configData;
};

async function getInput(prompt, defaultValue) {
  return new Promise((resolve, reject) => {
    process.stdout.write(`${prompt} > `);
    process.stdin.resume();

    process.stdin.once('data', function (text){
      process.stdin.pause();
      if( text.toString().trim() === '' ){
        resolve(defaultValue);
      } else {
        resolve(text.toString().trim().split(/\r\n|\r|\n/g)[0].trim());
      }
    });
  })
}

async function collectConfigPrompts (promptGroup){
  const groupConfig = {};

  for( const { prompt, defaultValue, key } of configDefinition[promptGroup] ) {
    groupConfig[key] = await getInput(prompt, defaultValue)
  }
  
  return groupConfig;
};

var configDefinition = {
  server: [{
    prompt: 'Maximum Players (8)',
    defaultValue: 8,
    key: 'maxPlayers'
  }, {
    prompt: 'Port (7777)',
    defaultValue: 7777,
    key: 'port'
  }, {
    prompt: 'password (none)',
    defaultValue: '',
    key: 'password'
  }, {
    prompt: 'Language 1=English, 2=German, 3=Italian, 4=French, 5=Spanish (1)',
    defaultValue: 1,
    key: 'language'
  }, {
    prompt: 'MOTD ("Welcome to Terraria!")',
    defaultValue: 'Welcome to Terraria!',
    key: 'motd'
  }],
  world: [{
    prompt: 'World Name ("MyWorld")',
    defaultValue: 'MyWorld',
    key: 'worldName'
  }, {
    prompt: 'World Size 1=small, 2=medium, 3=large (2)',
    defaultValue: 2,
    key: 'worldSize'
  }, {
    prompt: 'Difficulty 0=Normal, 1=Expert, 2=Master, 3=Journey (0)',
    defaultValue: 0,
    key: 'difficulty'
  }]
};