import Link from 'next/link';
import { useRouter } from 'next/router';
import { ChangeEvent, MouseEvent, useEffect, useState } from 'react';
import { useForm, FormAction } from '../../../contexts/FormContext';
import toast from 'react-hot-toast';
import validation from '../../../utils/Validation';

import { api } from '../../../services/api-donation';
import { responseMessage } from '../../../utils/Messages';
import { ImSpinner8 } from 'react-icons/im';

import styles from './styles.module.scss';
import { institutions } from '../../../database/institution';

export default function Step3() {
  const history = useRouter();
  const { state, dispatch } = useForm();
  const [loading, setLoading] = useState(false);
  const [institutionId, setInstitutionId] = useState(0);

  useEffect(() => {
    /* if (validation(state) == false) {
      history.push('/');
    } */

    dispatch({
      type: FormAction.setDeviceCount,
      payload: state.devices.length,
    });

    dispatch({
      type: FormAction.setCurrentStep,
      payload: 3,
    });

    console.log(state);
  }, []);

  const handleSubmit = async (e: MouseEvent<HTMLElement>) => {
    e.preventDefault();

    const [institution] = institutions.filter(
      institution => institution.id === institutionId,
    );

    if (!institution) return toast.error('Selecione a instituição');

    const response = {
      name: state.name.trim(),
      email: state.email.trim(),
      phone: state.phone.trim(),
      zip: state.zip,
      city: state.city.trim(),
      state: state.state.trim(),
      streetAddress: state.streetAddress.trim(),
      number: parseInt(state.number),
      complement: state.complement.trim(),
      neighborhood: state.neighborhood.trim(),
      deviceCount: state.deviceCount,
      devices: state.devices,
    };

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 2000);

    console.log(response);

    const completed = await api
      .post('/donation', response)
      .then(res => {
        console.log(res);
        toast.success(responseMessage[String(res.status)]);
        return true;
      })
      .catch(error => {
        console.log(error);
        if (error.response.data?.error) {
          toast.error(error.response.data.errorMessage);
        } else {
          toast.error(responseMessage['500']);
        }

        return false;
      });

    if (completed) {
      //return setTimeout(() => window.location.reload(), 3500);
    }

    return;
  };

  const handleServiceChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setInstitutionId(parseInt(value));
  };

  return (
    <div className={styles.container}>
      <h1>Última Etapa</h1>
      <p className="current-step">Passo {state.currentStep}/3</p>

      <form action="" className="form-group">
        <label htmlFor="company">
          Instituições
          <select
            name="company"
            value={institutionId}
            onChange={e => handleServiceChange(e)}
          >
            <option>Selecione...</option>
            {institutions.map(institution => (
              <option value={institution.id} key={institution.id}>
                {institution.name}
              </option>
            ))}
          </select>
        </label>
      </form>

      {institutions.map(
        company =>
          company.id === institutionId && (
            <div key={company.id} className={styles.company_wrapper}>
              <div className="separator">
                <div></div>
                <div>Institição</div>
                <div></div>
              </div>
              <h1>Nome: {company.name}</h1>
              <div className={styles.address}>
                Cidade: <span>{company.city}</span>
                Bairro: <span>{company.district}</span>
              </div>
              <p>Descrição: {company.description}</p>

              <div className={styles.social}>
                <span>Redes Sociais: </span>
                {company.social.map(({ url, name }, index) => (
                  <a
                    href={url}
                    key={index}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {name}
                  </a>
                ))}
              </div>
            </div>
          ),
      )}

      <div className="btn-group">
        <div className="btn-prev">
          <Link href="/forms/step2">Voltar</Link>
        </div>
        <div>
          <button className={styles.submit} onClick={handleSubmit}>
            {loading ? <ImSpinner8 /> : 'Concluir'}
          </button>
        </div>
      </div>
    </div>
  );
}
