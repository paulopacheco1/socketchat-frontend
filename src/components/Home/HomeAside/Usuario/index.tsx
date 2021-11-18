import React from 'react';

import { useLogin } from '../../../../contexts';

import styles from './styles.module.scss';

export const Usuario: React.FC = () => {
  const { usuario, logout } = useLogin();

  return (
    <div className={styles.container}>
      <h2>{usuario?.nome}</h2>

      <button type="button" onClick={logout}>
        Sair
      </button>
    </div>
  );
};
