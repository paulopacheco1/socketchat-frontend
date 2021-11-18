import React from 'react';

import { useChat } from '../../../../contexts';
import { LoadingSpinner } from '../../../LoadingSpinner';

import { Conversa } from './Conversa';
import { AsideHero } from './Hero';

import styles from './styles.module.scss';

export const Conversas: React.FC = () => {
  const { conversas, conversasBusca, conversasLoading } = useChat();

  return (
    <div className={styles.container}>
      {conversasLoading ? (
        <div className={styles.loading}>
          <LoadingSpinner />
        </div>
      ) : (
        <>
          {conversasBusca !== null ? (
            <>
              {conversasBusca.length > 0 ? (
                <div className={styles.conversas}>
                  {conversasBusca.map(conversa => (
                    <Conversa
                      key={conversa.id || Math.random()}
                      conversa={conversa}
                    />
                  ))}
                </div>
              ) : (
                <AsideHero />
              )}
            </>
          ) : (
            <>
              {conversas.length > 0 ? (
                <div className={styles.conversas}>
                  {conversas.map(conversa => (
                    <Conversa
                      key={conversa.id || Math.random()}
                      conversa={conversa}
                    />
                  ))}
                </div>
              ) : (
                <AsideHero />
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};
