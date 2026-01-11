const { MarkovMachine } = require("./markov");

describe("MarkovMachine", function () {
  test("constructor splits words and filters empty", function () {
    const mm = new MarkovMachine("  the   cat \n in  the ");
    expect(mm.words).toEqual(["the", "cat", "in", "the"]);
  });

  test("makeChains builds correct Map entries for simple input", function () {
    const mm = new MarkovMachine("the cat in the hat");

    expect(mm.chains.get("the")).toEqual(["cat", "hat"]);
    expect(mm.chains.get("cat")).toEqual(["in"]);
    expect(mm.chains.get("in")).toEqual(["the"]);
    expect(mm.chains.get("hat")).toEqual([null]);
  });

  test("makeText returns string with <= numWords words", function () {
    const mm = new MarkovMachine("the cat in the hat");
    const out = mm.makeText(10);
    const words = out.split(" ");
    expect(words.length).toBeLessThanOrEqual(10);
  });

  test("makeText only uses words that exist in original input", function () {
    const mm = new MarkovMachine("the cat in the hat");
    const out = mm.makeText(50);
    const words = out.split(" ");

    for (let w of words) {
      expect(mm.chains.has(w)).toBe(true);
    }
  });

  test("empty text makes empty output", function () {
    const mm = new MarkovMachine("");
    expect(mm.makeText()).toBe("");
  });

  test("numWords <= 0 returns empty string", function () {
    const mm = new MarkovMachine("the cat");
    expect(mm.makeText(0)).toBe("");
    expect(mm.makeText(-5)).toBe("");
  });

  test("generated text transitions follow chains", function () {
    const mm = new MarkovMachine("the cat in the hat");
    const out = mm.makeText(50);
    const words = out.split(" ");

    // check each adjacent pair is allowed by the chain
    for (let i = 0; i < words.length - 1; i++) {
      const w = words[i];
      const next = words[i + 1];
      expect(mm.chains.get(w)).toContain(next);
    }
  });
});
