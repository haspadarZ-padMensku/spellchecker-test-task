import { Languages } from './types';

export const getTitleByLang = (lang: Languages) => {
  switch (lang) {
  case Languages.FR:
    return 'French';
  case Languages.IT:
    return 'Italian';
  case Languages.EN_GB:
    return 'English GB';

  default:
    return '';
  }
};

export const getPositionOfWord = (text: string, word: string) => {
  if (!text) return -1;

  const cleanedWord = getCleanString(word);

  const regex = /\b[\w-]+\b/g;
  let match;

  while (match !== null) {
    match = regex.exec(text);

    if (match?.[0] === cleanedWord) {
      return match.index;
    }
  }
};

export const getCleanString = (str: string) => {
  return str.replace(/[.,/#!?$%^&*;:{}=\-_~()><]/g, '');
};

export const getWordsFromText = (text: string) => {
  const clearText = getCleanString(text);
  const regex = /[^\s]+/g;
  const wordsArray = clearText.match(regex);

  return wordsArray || [];
};

