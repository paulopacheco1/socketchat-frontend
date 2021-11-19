import React, { useRef, useState } from 'react';
import { Form } from '@unform/web';
import { FormHandles, SubmitHandler } from '@unform/core';
import { AiOutlineSend } from 'react-icons/ai';

import { InputChat } from '../../../../Forms/Inputs';

import styles from './styles.module.scss';
import { useChat } from '../../../../../contexts';

interface MensagemFormData {
  mensagem: string;
}

export const Input: React.FC = () => {
  const [hasText, setHasText] = useState(false);

  const formRef = useRef<FormHandles>(null);

  const { enviarMensagem } = useChat();

  const handleSubmit: SubmitHandler<MensagemFormData> = async data => {
    if (data.mensagem !== '') {
      enviarMensagem(data.mensagem);
      formRef.current?.reset();
      setHasText(false);
    } else {
      formRef.current?.getFieldRef('mensagem').current.focus();
    }
  };

  return (
    <div className={styles.container}>
      <Form ref={formRef} onSubmit={handleSubmit} className={styles.content}>
        <InputChat
          name="mensagem"
          placeholder="Digite uma mensagem"
          className={styles.input}
          onChange={e =>
            e.target.value ? setHasText(true) : setHasText(false)
          }
        />

        <button type="submit" className={styles.sendButton} disabled={!hasText}>
          <AiOutlineSend size={30} color="#343a40" />
        </button>
      </Form>
    </div>
  );
};
