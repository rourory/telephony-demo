export function findMarkedWord(
  text: string,
  markedWords: MarkedWordEntity[],
): Array<{ root: string; word: string }> {
  const loweredCaseText = text.toLowerCase();
  const markedWordsSet = new Set(
    markedWords.map((item) => {
      return { root: item.root.toLowerCase(), word: item.word.toLowerCase() };
    }),
  );

  const foundWords: Array<{ root: string; word: string }> = [];

  markedWordsSet.forEach((markedWord) => {
    if (loweredCaseText.includes(markedWord.root)) {
      foundWords.push(markedWord);
    }
  });

  return foundWords;
}
