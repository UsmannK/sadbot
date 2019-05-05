//codeWrap wraps a message with triple backticks
//message must end with a \n
export const codeWrap = (message: string) => `\`\`\`\n${message}\`\`\``;
