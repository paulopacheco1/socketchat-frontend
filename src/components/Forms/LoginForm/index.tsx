import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { SiSocketdotio } from 'react-icons/si';
import { Form } from '@unform/web';
import { FormHandles, SubmitHandler } from '@unform/core';
import * as Yup from 'yup';

import { useLogin } from '../../../contexts/login';
import { ApiError, useApiErrorHandler } from '../../../services/api';

import { getValidationErrors, InputText } from '../Inputs';
import { LoadingSpinner } from '../../LoadingSpinner';

import styles from './styles.module.scss';
import commonStyles from '../../../styles/common.module.scss';

interface LoginFormData {
  email: string;
  senha: string;
}

export const LoginForm: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useLogin();
  const { handleException } = useApiErrorHandler();

  const handleSubmit: SubmitHandler<LoginFormData> = async data => {
    try {
      setIsLoading(true);

      formRef.current?.setErrors({});

      const schema = Yup.object().shape({
        email: Yup.string()
          .email('E-mail inválido')
          .required('Digite seu e-mail'),
        senha: Yup.string().required('Digite sua senha'),
      });

      await schema.validate(data, {
        abortEarly: false,
      });

      await login({
        email: data.email,
        senha: data.senha,
      });
    } catch (error) {
      setIsLoading(false);

      if (error instanceof ApiError) handleException(error);

      if (error instanceof Yup.ValidationError) {
        const errors = getValidationErrors(error);
        formRef.current?.setErrors(errors);
      }
    }
  };

  return (
    <div className={styles.container}>
      <Form ref={formRef} onSubmit={handleSubmit} className={styles.content}>
        <SiSocketdotio size={100} color="#2c7da0" />
        <h1>Bem vindo(a) ao SocketChat!</h1>
        <p>Digite seu e-mail e senha para acessar o chat</p>

        <InputText name="email" placeholder="E-mail" className={styles.input} />
        <InputText
          name="senha"
          type="password"
          placeholder="Senha"
          className={styles.input}
        />
        <button
          type="submit"
          className={commonStyles.primaryButton}
          disabled={isLoading}
        >
          {isLoading ? <LoadingSpinner /> : 'Entrar'}
        </button>

        <span>
          Ainda não tem uma conta?{' '}
          <Link href="/cadastro">Faça seu cadastro</Link>
        </span>
      </Form>
    </div>
  );
};
