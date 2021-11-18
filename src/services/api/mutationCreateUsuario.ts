import { api } from '.';
import { ApiError } from './apiError';

interface Usuario {
  nome: string;
  email: string;
  senha: string;
}

interface Response {
  idUsuario: number;
}

export async function mutationCreateUsuario(
  usuario: Usuario,
): Promise<Response> {
  try {
    const { data } = await api.post<Response>(`/usuarios`, usuario);
    return data;
  } catch (error) {
    throw new ApiError(error);
  }
}
