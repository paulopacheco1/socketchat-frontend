import React from 'react';
import { BsChatLeftText } from 'react-icons/bs';

import { useChat } from '../../../../contexts';

import styles from './styles.module.scss';

export const Header: React.FC = () => {
  const { conversaSelecionada } = useChat();

  return (
    <div className={styles.container}>
      <h2>{conversaSelecionada?.nome}</h2>
      <BsChatLeftText size={24} color="#909aa3" />
    </div>
  );
};
