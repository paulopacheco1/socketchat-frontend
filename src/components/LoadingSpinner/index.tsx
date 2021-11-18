import React from 'react';
import Lottie from 'react-lottie-player';

import styles from './styles.module.scss';

import loadingAnimation from './loading-spinner.json';

interface Props {
  width?: number;
  height?: number;
}

export const LoadingSpinner: React.FC<Props> = ({
  width = 30,
  height = 30,
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <Lottie
          animationData={loadingAnimation}
          rendererSettings={{ preserveAspectRatio: 'xMidYMid slice' }}
          style={{ width, height }}
          loop
          play
          speed={2.5}
        />
      </div>
    </div>
  );
};

LoadingSpinner.defaultProps = {
  height: undefined,
  width: undefined,
};
