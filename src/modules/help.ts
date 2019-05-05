import { FacebookApi, Message } from 'libfb';

import { Module } from '../types';
import m from '../modules.json';
import { codeWrap } from '../utils';
const modules = <Module[]>m;

export const trigger = (args: string, api: FacebookApi, message: Message) => {
  const { threadId } = message;
  let helpMessage = '';
  if (args.length > 1) {
    helpMessage = formDesc(args);
  } else {
    helpMessage = formHelp();
  }
  api.sendMessage(threadId, codeWrap(helpMessage));
};

const formHelp = () =>
  'usage: [/command] [<args>]\nSuch as "/echo hello world"\nTo see a list of valid commands, send /help commands\n';

function formHelpCommands() {
  let usageMessage = 'Description   Command\n----------------------\n';

  for (const module in modules) {
    usageMessage += modules[module].name;
    usageMessage += ' '.repeat(15 - modules[module].name.length);
    usageMessage += `[${modules[module].trigger}]`;
    usageMessage += '\n';
  }
  usageMessage += '/help <command> lists available subcommands and descriptions\n';
  return usageMessage;
}

const formDesc = (cmd: string) => {
  if (cmd == 'commands') {
    return formHelpCommands();
  }
  let usageMessage = '';
  for (const module in modules) {
    if (cmd == modules[module].name) {
      usageMessage = `${modules[module].name}: `;
      usageMessage += `${modules[module].description}\n`;
      if (Object.keys(modules[module].usage).length > 0) {
        usageMessage += `Commands begin with /${modules[module].trigger}:\n`;
        for (const key in modules[module].usage) {
          usageMessage += `${key} - `;
          usageMessage += `${modules[module].usage[key]}\n`;
        }
      }
    }
  }
  return usageMessage;
};
