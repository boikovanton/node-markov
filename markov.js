/** Textual markov chain generator */

class MarkovMachine {
  /** build markov machine; read in text. */
  constructor(text) {
    let words = text.split(/[ \r\n]+/);
    this.words = words.filter(w => w !== "");
    this.makeChains();
  }

  /** set markov chains:
   *
   * for text of "the cat in the hat", chains will be:
   * { the: ["cat", "hat"], cat: ["in"], in: ["the"], hat: [null] }
   */
  makeChains() {
    this.chains = new Map();

    for (let i = 0; i < this.words.length; i++) {
      const word = this.words[i];
      const nextWord = this.words[i + 1] ?? null;

      if (!this.chains.has(word)) {
        this.chains.set(word, []);
      }
      this.chains.get(word).push(nextWord);
    }
  }

  /** return random text from chains */
  makeText(numWords = 100) {
    if (this.words.length === 0) return "";
    if (numWords <= 0) return "";

    const keys = Array.from(this.chains.keys());
    let word = keys[Math.floor(Math.random() * keys.length)];
    const output = [];

    while (output.length < numWords && word !== null) {
      output.push(word);
      const nextWords = this.chains.get(word);
      word = nextWords[Math.floor(Math.random() * nextWords.length)];
    }

    return output.join(" ");
  }
}

module.exports = { MarkovMachine };
