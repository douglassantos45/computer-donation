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

export default function Step3() {
  const history = useRouter();
  const { state, dispatch } = useForm();
  const [loading, setLoading] = useState(false);
  const [companyId, setCompanyId] = useState(0);

  const companys = [
    {
      id: 1,
      name: 'Company(1)',
      city: 'City(1)',
      bairro: 'Bairro(1)',
      description: 'Description(1)',
      social: [
        {
          name: 'Instagram',
          url: 'instagram.com',
        },
        {
          name: 'Facebook',
          url: 'facebook.com',
        },
      ],
    },
    {
      id: 2,
      name: 'Company(2)',
      city: 'Company(2)',
      bairro: 'Bairro(2)',
      description: 'Description(2)',
      social: [
        {
          name: 'Instagram',
          url: 'instagram.com',
        },
        {
          name: 'Facebook',
          url: 'facebook.com',
        },
      ],
    },
    {
      id: 3,
      name: 'Company(3)',
      city: 'City(3)',
      bairro: 'Bairro(3)',
      description: 'Description(3)',
      social: [
        {
          name: 'Instagram',
          url: 'instagram.com',
        },
        {
          name: 'Facebook',
          url: 'facebook.com',
        },
      ],
    },
    {
      id: 4,
      name: 'Company(4)',
      city: 'City(4)',
      bairro: 'Bairro(4)',
      description: 'Description(4)',
      social: [
        {
          name: 'Instagram',
          url: 'instagram.com',
        },
        {
          name: 'Facebook',
          url: 'facebook.com',
        },
      ],
    },
    {
      id: 5,
      name: 'Company(5)',
      city: 'City(5)',
      bairro: 'Bairro(5)',
      description: 'Description(5)',
      social: [
        {
          name: 'Instagram',
          url: 'instagram.com',
        },
        {
          name: 'Facebook',
          url: 'facebook.com',
        },
      ],
    },
  ];

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
  }, []);

  const handleSalvar = (e: MouseEvent<HTMLElement>) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 2000);

    handleSubmit(e);
  };

  const handleSubmit = async (e: MouseEvent<HTMLElement>) => {
    e.preventDefault();

    const [company] = companys.filter(company => company.id === companyId);

    const response = {
      name: state.name,
      email: state.email,
      phone: state.phone,
      zip: state.zip,
      city: state.city,
      state: state.state,
      streetAddress: state.streetAddress,
      number: state.number,
      complement: state.complement,
      neighborhood: state.neighborhood,
      deviceCount: state.deviceCount,
      devices: state.devices,
    };

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
    setCompanyId(parseInt(value));
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
            value={companyId}
            onChange={e => handleServiceChange(e)}
          >
            <option>Selecione...</option>
            {companys.map(company => (
              <option value={company.id} key={company.id}>
                {company.name}
              </option>
            ))}
          </select>
        </label>
      </form>

      {companys.map(
        company =>
          company.id === companyId && (
            <div key={company.id} className={styles.company_wrapper}>
              <h1>Nome: {company.name}</h1>
              <div className={styles.address}>
                Cidade: <span>{company.city}</span>
                Bairro: <span>{company.bairro}</span>
              </div>
              <p>Descrição: {company.description}</p>

              <div className={styles.social}>
                <span>Redes Sociais: </span>
                {company.social.map(({ url, name }, index) => (
                  <a href={url} key={index} target="_blank">
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
          <button className={styles.submit} onClick={handleSalvar}>
            {loading ? <ImSpinner8 /> : 'Concluir'}
          </button>
        </div>
      </div>
    </div>
  );
}
