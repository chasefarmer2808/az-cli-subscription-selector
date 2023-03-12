#! /usr/bin/env node

import inquirer from "inquirer";
import { exec } from "child_process";

function execShellCommand(cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.error(error);
      }
      if (stderr) {
        console.error(stderr);
      }
      resolve(stdout ? stdout : stderr);
    });
  });
}

async function getCurrentSubscription() {
  const subRaw = await execShellCommand("az account show");
  return JSON.parse(subRaw);
}

async function setSubscription(subscriptionId) {
  await execShellCommand(`az account set --subscription=${subscriptionId}`);
}

const currSub = await getCurrentSubscription();
console.log(`Current subscription: ${currSub.name}`);

const accountListRaw = await execShellCommand("az account list");
const subscriptions = JSON.parse(accountListRaw);

if (subscriptions.length === 0) {
  console.warn("No subscriptions found.");
  process.exit();
}

const promptChoices = subscriptions.map((sub) => {
  if (sub.id === currSub.id) {
    return {
      name: `* ${sub.name} (${sub.id})`,
      value: sub.id,
    };
  }

  return {
    name: `${sub.name} (${sub.id})`,
    value: sub.id,
  };
});

const selectQuestion = {
  type: "list",
  name: "selectedSub",
  message: "Which subscription would you like to select?",
  choices: promptChoices,
};

const { selectedSub } = await inquirer.prompt([selectQuestion]);
const selectedSubObj = subscriptions.find((sub) => sub.id === selectedSub);
await setSubscription(selectedSubObj.id);
console.log(
  `Successfully set subscription to ${selectedSubObj.name} with ID ${selectedSubObj.id}`
);
