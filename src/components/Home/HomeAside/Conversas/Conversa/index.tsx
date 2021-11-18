import React, { useCallback } from 'react';

import { IConversa, useChat } from '../../../../../contexts/chat';

import styles from './styles.module.scss';

interface Props {
  conversa: IConversa;
}

export const Conversa: React.FC<Props> = ({ conversa }) => {
  const { selecionarConversa, conversaSelecionada } = useChat();

  const handleClick = useCallback(() => {
    selecionarConversa(conversa);
  }, [conversa, selecionarConversa]);

  return (
    <button
      type="button"
      className={`${styles.container} ${
        conversaSelecionada?.id === conversa.id ? styles.selected : ''
      }`}
      onClick={handleClick}
    >
      <h3>{conversa.nome}</h3>
      <p>
        {conversa?.mensagens?.length > 0
          ? conversa.mensagens[0].conteudo
          : 'Nova conversa'}
      </p>
    </button>
  );
};
