///<reference path="../@types/cowsay/index.d.ts" />
/**
 *  Name: Cowsay
 *  Description: Replies with a cowsay of a message.
 *  Usage: /cowsay String in
 *  Author: j <jay@jayhankins.me>
 */

import cowsay from 'cowsay';
import { FacebookApi, Message } from 'libfb';

export const trigger = (args: string, api: FacebookApi, message: Message) => {
  const msg = cowsay.say({
    text: args
  });
  api.sendMessage(message.threadId, `\`\`\`${msg}\`\`\``);
};
