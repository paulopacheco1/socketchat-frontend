import React, { useEffect, useState, useCallback } from 'react';

import { FiAlertCircle, FiCheckCircle, FiInfo, FiX } from 'react-icons/fi';

import { useToast } from '../../contexts/toast';

import styles from './styles.module.scss';

export interface IToast {
  id: string;
  type?: 'success' | 'error' | 'info';
  title: string;
  description?: string;
  timeout?: number;
}

const icons = {
  info: <FiInfo size={24} />,
  success: <FiCheckCircle size={24} />,
  error: <FiAlertCircle size={24} />,
};

export const Toast: React.FC<IToast> = ({
  id,
  type,
  title,
  description,
  timeout = 5000,
}) => {
  const [timer, setTimer] = useState<ReturnType<typeof setTimeout>>();

  const { removeToast } = useToast();

  useEffect(() => () => timer ? clearTimeout(timer) : undefined, [timer]);

  useEffect(() => {
    if (timeout > 0) {
      setTimer(
        setTimeout(() => {
          removeToast(id);
        }, timeout),
      );
    }
  }, [removeToast, id, timeout]);

  const handleFocus = useCallback(() => {
    if (timer) clearTimeout(timer);
  }, [timer]);

  const handleBlur = useCallback(() => {
    if (timeout > 0) {
      setTimer(
        setTimeout(() => {
          removeToast(id);
        }, 1000),
      );
    }
  }, [removeToast, id, timeout]);

  return (
    <div
      className={`${styles.container} ${styles[type || 'info']}`}
      onFocus={handleFocus}
      onMouseOver={handleFocus}
      onBlur={handleBlur}
      onMouseOut={handleBlur}
    >
      {icons[type || 'info']}

      <div>
        <strong>{title}</strong>
        {description && <p>{description}</p>}
      </div>

      <button onClick={() => removeToast(id)} type="button">
        <FiX size={18} />
      </button>
    </div>
  );
};
