import ApiLoading from '../components/ApiInformation';
import { api } from '../services/api-donation';

export default function Home({ alive }) {
  return <ApiLoading alive={alive} />;
}

export const getServerSideProps = async () => {
  const alive = await api.get('/').then(({ data }) => data.alive);
  return { props: { alive } };
};
