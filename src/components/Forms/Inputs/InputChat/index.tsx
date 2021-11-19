import React, { useEffect, useRef } from 'react';
import { useField } from '@unform/core';

import styles from './styles.module.scss';

interface InputProps {
  name: string;
  className?: string;
  disabled?: boolean;
}

type InputAllProps = JSX.IntrinsicElements['input'] & InputProps;

export const InputChat: React.FC<InputAllProps> = ({
  name,
  className,
  disabled,
  ...rest
}: InputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const { fieldName, defaultValue, registerField } = useField(name);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef,
      getValue: ref => {
        return ref.current.value;
      },
      setValue: (ref, value) => {
        ref.current.value = value;
      },
      clearValue: ref => {
        ref.current.value = '';
      },
    });
  }, [fieldName, registerField]);

  return (
    <div
      className={`
        ${className}
        ${styles.container}
        ${disabled && styles.disabled}
      `}
    >
      <input
        id={fieldName}
        ref={inputRef}
        defaultValue={defaultValue}
        disabled={disabled}
        autoComplete="off"
        {...rest}
      />
    </div>
  );
};

InputChat.defaultProps = {
  className: '',
  disabled: false,
};
