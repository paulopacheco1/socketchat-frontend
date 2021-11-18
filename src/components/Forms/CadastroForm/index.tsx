import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { Form } from '@unform/web';
import { FormHandles, SubmitHandler } from '@unform/core';
import { SiSocketdotio } from 'react-icons/si';
import * as Yup from 'yup';

import { useLogin } from '../../../contexts/login';
import { ApiError, useApiErrorHandler } from '../../../services/api';

import { getValidationErrors, InputText } from '../Inputs';
import { LoadingSpinner } from '../../LoadingSpinner';

import styles from './styles.module.scss';
import commonStyles from '../../../styles/common.module.scss';

interface CadastroFormData {
  nome: string;
  email: string;
  senha: string;
  senhaConfirm: string;
}

export const CadastroForm: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { cadastro } = useLogin();
  const { handleException } = useApiErrorHandler();

  const handleSubmit: SubmitHandler<CadastroFormData> = async data => {
    try {
      setIsLoading(true);

      formRef.current?.setErrors({});

      const schema = Yup.object().shape({
        nome: Yup.string().required('Digite seu nome'),
        email: Yup.string()
          .email('E-mail inválido')
          .required('Digite seu e-mail'),
        senha: Yup.string()
          .min(6, 'A senha deve ter pelo menos 6 caracteres')
          // .matches(
          //   /^.*(?=.{8,})(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!*@#$%^&+=]).*$/,
          //   'A senha deve ter pelo menos 8 caracteres, contendo pelo menos uma letra maiúscula, uma minúscula, um número e um caractere especial',
          // )
          .required('Digite sua senha'),
        senhaConfirm: Yup.string()
          .oneOf([Yup.ref('senha'), null], 'As senhas não coincidem')
          .required('Digite a confirmação da senha'),
      });

      await schema.validate(data, {
        abortEarly: false,
      });

      await cadastro({
        nome: data.nome,
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
        <h1>Cadastre-se no SocketChat!</h1>
        <p>Faça seu cadastro para acessar o chat!</p>

        <InputText name="nome" placeholder="Nome" className={styles.input} />
        <InputText name="email" placeholder="E-mail" className={styles.input} />

        <hr />

        <InputText
          name="senha"
          type="password"
          placeholder="Senha"
          className={styles.input}
        />
        <InputText
          name="senhaConfirm"
          type="password"
          placeholder="Confirmar senha"
          className={styles.input}
        />
        <button
          type="submit"
          className={commonStyles.primaryButton}
          disabled={isLoading}
        >
          {isLoading ? <LoadingSpinner /> : 'Cadastrar'}
        </button>

        <span>
          Já é cadastrado? <Link href="/login">Faça login!</Link>
        </span>
      </Form>
    </div>
  );
};
