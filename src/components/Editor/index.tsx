import { FC, MouseEventHandler, useCallback, useEffect, useRef, useState } from 'react';
import Quill from 'quill';
import useDebounce from '../../hooks/useDebounce';
import classNames from './styles.module.scss';
import 'quill/dist/quill.snow.css';
import { getSuggestions } from '../../api';
import { Languages, LocalStorageKeys, Suggestion } from '../../types';
import Popup from '../Popup';
import { getCleanString,
  getLocalStorageByKey,
  getPositionOfWord,
  getWordsFromText,
  updateLocalStorage
} from '../../helpers';

const DEFAULT_DICT: Record<Languages, string[]> = {
  [Languages.FR]: [],
  [Languages.IT]: [],
  [Languages.EN_GB]: [],
};

const dictionary: Record<Languages, string[]> = getLocalStorageByKey(LocalStorageKeys.DICTIONARY) || DEFAULT_DICT;
const ignored: Record<Languages, string[]> = getLocalStorageByKey(LocalStorageKeys.IGNORED) || DEFAULT_DICT;

interface EditorProps {
  lang: Languages;
  title?: string;
}

const Editor: FC<EditorProps> = ({ lang, title }) => {
  const [value, setValue] = useState<string>('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [selectedSuggestions, setSelectedSuggestions] = useState<string[]>([]);
  const [selected, setSelected] = useState(null);
  const [isPopupOpened, setIsPopupOpened] = useState(false);

  const debouncedQuery = useDebounce(value, 750);

  const editorId = `#editor-${lang}`;
  const quillRef = useRef<Quill>(null);

  // init
  useEffect(() => {
    const quill = new Quill(document.getElementById(editorId), {
      theme: 'snow',
      placeholder: 'Type something here...'
    });
    quill.on('text-change', () => setValue(quill.getText()));
    quillRef.current = quill;
  }, [editorId]);

  // check spelling
  useEffect(() => {
    const checkSpelling = async (words: string[]) => {
      const res = await getSuggestions(words, lang);
      setSuggestions(res);
    };

    if (debouncedQuery === '\n' || !debouncedQuery) return;

    const words = getWordsFromText(debouncedQuery);
    // check if word already in dictionary or ignored
    const resultWords = words?.filter(w => !(dictionary[lang].includes(w.toLowerCase()) || ignored[lang].includes(w.toLowerCase())));

    if (!resultWords?.length) {
      setSuggestions([]);

      return;
    }

    checkSpelling(resultWords);
  }, [debouncedQuery, lang]);

  // highlight errors and clear format of correct words
  useEffect(() => {
    const text = quillRef.current?.getText();

    if (text === '\n') return;

    const words = getWordsFromText(text);
    words.forEach((word) => {
      const isMisspelled = suggestions.some(suggestion => suggestion.original === word);
      const index = getPositionOfWord(text, word);

      if (index !== undefined) {
        if (isMisspelled) {
          quillRef.current?.formatText(index, word.length, { color: 'red' });
        } else {
          quillRef.current?.removeFormat(index, word.length);
        }
      } else {
        console.log('Error. Cannot get index from word');
      }
    });
  }, [suggestions]);

  const handleClick: MouseEventHandler<HTMLDivElement> = useCallback(e => {
    const target = e.target as HTMLDivElement;

    if (target.nodeName !== 'SPAN') return;

    setSelected(e.target);
    setIsPopupOpened(true);

    const targetSuggestions = suggestions
      .find(s => s.original === getCleanString(target.textContent))?.suggestions || [];

    if (targetSuggestions.length) {
      setSelectedSuggestions(targetSuggestions);
      setSelected(e.target);
      setIsPopupOpened(true);
    }
  }, [suggestions]);

  const handleClosePopup = () => {
    setIsPopupOpened(false);
    setSelected(null);
    // for smooth animation
    setTimeout(() => {
      setSelectedSuggestions([]);
    }, 250);
  };

  const handleSuggestionClick = useCallback((suggestion: string) => {
    selected.textContent = suggestion;
    selected.style.color = 'unset';
    setSuggestions(prev => (prev.filter(item => item.original !== suggestion)));
    handleClosePopup();
  }, [selected]);

  const handleAddToDictionary = useCallback(() => {
    const word = selected?.textContent;
    dictionary[lang].push(word.toLowerCase());
    updateLocalStorage(LocalStorageKeys.DICTIONARY, lang, dictionary);
    handleSuggestionClick(word);
  }, [handleSuggestionClick, lang, selected?.textContent]);

  const handleAddToIgnored = useCallback(() => {
    const word = selected?.textContent;
    ignored[lang].push(word.toLowerCase());
    updateLocalStorage(LocalStorageKeys.IGNORED, lang, ignored);
    handleSuggestionClick(word);
  }, [handleSuggestionClick, lang, selected?.textContent]);

  const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    // prevent wrap several words in one span
    if ([' ', 'Enter'].includes(e.key)) {
      const selection = quillRef.current?.getSelection();

      if (selection) {
        quillRef.current?.removeFormat(selection.index - 1, 1);
      }
    }
  };

  return (
    <div className={classNames.editor}>
      {Boolean(title) && <h2 className={classNames.title}>{title}</h2>}
      <Popup
        anchorEl={selected}
        suggestions={selectedSuggestions}
        addToDictionary={handleAddToDictionary}
        ignore={handleAddToIgnored}
        onSuggestionClick={handleSuggestionClick}
        open={isPopupOpened}
        onClose={handleClosePopup}
      />
      <div id={editorId} onClick={handleClick} onKeyDown={handleKeyDown}></div>
    </div>
  );
};

export default Editor;
