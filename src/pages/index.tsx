import type { NextPage } from 'next';
import Head from 'next/head';

import { WithSSRAuth } from '../utils/WithSSRAuth';

import { HomeAside } from '../components/Home/HomeAside';
import { HomeChat } from '../components/Home/HomeChat';

import styles from '../styles/home.module.scss';
import commonStyles from '../styles/common.module.scss';

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>SocketChat!</title>
        <meta name="description" content="SocketChat App!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={`${styles.container} ${commonStyles.pageContainer}`}>
        <div className={`${styles.content}`}>
          <HomeAside />
          <HomeChat />
        </div>
      </main>
    </>
  );
};

export default Home;

export const getServerSideProps = WithSSRAuth(async () => {
  return {
    props: {},
  };
});
