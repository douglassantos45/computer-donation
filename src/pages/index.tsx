import { GetServerSideProps } from 'next';
import { ApiInformation } from '../components/ApiInformation';
import { api } from '../services/api-donation';

type Props = {
  alive: boolean;
};

export default function Home({ alive }: Props) {
  return <ApiInformation alive={alive} />;
}

export const getServerSideProps: GetServerSideProps = async () => {
  const { data } = await api.get('/');
  const { alive } = data;
  return { props: { alive } };
};
