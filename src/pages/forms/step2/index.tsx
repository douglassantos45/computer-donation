import Link from 'next/link';
import { useRouter } from 'next/router';
import { MouseEvent, useEffect, useState } from 'react';
import { useForm, FormAction } from '../../../contexts/FormContext';
import toast from 'react-hot-toast';
import { api } from '../../../services/api-donation';

import styles from './styles.module.scss';
import { responseMessage } from '../../../utils/Messages';
import validation from '../../../utils/Validation';

export default function Step2() {
  const { state, dispatch } = useForm();

  const [devices, setDevices] = useState([
    {
      type: '',
      condition: '',
    },
  ]);
  const [typeSelected, setTypeSelected] = useState('');
  const [conditionSelected, setConditionSelected] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const history = useRouter();

  const equipments = [
    { value: 'notebook', name: 'Notebook' },
    { value: 'desktop', name: 'Desktop' },
    { value: 'netBook', name: 'NetBook' },
    { value: 'screen', name: 'Monitor' },
    { value: 'printer', name: 'Impressora' },
    { value: 'scanner', name: 'Scanner' },
  ];

  const states = [
    {
      value: 'working',
      name: 'Tem todas as partes, liga e funciona normalmente',
    },
    { value: 'notWorking', name: 'Tem todas as partes, mas não liga mais' },
    {
      value: 'broken',
      name: ' Faltam peças, funciona só as vezes ou está quebrado',
    },
  ];

  useEffect(() => {
    if (validation(state) == false) {
      history.push('/');
    }

    dispatch({
      type: FormAction.setCurrentStep,
      payload: 2,
    });
  }, []);

  useEffect(() => {
    if (conditionSelected !== '') {
      setDevices([
        ...devices,
        { type: typeSelected, condition: conditionSelected },
      ]);
      setTypeSelected('');
      setConditionSelected('');
    }
  }, [typeSelected]);

  useEffect(() => {
    if (typeSelected !== '') {
      setDevices([
        ...devices,
        { type: typeSelected, condition: conditionSelected },
      ]);
      setTypeSelected('');
      setConditionSelected('');
    }
  }, [conditionSelected]);

  function handleSubmit(e: MouseEvent<HTMLElement>) {
    e.preventDefault();

    delete state.currentStep;

    api
      .post('/donation', state)
      .then(res => {
        toast.success(responseMessage[String(res.status)]);
      })
      .catch(error => {
        console.log(error);
        if (error.response.data?.error) {
          toast.error(error.response.data.errorMessage);
          setIsCompleted(true);
        } else {
          toast.error(responseMessage['500']);
        }
      });

    state.currentStep = 2;

    if (isCompleted == true) {
      setTimeout(() => window.location.reload(), 4000);
    }
  }

  function handleChangeDevice(e) {
    setTypeSelected(e.target.value);
  }

  function handleChangeCondition(e) {
    setConditionSelected(e.target.value);
  }

  function handleSalveDevices(e) {
    e.preventDefault();
    const deviceList = devices.filter(
      device => device.type && device.condition !== '',
    );

    if (deviceList.length <= 0) {
      return toast.error('Selecione os items');
    }

    const count = deviceList.length - state.deviceCount;

    if (deviceList.length > state.deviceCount) {
      deviceList.forEach(_ => {
        deviceList.shift();
        console.log(deviceList.length);
        if (count === deviceList.length) {
          return;
        }
      });
    }

    dispatch({
      type: FormAction.setDevices,
      payload: deviceList,
    });

    setIsCompleted(!isCompleted);
  }

  return (
    <div className={styles.container}>
      <h1>Segunda Etapa</h1>
      <p>Passo {state.currentStep}/2</p>

      <form className={styles.form_group}>
        {state.deviceCount > 0 &&
          Array.from({ length: state.deviceCount }, (_, key) => (
            <div className={styles.input_group} key={key}>
              <label htmlFor="devices">
                Equipamento* ({key + 1})
                <select
                  name="type"
                  id="devices"
                  onChange={e => handleChangeDevice(e)}
                >
                  <option>Selecione os equipamento(s)*</option>

                  {equipments.map(({ value, name }) => (
                    <option value={value} key={value}>
                      {name}
                    </option>
                  ))}
                </select>
              </label>

              <label htmlFor="condition">
                Selecione a condição* ({key + 1})
                <select
                  name="condition"
                  id="condition"
                  onChange={e => handleChangeCondition(e)}
                >
                  <option>Selecione a condição*</option>
                  {states.map(({ value, name }) => (
                    <option value={value} key={value}>
                      {name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          ))}
        <br />
        <button onClick={e => handleSalveDevices(e)} disabled={isCompleted}>
          Salvar
        </button>
      </form>

      <div className={styles.btn_group}>
        <div className={styles.prev}>
          <Link href="/">Voltar</Link>
        </div>
        <button
          className={styles.submit}
          onClick={handleSubmit}
          disabled={!isCompleted}
        >
          Concluir
        </button>
      </div>
    </div>
  );
}
