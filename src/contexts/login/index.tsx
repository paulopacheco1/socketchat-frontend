import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import Router from 'next/router';
import { destroyCookie, parseCookies, setCookie } from 'nookies';

import api, { ApiError, useApiErrorHandler } from '../../services/api';

import { DadosCadastro, DadosLogin, Usuario } from './dtos';

interface ILoginContext {
  cadastro(dadosCadastro: DadosCadastro): Promise<void>;
  login(dadosLogin: DadosLogin): Promise<void>;
  logout: () => void;
  isSigned: boolean;
  usuario?: Usuario;
  token?: string;
}

const LoginContext = createContext<ILoginContext>({} as ILoginContext);

export const LoginProvider: React.FC = ({ children }) => {
  const [usuario, setUsuario] = useState<Usuario>();
  const [token, setToken] = useState('');
  const isSigned = useMemo(() => !!usuario, [usuario]);

  const { handleException } = useApiErrorHandler();

  const login = useCallback(async (dadosLogin: DadosLogin) => {
    const sessao = await api.mutationCreateSessao(dadosLogin);

    setUsuario(sessao.usuario);
    setToken(sessao.token);

    setCookie(null, 'socketchat.token', sessao.token, {
      path: '/',
      secure: true,
    });
    api.auth(sessao.token);
    Router.push('/');
  }, []);

  const logout = useCallback(async () => {
    destroyCookie(null, 'socketchat.token', { path: '/' });
    await Router.push(`/login`);
    setUsuario(undefined);
  }, []);

  const cadastro = useCallback(
    async (dadosCadastro: DadosCadastro) => {
      await api.mutationCreateUsuario(dadosCadastro);
      await login({ email: dadosCadastro.email, senha: dadosCadastro.senha });
    },
    [login],
  );

  useEffect(() => {
    const recuperarSessao = async () => {
      try {
        const { 'socketchat.token': tk } = parseCookies();
        if (!tk) return;

        api.auth(tk);

        const user = await api.queryRecuperarSessao();
        setUsuario(user);
        setToken(tk);
      } catch (error) {
        if (error instanceof ApiError) handleException(error);
        logout();
      }
    };

    recuperarSessao();
  }, [logout, handleException]);

  return (
    <LoginContext.Provider
      value={{ cadastro, login, logout, isSigned, usuario, token }}
    >
      {children}
    </LoginContext.Provider>
  );
};

export function useLogin(): ILoginContext {
  const context = useContext(LoginContext);

  if (!context)
    throw new Error('useLogin can only be used within a LoginProvider');

  return context;
}

export type { DadosLogin, Sessao, Usuario } from './dtos';
