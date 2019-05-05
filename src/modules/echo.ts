import { FacebookApi, Message } from 'libfb';

const trigger = (args: string, api: FacebookApi, message: Message) => {
  api.sendMessage(message.threadId, args);
};

module.exports = {
  trigger
};
