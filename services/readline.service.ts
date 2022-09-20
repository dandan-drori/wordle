import { createInterface } from "readline";

const rl = createInterface({
  input: process.stdin,
  output: process.stdout
});

export async function ask(question: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, (res) => resolve(res));
  });
}

export function closeRL(): void {
  rl.close();
}

