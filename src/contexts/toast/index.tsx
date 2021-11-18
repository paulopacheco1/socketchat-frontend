import React, { createContext, useCallback, useContext, useState } from 'react';

import { v4 as uuid } from 'uuid';

import { IToast } from '../../components/Toast';
import { ToastContainer } from '../../components/Toast/Container';

interface IToastContext {
  addToast(toast: Omit<IToast, 'id'>): void;
  removeToast(id: string): void;
}

const ToastContext = createContext<IToastContext>({} as IToastContext);

export const ToastProvider: React.FC = ({ children }) => {
  const [toasts, setToasts] = useState<IToast[]>([]);

  const addToast = useCallback((toastProps: Omit<IToast, 'id'>) => {
    const id = uuid();

    const toast = {
      ...toastProps,
      id,
    };

    setToasts(oldToasts => [...oldToasts, toast]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(oldToasts => oldToasts.filter(toast => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} />
    </ToastContext.Provider>
  );
};

export function useToast(): IToastContext {
  const context = useContext(ToastContext);

  if (!context)
    throw new Error('useToast can only be used within an ToastProvider');

  return context;
}
