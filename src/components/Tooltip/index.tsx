import React from 'react';

import styles from './styles.module.scss';

interface TooltipProps {
  message: string;
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
  message,
  className,
  children,
}) => {
  return (
    <div className={`${className} ${styles.container}`}>
      <span>{message}</span>
      {children}
    </div>
  );
};

Tooltip.defaultProps = {
  className: '',
};
