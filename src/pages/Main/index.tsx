import Editor from '../../components/Editor';
import classNames from './styles.module.scss';
import { languageList } from '../../types';
import { getTitleByLang } from '../../helpers';

const Main = () => {
  return (
    <div className={classNames.main}>
      <h1 className={classNames.header}>Spellchecker</h1>

      <div className={classNames.editors}>
        {languageList.map(lang => (
          <Editor key={lang} title={getTitleByLang(lang)} />
        ))}
      </div>
    </div>
  );
};

export default Main;
