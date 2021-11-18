import React from 'react';

import { ToastProvider } from './toast';
import { LoginProvider } from './login';
import { ChatProvider } from './chat';

const ContextProviders: React.FC = ({ children }) => (
  <ToastProvider>
    <LoginProvider>
      <ChatProvider>{children}</ChatProvider>
    </LoginProvider>
  </ToastProvider>
);

export default ContextProviders;
export { useToast } from './toast';
export { useLogin } from './login';
export { useChat } from './chat';
