#! /usr/bin/env node

import inquirer from 'inquirer';
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

async function setSubscription(subscriptionId) {
  await execShellCommand(`az account set --subscription=${subscriptionId}`);
}

const accountListRaw = await execShellCommand('az account list');
const subscriptions = JSON.parse(accountListRaw);
const subNames = subscriptions.map(sub => sub.name);

const selectQuestion = {
  type: 'list',
  name: 'selectedSub',
  message: 'Which subscription would you like to select?',
  choices: subNames
};

const { selectedSub } = await inquirer.prompt([selectQuestion]);
const selectedSubObj = subscriptions.find(sub => sub.name === selectedSub);
await setSubscription(selectedSubObj.id);
console.log(`Successfully set subscription to ${selectedSubObj.name} with ID ${selectedSubObj.id}`);
