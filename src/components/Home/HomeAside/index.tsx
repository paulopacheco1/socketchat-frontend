import React from 'react';

import { Usuario } from './Usuario';
import { Conversas } from './Conversas';

import styles from './styles.module.scss';
import { Busca } from './Busca';

export const HomeAside: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <Usuario />
        <Busca />
        <Conversas />
      </div>
    </div>
  );
};
