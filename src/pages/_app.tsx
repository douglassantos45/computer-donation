import '../../styles/global.scss';
import { FormProvider } from '../contexts/FormContext';

function MyApp({ Component, pageProps }) {
  return (
    <FormProvider>
      <div className="container">
        <header>Test</header>
        <Component {...pageProps} />
      </div>
    </FormProvider>
  );
}

export default MyApp;
