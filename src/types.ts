export enum Languages {
  FR = 'fr',
  IT = 'it',
  EN_GB = 'en-gb',
}

export const languageList = Object.values(Languages);

export interface Suggestion {
  original: string;
  suggestions: string[];
}
