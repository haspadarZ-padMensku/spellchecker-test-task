import { FC } from 'react';
import { Menu, MenuItem, Divider, MenuProps } from '@mui/material';
import LibraryBooks from '@mui/icons-material/LibraryBooks';
import Cancel from '@mui/icons-material/Cancel';

interface Props extends MenuProps {
  suggestions: string[];
  addToDictionary: () => void;
  ignore: () => void;
  onSuggestionClick: (suggestion: string) => void;
}

const Popup: FC<Props> = ({
  anchorEl,
  open,
  onClose,
  suggestions,
  addToDictionary,
  ignore,
  onSuggestionClick,
  ...props
}) => {
  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      {...props}
    >
      {suggestions.map(item => (
        <MenuItem
          key={item}
          onClick={() => onSuggestionClick(item)}
        >
          {item}
        </MenuItem>
      ))}

      <Divider/>

      <MenuItem onClick={() => addToDictionary()}>
        <LibraryBooks />
        <span className="menuItem">Add to dictionary</span>
      </MenuItem>
      <MenuItem
        onClick={() => ignore()}
      >
        <Cancel />
        <span className="menuItem">Ignore</span>
      </MenuItem>
    </Menu>
  );
};

export default Popup;
