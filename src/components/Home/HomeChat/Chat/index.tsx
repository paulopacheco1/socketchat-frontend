import React, { useCallback, useEffect, useLayoutEffect, useRef } from 'react';

import { useLogin, useChat } from '../../../../contexts';

import { MensagemEntrada } from './MensagemEntrada';
import { MensagemSaida } from './MensagemSaida';
import { Input } from './Input';
import { LoadingSpinner } from '../../../LoadingSpinner';

import styles from './styles.module.scss';

export const Chat: React.FC = () => {
  const { usuario } = useLogin();
  const { getMensagens, conversaSelecionadaLoading, conversaSelecionada } =
    useChat();

  const LOAD_MORE_THRESHOLD = 300;

  const focusRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    focusRef?.current?.focus();
  }, []);

  useEffect(() => {
    if (conversaSelecionada?.id) {
      getMensagens(
        conversaSelecionada.id,
        conversaSelecionada.mensagens.at(-1)?.id as number,
      );
    }
  }, [conversaSelecionada?.id]); // eslint-disable-line

  const handleScroll = useCallback(
    (event: React.UIEvent<HTMLDivElement>) => {
      if (conversaSelecionada?.id) {
        const { clientHeight, scrollHeight, scrollTop } = event.currentTarget;
        const distanceToTop = scrollHeight + scrollTop - clientHeight;

        if (distanceToTop <= LOAD_MORE_THRESHOLD && !conversaSelecionadaLoading)
          getMensagens(
            conversaSelecionada.id,
            conversaSelecionada.mensagens.at(-1)?.id as number,
          );
      }
    },
    [conversaSelecionada, getMensagens, conversaSelecionadaLoading],
  );

  return (
    <div className={styles.container}>
      <div
        className={`${styles.loading} ${
          conversaSelecionadaLoading ? styles.isActive : ''
        }`}
      >
        <LoadingSpinner />
      </div>

      <div className={styles.mensagens} onScroll={handleScroll}>
        <div className={styles.ghost} tabIndex={0} ref={focusRef} /> { /* eslint-disable-line */}

        {conversaSelecionada?.mensagens.map((mensagem, index) => {
          const next = conversaSelecionada.mensagens[index + 1];

          if (mensagem.idRemetente === usuario?.id)
            return (
              <MensagemSaida
                key={mensagem.id}
                mensagem={mensagem}
                className={
                  !next || next.idRemetente !== usuario?.id
                    ? styles.hasDetail
                    : ''
                }
              />
            );
          return (
            <MensagemEntrada
              key={mensagem.id}
              mensagem={mensagem}
              className={
                !next || next.idRemetente === usuario?.id
                  ? styles.hasDetail
                  : ''
              }
            />
          );
        })}
      </div>

      <Input />
    </div>
  );
};
