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