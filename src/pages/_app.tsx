import { Toaster } from 'react-hot-toast';
import '../../styles/global.scss';
import { Header } from '../components/Header';
import { FormProvider } from '../contexts/FormContext';

function MyApp({ Component, pageProps }) {
  return (
    <FormProvider>
      <Toaster
        toastOptions={{
          style: {
            fontSize: '13px',
          },
        }}
      />
      <Header />
      <div className="container">
        <Component {...pageProps} />
      </div>
    </FormProvider>
  );
}

export default MyApp;
