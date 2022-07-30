import { Toaster } from 'react-hot-toast';
import '../../styles/global.scss';
import { FormProvider } from '../contexts/FormContext';

function MyApp({ Component, pageProps }) {
  return (
    <FormProvider>
      <div className="container">
        <Toaster />
        <Component {...pageProps} />
      </div>
    </FormProvider>
  );
}

export default MyApp;
