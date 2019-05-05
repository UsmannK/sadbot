import { FacebookApi, Message } from 'libfb';

export interface Module {
  name: string;
  trigger: string;
  path: string;
  usage: any; //todo
  description: string;
}

export interface Command {
  trigger: (args: string, api: FacebookApi, message: Message) => void;
}
