import { wordRepository } from '~/api/data/repository';
import type { GameAnswer } from '~/api/service';

export const isWordExists = (word: string) => {
  return wordRepository.includes(word);
};

export const getRandomWord = () => {
  const filtered = wordRepository.filter((w) => {
    return (
      !excludedFirstWords.includes(w) &&
      w.length >= 5 &&
      /^[a-z-]+$/i.test(w) &&
      w.charAt(0).match(/[a-z]/i)
    );
  });
  const randomIndex = Math.floor(Math.random() * filtered.length);
  return filtered[randomIndex];
};

export const getCurrentGameAnswer = (answers: GameAnswer[]): GameAnswer => {
  const correctAnswers = answers.filter((ans) => ans.isCorrect);
  return correctAnswers[correctAnswers.length - 1];
};

const excludedFirstWords = [
  'strok',
  'stembusakkoord',
  // CCC
  'kulturkampf',
  'oorlogsrecht',
  'paardekracht',
  'overweight',
  'bkpsdm',
  'rupslb',
  'sfinks',
  'sherry',
  'snatch',
  'punch',
  'buggy',
  'henry',
  'yolks',
  'yacht',
  'karst',
  'werst',
  'wispy',
  'bkkbn',
  'bkkks',
  'bphtb',
  'bpkln',
  'kpknl',
  'kuhpt',
  'lhkpn',
  'lppks',
  'nkkbs',
  'pltbg',
  'pltbm',
  'pltgb',
  'rapbd',
  'rapbn',
  'rupst',
  'sippt',
  'skshh',
  'stpdn',
  'uuspn',
  // CC
  'sougb',
  'pueyd',
  // VV
  'syafii',
  'tabii',
  'menggwei',
  'renvooi',
  'milieu',
  'hippie',
  'lingerie',
  'malversatie',
  'novatie',
  'ochlocratie',
  'reconventie',
  'refactie',
  'curie',
  // CV
  'ohidha',
  // -sy
  'arasy',
  'bihausy',
  'quraisy',
  'tarkasy',
  // -ng
  'sling',
  'blang',
  'nyang',
  'plong',
  'ngung',
  'wrang',
  'hyang'
];
