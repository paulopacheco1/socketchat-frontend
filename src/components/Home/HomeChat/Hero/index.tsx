import React from 'react';
import { SiSocketdotio } from 'react-icons/si';

import styles from './styles.module.scss';

export const ChatHero: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <SiSocketdotio size={120} color="#2c7da0" />
        <h1>Bem vindo(a) ao SocketChat!</h1>
        <p>Selecione ou inicie uma conversa para se conectar!</p>
      </div>
    </div>
  );
};
