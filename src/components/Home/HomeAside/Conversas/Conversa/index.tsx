import React, { useCallback, useMemo } from 'react';
import {
  isToday,
  isYesterday,
  isAfter,
  subDays,
  parseISO,
  format,
} from 'date-fns'; // eslint-disable-line
import { ptBR } from 'date-fns/locale'; // eslint-disable-line

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

  const dataUltimaMensagem = useMemo(() => {
    if (conversa?.mensagens?.length === 0 || !conversa.mensagens[0]) return '';

    const data = parseISO(conversa.mensagens[0].dataEnvio);

    if (isToday(data)) return format(data, 'HH:mm', { locale: ptBR });
    if (isYesterday(data)) return 'Ontem';
    if (isAfter(data, subDays(new Date(), 7)))
      return format(data, 'EEEE', { locale: ptBR });

    return format(data, 'dd/MM/yyyy', { locale: ptBR });
  }, [conversa]);

  return (
    <button
      type="button"
      className={`
        ${styles.container}
        ${conversaSelecionada?.id === conversa.id ? styles.selected : ''}
        ${conversa?.mensagens?.length === 0 ? styles.novaConversa : ''}
      `}
      onClick={handleClick}
    >
      <div className={styles.content}>
        <h3>{conversa.nome}</h3>
        <p>
          {conversa?.mensagens?.length > 0
            ? conversa.mensagens[0].conteudo
            : '# Iniciar conversa'}
        </p>
      </div>
      <div className={styles.aside}>
        {!!dataUltimaMensagem && <span>{dataUltimaMensagem}</span>}
        <pre className={conversa.possuiNotificacao ? styles.notificacao : ''} />
      </div>
    </button>
  );
};
