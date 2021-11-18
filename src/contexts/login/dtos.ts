export interface DadosLogin {
  email: string;
  senha: string;
}

export interface DadosCadastro {
  nome: string;
  email: string;
  senha: string;
}

export interface Sessao {
  token: string;
  usuario: Usuario;
}

export interface Usuario {
  id: number;
  nome: string;
  email: string;
}
