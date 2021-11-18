import { api } from '.';
import { ApiError } from './apiError';

import { Usuario } from '../../contexts/login';

export async function queryRecuperarSessao(): Promise<Usuario> {
  try {
    const { data } = await api.get<Usuario>(`/usuarios/me`);
    return data;
  } catch (error) {
    throw new ApiError(error);
  }
}
