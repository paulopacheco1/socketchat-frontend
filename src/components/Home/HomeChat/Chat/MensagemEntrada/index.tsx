import React, { useMemo } from 'react';
import { format, parseISO } from 'date-fns'; // eslint-disable-line
import { ptBR } from 'date-fns/locale'; // eslint-disable-line

import { IMensagem } from '../../../../../contexts/chat';

import styles from './styles.module.scss';

interface Props {
  mensagem: IMensagem;
  className: string;
}

export const MensagemEntrada: React.FC<Props> = ({ mensagem, className }) => {
  const dataMensagem = useMemo(() => {
    const data = parseISO(mensagem.dataEnvio);
    return format(data, 'HH:mm', { locale: ptBR });
  }, [mensagem]);

  return (
    <div className={`${styles.container} ${className}`}>
      <p>{mensagem.conteudo}</p>

      <span>{dataMensagem}</span>
    </div>
  );
};
