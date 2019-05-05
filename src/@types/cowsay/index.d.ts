declare module 'cowsay' {
  export interface SayArgs {
    text: string;
  }
  export function say(message: SayArgs): string;
}
