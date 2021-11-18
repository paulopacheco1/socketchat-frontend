import { NextPage } from 'next';
import Head from 'next/head';

import { LoginForm } from '../components/Forms/LoginForm';
import { WithSSRGuest } from '../utils/WithSSRGuest';

import styles from '../styles/common.module.scss';

const Login: NextPage = () => {
  return (
    <>
      <Head>
        <title>SocketChat | Login</title>
      </Head>

      <div className={styles.pageContainer}>
        <div className={styles.pageContent}>
          <LoginForm />
        </div>
      </div>
    </>
  );
};

export default Login;

export const getServerSideProps = WithSSRGuest(async () => {
  return {
    props: {},
  };
});
