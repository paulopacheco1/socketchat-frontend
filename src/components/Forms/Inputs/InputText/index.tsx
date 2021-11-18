import React, { useEffect, useRef } from 'react';
import { useField } from '@unform/core';
import { FiAlertCircle } from 'react-icons/fi';

import { Tooltip } from '../../../Tooltip';

import styles from './styles.module.scss';

interface InputProps {
  name: string;
  className?: string;
  disabled?: boolean;
}

type InputAllProps = JSX.IntrinsicElements['input'] & InputProps;

export const InputText: React.FC<InputAllProps> = ({
  name,
  className,
  disabled,
  ...rest
}: InputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const { fieldName, defaultValue, registerField, error } = useField(name);

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
        ${!!error && styles.hasError}
      `}
    >
      <input
        id={fieldName}
        ref={inputRef}
        defaultValue={defaultValue}
        disabled={disabled}
        {...rest}
      />

      {error && (
        <Tooltip message={error} className={styles.error}>
          <FiAlertCircle size={22} />
        </Tooltip>
      )}
    </div>
  );
};

InputText.defaultProps = {
  className: '',
  disabled: false,
};
