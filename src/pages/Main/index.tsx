import { FC } from 'react';
import Editor from '../../components/Editor';
import { languageList } from '../../types';
import { getTitleByLang } from '../../helpers';
import classNames from './styles.module.scss';

const Main: FC = () => {
  return (
    <div className={classNames.main}>
      <h1 className={classNames.header}>Spellchecker</h1>

      <div className={classNames.editors}>
        {languageList.map(lang => (
          <Editor key={lang} lang={lang} title={getTitleByLang(lang)} />
        ))}
      </div>
    </div>
  );
};

export default Main;
