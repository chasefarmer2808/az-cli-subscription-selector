#! /usr/bin/env node

import { exec } from 'child_process';

function execShellCommand(cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.error(error);
      }
      resolve(stdout ? stdout : stderr)
    })
  })
}

const accountListRaw = await execShellCommand('az account list');
const subscriptions = JSON.parse(accountListRaw)
console.log(subscriptions)
