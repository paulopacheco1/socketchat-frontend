import React from 'react';
import { BsChatLeftDots } from 'react-icons/bs';

import styles from './styles.module.scss';

export const AsideHero: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <BsChatLeftDots size={40} color="#2c7da0" />
        <h1>Nada encontrado por aqui...</h1>
      </div>
    </div>
  );
};
