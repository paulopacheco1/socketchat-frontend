import React from 'react';

import { IMensagem } from '../../../../../contexts/chat';

import styles from './styles.module.scss';

interface Props {
  mensagem: IMensagem;
  className: string;
}

export const MensagemEntrada: React.FC<Props> = ({ mensagem, className }) => {
  return (
    <div className={`${styles.container} ${className}`}>
      <p>{mensagem.conteudo}</p>
    </div>
  );
};
