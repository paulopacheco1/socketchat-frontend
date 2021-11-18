import { NextPage } from 'next';
import Head from 'next/head';

import { WithSSRGuest } from '../utils/WithSSRGuest';
import { CadastroForm } from '../components/Forms/CadastroForm';

import styles from '../styles/common.module.scss';

const Cadastro: NextPage = () => {
  return (
    <>
      <Head>
        <title>SocketChat | Cadastro</title>
      </Head>

      <div className={styles.pageContainer}>
        <div className={styles.pageContent}>
          <CadastroForm />
        </div>
      </div>
    </>
  );
};

export default Cadastro;

export const getServerSideProps = WithSSRGuest(async () => {
  return {
    props: {},
  };
});
