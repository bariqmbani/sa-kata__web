export const diphthongs: string[][] = [
  ['ng', 'N'],
  ['ny', 'Y'],
  ['sy', 'S'],
  ['sh', 'Ш'],
  ['kh', 'X'],
  ['dh', 'D']
];

export const isDiphthong = (word: string) =>
  diphthongs.some((diphthong) => word.endsWith(diphthong[1]));

export const isVowel = (letter: string) => letter.match(/[aiueo]/);

export const isConsonant = (letter: string) =>
  letter.match(/[bcdfghjklmnpqrstvwxyz]/);

export const isEndsWithCCC = (word: string) => {
  return (
    isConsonant(word.charAt(word.length - 3)) &&
    isConsonant(word.charAt(word.length - 2)) &&
    isConsonant(word.charAt(word.length - 1))
  );
};

export const isEndsWithCV = (word: string) => {
  return (
    isConsonant(word.charAt(word.length - 2)) &&
    isVowel(word.charAt(word.length - 1))
  );
};

export const isEndsWithVC = (word: string) => {
  return (
    isVowel(word.charAt(word.length - 2)) &&
    isConsonant(word.charAt(word.length - 1))
  );
};

export const isEndsWithCC = (word: string) => {
  return (
    isConsonant(word.charAt(word.length - 2)) &&
    isConsonant(word.charAt(word.length - 1))
  );
};

export const isEndsWithVV = (word: string) => {
  return (
    isVowel(word.charAt(word.length - 2)) &&
    isVowel(word.charAt(word.length - 1))
  );
};

export const simplifyDiphthongs = (word: string) => {
  word = word.toLowerCase();
  diphthongs.forEach((diphthong) => {
    word = word.replaceAll(diphthong[0], diphthong[1]);
  });
  return word;
};

export const restoreDiphthongs = (word: string) => {
  diphthongs.forEach((diphthong) => {
    word = word.replaceAll(diphthong[1], diphthong[0]);
  });
  return word;
};
