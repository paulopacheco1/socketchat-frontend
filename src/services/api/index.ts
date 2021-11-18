import axios from 'axios';

// import { queryGetSessao } from './queryGetSessao';
// import { queryGetUsuario } from './queryGetUsuario';

import { queryRecuperarSessao } from './queryRecuperarSessao';
import { mutationCreateSessao } from './mutationCreateSessao';
import { mutationCreateUsuario } from './mutationCreateUsuario';

export const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api`,
});

const auth = (token: string): void => {
  api.defaults.headers.common.Authorization = `Bearer ${token}`;
};

export { ApiError, useApiErrorHandler } from './apiError';

export default {
  auth,
  // queryGetSessao,
  // queryGetUsuario,
  queryRecuperarSessao,
  mutationCreateSessao,
  mutationCreateUsuario,
};
