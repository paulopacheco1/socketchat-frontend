import { api } from '.';
import { ApiError } from './apiError';

import { DadosLogin, Sessao } from '../../contexts/login';

export async function mutationCreateSessao(dados: DadosLogin): Promise<Sessao> {
  try {
    const { data } = await api.post<Sessao>(`/sessao`, dados);
    return data;
  } catch (error) {
    throw new ApiError(error);
  }
}
