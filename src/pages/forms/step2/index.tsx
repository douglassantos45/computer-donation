import Link from 'next/link';
import { useEffect } from 'react';
import { useForm, FormAction } from '../../../contexts/FormContext';

import styles from './styles.module.scss';

export default function Step2() {
  const { state, dispatch } = useForm();

  useEffect(() => {
    dispatch({
      type: FormAction.setCurrentStep,
      payload: 2,
    });
  }, []);

  return (
    <div>
      <h1 className={styles.container}>Step2 {state.currentStep}</h1>
      <Link href="/">Voltar</Link>
    </div>
  );
}
