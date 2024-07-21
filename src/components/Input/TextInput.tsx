import { ChangeEvent } from 'react';
import { classNames } from '../../helpers/classNames';
import styles from './Input.module.scss';

type TVariant = 'twoLine' | 'oneLine';

type TProps = {
  label: string,
  value: string,
  name?: string,
  onChange: (event: ChangeEvent<HTMLInputElement>) => void,
  disabled?: boolean,
  placeholder?: string,
  className?: string,
  variant?: TVariant,
};

const getVariantClassName = (variant?: TVariant) => {
  switch (variant) {
    case 'twoLine':
      return styles.twoLine;
    case 'oneLine':
      return styles.oneLine;
    default:
      return styles.twoLine;
  }
};

const TextInput = ({ label, value, name, disabled, placeholder, className, onChange, variant }: TProps) => {
  return (
    <div className={classNames(styles.textInput, getVariantClassName(variant), className)}>
      <label>{label}</label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder || label}
      />
    </div>
  );
};

export default TextInput;
