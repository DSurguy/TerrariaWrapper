// spawn('TerrariaServer.exe', ['-config','serverconfig.txt'], {
//   stdio: 'inherit',
//   cwd: './Server'
// });
import { spawn } from 'child_process';

import config from './config.js';
import { resolve } from 'path';

spawn(
  'Linux/TerrariaServer.bin.x86_64',
  ['-config', resolve(config.serverDirectory, 'serverconfig.txt')],
  {
    stdio: 'inherit',
    cwd: resolve(config.serverDirectory)
  }
)