import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FormHandles, SubmitHandler } from '@unform/core';
import { Form } from '@unform/web';
import { AiOutlineSearch } from 'react-icons/ai';
import { BsArrowLeft } from 'react-icons/bs'; // eslint-disable-line

import { InputBusca } from '../../../Forms/Inputs';

import styles from './styles.module.scss';
import { useChat } from '../../../../contexts';
import useDebounce from '../../../../hooks/useDebounce';

interface BuscaFormData {
  busca: string;
}

export const Busca: React.FC = () => {
  const [busca, setBusca] = useState('');
  const buscaDebounced = useDebounce(busca, 300);

  const formRef = useRef<FormHandles>(null);

  const { buscarConversa, buscarReset } = useChat();

  const handleSubmit: SubmitHandler<BuscaFormData> = async data => {
    if (data.busca !== '') buscarConversa(data.busca);
  };

  const handleButtonClick = useCallback(() => {
    if (!busca) {
      formRef.current?.getFieldRef('busca').current.focus();
    } else {
      formRef.current?.reset();
      setBusca('');
      buscarReset();
    }
  }, [busca, buscarReset]);

  useEffect(() => {
    if (!busca) buscarReset();
  }, [busca, buscarReset]);

  useEffect(() => {
    if (buscaDebounced) formRef.current?.submitForm();
  }, [buscaDebounced]);

  return (
    <div className={styles.container}>
      <Form ref={formRef} onSubmit={handleSubmit} className={styles.content}>
        <button
          type="button"
          className={styles.sendButton}
          onClick={handleButtonClick}
        >
          {busca ? (
            <BsArrowLeft size={18} color="#6c757d" />
          ) : (
            <AiOutlineSearch size={18} color="#6c757d" />
          )}
        </button>

        <InputBusca
          name="busca"
          placeholder="Buscar ou iniciar nova conversa"
          className={styles.input}
          onChange={e => setBusca(e.target.value)}
        />
      </Form>
    </div>
  );
};
