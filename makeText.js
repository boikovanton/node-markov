/** Command-line tool to generate Markov text. */

const fs = require("fs");
const axios = require("axios");
const { MarkovMachine } = require("./markov");

function printAndExitError(msg) {
  console.error(msg);
  process.exit(1);
}

function generateText(text) {
  const mm = new MarkovMachine(text);
  console.log(mm.makeText());
}

function makeTextFromFile(path) {
  fs.readFile(path, "utf8", (err, data) => {
    if (err) {
      printAndExitError(`Error: cannot read file '${path}': ${err.message}`);
    }
    generateText(data);
  });
}

async function makeTextFromURL(url) {
  try {
    const resp = await axios.get(url);
    generateText(resp.data);
  } catch (err) {
    // axios errors can be a little nested; this keeps message nice
    const status = err.response ? ` (status ${err.response.status})` : "";
    printAndExitError(`Error: cannot fetch URL '${url}'${status}: ${err.message}`);
  }
}

// ------------------- main -------------------

const [mode, source] = process.argv.slice(2);

if (!mode || !source || (mode !== "file" && mode !== "url")) {
  printAndExitError(
    "Usage:\n  node makeText.js file <path>\n  node makeText.js url <url>"
  );
}

if (mode === "file") {
  makeTextFromFile(source);
} else {
  makeTextFromURL(source);
}
