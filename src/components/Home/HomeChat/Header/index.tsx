import React from 'react';

import { useChat } from '../../../../contexts';

import styles from './styles.module.scss';

export const Header: React.FC = () => {
  const { conversaSelecionada } = useChat();

  return (
    <div className={styles.container}>
      <h2>{conversaSelecionada?.nome}</h2>
    </div>
  );
};
