import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { useLogin } from '..';

export interface IParticipante {
  id: number;
  nome: string;
}

export interface IMensagem {
  id: number;
  conteudo: string;
  dataEnvio: string;
  idRemetente: number;
}

export interface IConversa {
  id: number;
  nome: string;
  participantes: IParticipante[];
  mensagens: IMensagem[];
  possuiNotificacao: boolean;
}

interface IChatContext {
  conversas: IConversa[];
  conversasBusca: IConversa[] | null;
  conversasLoading: boolean;

  buscarConversa(busca: string): void;
  buscarReset(): void;

  conversaSelecionada?: IConversa;
  conversaSelecionadaLoading: boolean;

  iniciarConversa(idParticipante: number, mensagem: string): void;
  selecionarConversa(conversa: IConversa): void;
  enviarMensagem(mensagem: string): void;
  getMensagens(idConversa: number, idMensagemMaisAntiga: number): void;
}

const ChatContext = createContext<IChatContext>({} as IChatContext);

enum wsAction {
  AUTH = 1,
  BUSCAR = 2,
  NOVA_CONVERSA = 3,
  NOVA_MENSAGEM = 4,
  GET_MENSAGENS = 5,
}

interface wsResponse {
  action: wsAction;
  data: any;
}

export const ChatProvider: React.FC = ({ children }) => {
  const [conversas, setConversas] = useState<IConversa[]>([]);
  const [conversasLoading, setConversasLoading] = useState(false);
  const [conversasBusca, setConversasBusca] = useState<IConversa[] | null>(
    null,
  );

  const [conversaSelecionada, setConversaSelecionada] = useState<IConversa>();
  const [conversaSelecionadaLoading, setConversaSelecionadaLoading] =
    useState(false);

  const { isSigned, token, usuario } = useLogin();
  const isBrowser = useMemo(() => typeof window !== 'undefined', []);
  const [ws, setWS] = useState<WebSocket>();

  useEffect(() => {
    setConversasLoading(true);
  }, []);

  useEffect(() => {
    if (isBrowser && isSigned) {
      setWS(new WebSocket(`${process.env.NEXT_PUBLIC_WEBSOCKETS_URL}/chat`));
    }
  }, [isBrowser, isSigned]);

  useEffect(() => {
    if (ws && !isSigned) ws.close();
  }, [ws, isSigned]);

  useEffect(() => {
    if (!!conversaSelecionada && conversaSelecionada.possuiNotificacao) {
      const conversa = JSON.parse(
        JSON.stringify(conversas.find(c => c.id === conversaSelecionada.id)),
      );

      conversa.possuiNotificacao = false;
      const indexConversa = conversas.findIndex(c => c.id === conversa.id);
      const novasConversas = [...conversas];
      novasConversas.splice(indexConversa, 1, conversa);

      setConversas(novasConversas);
    }
  }, [conversas, conversaSelecionada]);

  const handleAuth = useCallback((message: wsResponse) => {
    setConversas(message.data);
    setConversasLoading(false);
  }, []);

  const handleBuscar = useCallback((message: wsResponse) => {
    setConversasLoading(false);
    setConversasBusca(message.data);
  }, []);

  const handleNovaConversa = useCallback(
    (message: wsResponse) => {
      const novaConversa: IConversa = message.data;
      novaConversa.possuiNotificacao = true;

      novaConversa.nome =
        message.data.nome ||
        message.data.participantes
          .filter((p: IParticipante) => p.id !== usuario?.id)
          .map((p: IParticipante) => p.nome)
          .join(', ');

      if (conversasBusca) {
        const indexConversaBusca = conversasBusca?.findIndex(
          c =>
            c?.participantes.length === novaConversa.participantes.length &&
            c?.participantes.every(p1 =>
              novaConversa.participantes.some(p2 => p1.id === p2.id),
            ),
        );

        if (indexConversaBusca >= 0) {
          const novasConversasBusca = [...conversasBusca];
          novasConversasBusca.splice(indexConversaBusca, 1);
          novasConversasBusca.unshift(novaConversa);
          setConversasBusca(novasConversasBusca);
        }
      }

      if (
        conversaSelecionada?.participantes.length ===
          novaConversa.participantes.length &&
        conversaSelecionada?.participantes.every(p1 =>
          novaConversa.participantes.some(p2 => p1.id === p2.id),
        )
      ) {
        novaConversa.possuiNotificacao = false;
        setConversaSelecionada(novaConversa);
      }

      const novasConversas = [...conversas];
      novasConversas.unshift(novaConversa);
      setConversas(novasConversas);
    },
    [conversas, conversaSelecionada, conversasBusca, usuario],
  );

  const handleNovaMensagem = useCallback(
    (message: wsResponse) => {
      if (!conversas.find(c => c.id === message.data.id)) {
        handleNovaConversa(message);
        return;
      }

      const conversa = JSON.parse(
        JSON.stringify(conversas.find(c => c.id === message.data.id)),
      );

      conversa.possuiNotificacao = true;
      conversa.mensagens = message.data.mensagens.concat(conversa.mensagens);

      const novasConversas = [...conversas].filter(
        c => c.id !== message.data.id,
      );

      novasConversas.unshift(conversa);

      if (conversaSelecionada?.id === message.data.id) {
        conversa.possuiNotificacao = false;
        setConversaSelecionada(conversa);
      }

      setConversas(novasConversas);
    },
    [conversas, conversaSelecionada, handleNovaConversa],
  );

  const handleGetMensagens = useCallback(
    (message: wsResponse) => {
      const conversa = JSON.parse(
        JSON.stringify(conversas.find(c => c.id === message.data.idConversa)),
      );

      if (!conversa || !message.data.mensagens?.length) {
        setConversaSelecionadaLoading(false);
        return;
      }

      message.data.mensagens.map((m: IMensagem) => conversa.mensagens.push(m));
      const indexConversa = conversas.findIndex(c => c.id === conversa.id);

      const novasConversas = [...conversas];
      novasConversas.splice(indexConversa, 1, conversa);

      if (conversaSelecionada?.id === conversa.id)
        setConversaSelecionada(conversa);

      setConversas(novasConversas);
      setConversaSelecionadaLoading(false);
    },
    [conversas, conversaSelecionada],
  );

  useEffect(() => {
    if (ws) {
      ws.onopen = () =>
        ws.send(JSON.stringify({ action: wsAction.AUTH, token }));

      ws.onmessage = e => {
        try {
          const message: wsResponse = JSON.parse(e.data);

          if (!message.action) throw new Error('Action inválida');

          switch (message?.action) {
            case wsAction.AUTH:
              handleAuth(message);
              break;

            case wsAction.BUSCAR:
              handleBuscar(message);
              break;

            case wsAction.NOVA_MENSAGEM:
              handleNovaMensagem(message);
              break;

            case wsAction.GET_MENSAGENS:
              handleGetMensagens(message);
              break;

            default:
              throw new Error('Action não identificada');
          }
        } catch (error: any) {
          console.warn(
            'Mensagem em formato inválido | ',
            error.message,
            ' | ',
            e.data,
          );
        }
      };
    }
  }, [
    ws,
    token,
    handleAuth,
    handleBuscar,
    handleNovaMensagem,
    handleGetMensagens,
  ]);

  const buscarConversa = useCallback(
    (busca: string) => {
      if (ws) {
        ws.send(JSON.stringify({ action: wsAction.BUSCAR, busca }));
        setConversasLoading(true);
      }
    },
    [ws],
  );

  const buscarReset = useCallback(() => {
    setConversasBusca(null);
  }, []);

  const iniciarConversa = useCallback(
    (idParticipante: number, mensagem: string) => {
      if (ws) {
        ws.send(
          JSON.stringify({
            action: wsAction.NOVA_CONVERSA,
            idParticipante,
            mensagem,
          }),
        );
      }
    },
    [ws],
  );

  const selecionarConversa = useCallback(
    (conversa: IConversa) => {
      if (conversa.id) {
        const conv = conversas.find(c => c.id === conversa.id);
        setConversaSelecionada(conv);
      } else {
        setConversaSelecionada(conversa);
      }
    },
    [conversas],
  );

  const enviarMensagem = useCallback(
    (mensagem: string) => {
      if (ws) {
        if (conversaSelecionada?.id) {
          ws.send(
            JSON.stringify({
              action: wsAction.NOVA_MENSAGEM,
              mensagem,
              idConversa: conversaSelecionada.id,
            }),
          );
        } else {
          ws.send(
            JSON.stringify({
              action: wsAction.NOVA_CONVERSA,
              mensagem,
              idParticipantes: conversaSelecionada?.participantes.map(
                p => p.id,
              ),
            }),
          );
        }
      }
    },
    [ws, conversaSelecionada],
  );

  const getMensagens = useCallback(
    (idConversa: number, idMensagemMaisAntiga: number) => {
      if (ws) {
        setConversaSelecionadaLoading(true);
        ws.send(
          JSON.stringify({
            action: wsAction.GET_MENSAGENS,
            idConversa,
            idMensagemMaisAntiga,
          }),
        );
      }
    },
    [ws],
  );

  return (
    <ChatContext.Provider
      value={{
        conversas,
        conversasBusca,
        conversasLoading,
        conversaSelecionada,
        conversaSelecionadaLoading,
        buscarConversa,
        buscarReset,
        enviarMensagem,
        selecionarConversa,
        iniciarConversa,
        getMensagens,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export function useChat(): IChatContext {
  const context = useContext(ChatContext);

  if (!context)
    throw new Error('useChat can only be used within an ChatProvider');

  return context;
}
