import React from 'react';
import { FiLogOut } from 'react-icons/fi';

import { useLogin } from '../../../../contexts';

import styles from './styles.module.scss';

export const Usuario: React.FC = () => {
  const { usuario, logout } = useLogin();

  return (
    <div className={styles.container}>
      <h2>{usuario?.nome}</h2>

      <button type="button" onClick={logout} title="Sair">
        <FiLogOut size={15} color="#fff" />
      </button>
    </div>
  );
};
