/**
 * break word into syllables
 * version 0.0.1
 */
import {
  isConsonant,
  isDiphthong,
  isEndsWithCC,
  isEndsWithCCC,
  isEndsWithCV,
  isEndsWithVC,
  isEndsWithVV,
  isVowel,
  restoreDiphthongs,
  simplifyDiphthongs
} from '~/api/util/word.util';

import { isWordExists } from '..';

export const identifyLastSyllable = (word: string): string[] => {
  const directReturn = currentUnhandled(word);
  if (directReturn) return directReturn;

  if (word.endsWith('ng')) return handleEndsWithDiphthong(word);
  if (word.endsWith('sy')) return handleEndsWithDiphthong(word);
  if (word.endsWith('kh')) return handleEndsWithDiphthong(word);
  if (word.endsWith('ny')) return handleEndsWithDiphthong(word);

  if (isEndsWithCCC(word)) return handleEndsWithCCC(word);
  if (isEndsWithCV(word)) return handleEndsWithCV(word);
  if (isEndsWithVC(word)) return handleEndsWithVC(word);

  if (isEndsWithCC(word)) return handleEndsWithCC(word);
  if (isEndsWithVV(word)) return handleEndsWithVV(word);

  return [word.substring(0, word.length - 2), word.substring(word.length - 2)];
};

const handleEndsWithCC = (word: string): string[] => {
  const lastC = word.charAt(word.length - 1);
  const withoutLastC = word.slice(0, -1);
  const syllables = identifyLastSyllable(withoutLastC);
  syllables[syllables.length - 1] += lastC;
  return syllables;
};

const handleEndsWithDiphthong = (word: string): string[] => {
  word = simplifyDiphthongs(word);

  const syllables: string[] = [];

  let firstPart = word.substring(0, word.length - 3);
  let lastPart = word.substring(word.length - 3);

  if (
    firstPart.length === 1 &&
    isConsonant(firstPart) &&
    isConsonant(lastPart.charAt(0))
  ) {
    return [restoreDiphthongs(word)];
  }

  if (
    isConsonant(firstPart.charAt(firstPart.length - 1)) &&
    isConsonant(firstPart.charAt(firstPart.length - 2)) &&
    lastPart.match(/[rl]/)
  ) {
    lastPart = firstPart.charAt(firstPart.length - 1) + lastPart;
    firstPart = firstPart.substring(0, firstPart.length - 1);
  }

  if (isVowel(lastPart.charAt(0))) {
    firstPart += lastPart.charAt(0);
    lastPart = lastPart.substring(1);
  }

  firstPart && syllables.push(restoreDiphthongs(firstPart));
  lastPart && syllables.push(restoreDiphthongs(lastPart));

  return syllables;
};

const handleEndsWithCCC = (word: string): string[] => {
  let firstPart = word.substring(0, word.length - 5);
  let lastPart = word.substring(word.length - 5);

  if (!firstPart) return [word];

  if (isVowel(lastPart.charAt(0))) {
    firstPart += lastPart.charAt(0);
    lastPart = lastPart.substring(1);
  }

  return [firstPart, lastPart];
};

const handleEndsWithCV = (word: string): string[] => {
  word = simplifyDiphthongs(word);
  const firstPart = word.substring(0, word.length - 2);
  const lastPart = word.substring(word.length - 2);

  if (!firstPart) return [restoreDiphthongs(word)];

  return [restoreDiphthongs(firstPart), restoreDiphthongs(lastPart)];
};

const handleEndsWithVC = (word: string): string[] => {
  word = simplifyDiphthongs(word);

  let firstPart = word.substring(0, word.length - 2);
  let lastPart = word.substring(word.length - 2);

  if (
    firstPart.length === 2 &&
    isConsonant(firstPart.charAt(firstPart.length - 1)) &&
    isConsonant(firstPart.charAt(firstPart.length - 2))
  ) {
    return [restoreDiphthongs(word)];
  }

  if (firstPart.length === 1 && isDiphthong(firstPart)) {
    return [restoreDiphthongs(word)];
  }

  // ex: komplek -> kompl.ek
  if (
    isConsonant(firstPart.charAt(firstPart.length - 1)) &&
    isConsonant(firstPart.charAt(firstPart.length - 2)) &&
    isConsonant(firstPart.charAt(firstPart.length - 3))
  ) {
    firstPart = word.substring(0, word.length - 4);
    lastPart = word.substring(word.length - 4);

    return [restoreDiphthongs(firstPart), restoreDiphthongs(lastPart)];
  }

  if (
    isConsonant(firstPart.charAt(firstPart.length - 1)) ||
    isDiphthong(firstPart.charAt(firstPart.length - 1))
  ) {
    firstPart = word.substring(0, word.length - 3);
    lastPart = word.substring(word.length - 3);
  }

  return [restoreDiphthongs(firstPart), restoreDiphthongs(lastPart)];
};

const handleEndsWithVV = (word: string): string[] => {
  if (word.endsWith('iu') || word.endsWith('ae')) {
    return [
      word.substring(0, word.length - 1),
      word.substring(word.length - 1)
    ];
  }

  if (word.startsWith('me') || word.startsWith('be') || word.startsWith('te')) {
    let isWithSuffix = true;

    for (let prefixLength = 2; prefixLength <= 3; prefixLength++) {
      if (!isWithSuffix) break;
      if (word.startsWith('meng')) prefixLength = 4;
      let withoutPrefix = word.substring(prefixLength);
      withoutPrefix = withoutPrefix.replaceAll('ny', 's');
      if (withoutPrefix.startsWith('n') && !withoutPrefix.startsWith('ng')) {
        withoutPrefix = withoutPrefix.replace('n', 't');
      }
      isWithSuffix = !isWordExists(withoutPrefix);
    }

    // merangkai -> merang.kai (rangkai is a word)
    // mewarnai -> mewarna.i (warnai is not a word)
    // suffix is -i
    if (isWithSuffix) {
      return [
        word.substring(0, word.length - 1),
        word.substring(word.length - 1)
      ];
    }
  }

  if (
    ['i', 'u', 'e', 'o'].includes(word.charAt(word.length - 2)) &&
    word.endsWith('a')
  ) {
    return [
      word.substring(0, word.length - 1),
      word.substring(word.length - 1)
    ];
  }

  if (isVowel(word.charAt(word.length - 3))) {
    return [
      word.substring(0, word.length - 2),
      word.substring(word.length - 2)
    ];
  }

  const lastV = word.charAt(word.length - 1);
  const withoutLastV = word.slice(0, -1);
  const syllables = identifyLastSyllable(withoutLastV);
  syllables[syllables.length - 1] += lastV;
  return syllables;
};

const currentUnhandled = (word: string) => {
  if (word === 'iduladha') return ['idulad', 'ha'];
  if (word === 'menggei') return ['meng', 'gei'];
  if (word === 'menggwei') return ['meng', 'gwei'];
  if (word === 'bau') return ['ba', 'u'];
  if (word.endsWith('gram') && word.length > 4) {
    return [word.substring(0, word.length - 4), 'gram'];
  }
  return null;
};
