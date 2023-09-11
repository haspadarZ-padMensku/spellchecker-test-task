import { FC, useState } from 'react';
import ReactQuill from 'react-quill';
import classNames from './styles.module.scss';
import 'react-quill/dist/quill.snow.css';

interface EditorProps {
  title?: string;
}

const Editor: FC<EditorProps> = ({ title }) => {
  const [value, setValue] = useState('');

  return (
    <div className={classNames.editor}>
      {Boolean(title) && <h2 className={classNames.title}>{title}</h2>}
      <ReactQuill value={value} onChange={setValue} />
    </div>
  );
};

export default Editor;
