import { BASE_URL } from '../constants';
import { Languages, Suggestion } from '../types';

export const getSuggestions = async (
  words: string[],
  lang: Languages
): Promise<Suggestion[]> => {
  const formData = new FormData();

  formData.append('text', words.join(', '));
  formData.append('lang', lang);

  try {
    const res = await fetch(`${BASE_URL}/spell`, {
      body: formData,
      method: 'post',
    });

    const data = await res.json();

    return data as Suggestion[];
  } catch (error) {
    console.log('Something went wrong', JSON.stringify(error));

    return [];
  }
};
