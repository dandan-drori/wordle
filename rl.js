
const readline = require("readline")

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function ask(question) {
  return new Promise((resolve) => {
    rl.question(question, (res) => resolve(res));
  });
}

function close() {
  rl.close();
}

module.exports = {
  ask,
  close,
}

