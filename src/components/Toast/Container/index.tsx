import React from 'react';
import { useTransition, animated } from 'react-spring';

import { IToast, Toast } from '../index';

import styles from './styles.module.scss';

interface ToastContainerProps {
  toasts: IToast[];
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts }) => {
  const toastsWithTransitions = useTransition(toasts, {
    from: { right: '-120%', opacity: 0 },
    enter: { right: '0%', opacity: 1 },
    leave: { right: '-120%', opacity: 0 },
  });

  return (
    <div className={styles.container}>
      {toastsWithTransitions((style, toastProps) => (
        <animated.div style={style} className={styles.toast}>
          <Toast {...toastProps} />
        </animated.div>
      ))}
    </div>
  );
};

export default ToastContainer;
