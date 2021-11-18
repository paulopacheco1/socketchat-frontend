import React from 'react';

import { useChat } from '../../../contexts';

import { Chat } from './Chat';
import { Header } from './Header';
import { ChatHero } from './Hero';

import styles from './styles.module.scss';

export const HomeChat: React.FC = () => {
  const { conversaSelecionada } = useChat();

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {conversaSelecionada ? (
          <>
            <Header />
            <Chat />
          </>
        ) : (
          <ChatHero />
        )}
      </div>
    </div>
  );
};
