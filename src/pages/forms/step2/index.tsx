import Link from 'next/link';
import { MouseEvent, useEffect, useState } from 'react';
import { useForm, FormAction } from '../../../contexts/FormContext';
import toast from 'react-hot-toast';
import { api } from '../../../services/api-donation';

import styles from './styles.module.scss';
import { responseMessage } from '../../../utils/Messages';

export default function Step2() {
  const { state, dispatch } = useForm();
  const device = [];
  const condition = [];
  const devices = [];

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
    dispatch({
      type: FormAction.setCurrentStep,
      payload: 2,
    });
  }, []);

  function handleSubmit(e: MouseEvent<HTMLElement>) {
    e.preventDefault();

    const deviceSelected = {
      type: 'device',
      condition: 'condition',
    };

    devices.push(deviceSelected);

    dispatch({
      type: FormAction.setDevices,
      payload: devices,
    });

    delete state.currentStep;

    api
      .post('/donation', state)
      .then(res => {
        toast.success(responseMessage[String(res.status)]);
      })
      .catch(error => {
        console.log(error);
        if (error.response.data?.error) {
          return toast.error(error.response.data.errorMessage);
        }
        toast.error(responseMessage['500']);
      });
  }

  function handleChangeSelect(key: string, value: string) {
    if (key === 'setDevice') {
      device.push(value);
    } else if (key === 'setCondition') {
      condition.push(value);
    }
  }

  return (
    <div className={styles.container}>
      <h1>Segunda Etapa</h1>
      <p>Passo {state.currentStep}/2</p>

      <div className={styles.form_group}>
        {/* <label htmlFor="devices">
          <select
            name="devices"
            id="devices"
            onChange={e => handleChangeSelect('setDevice', e.target.value)}
          >
            <option>Equipamentos</option>
            {equipments.map(({ value, name }) => (
              <option value={value} key={value}>
                {name}
              </option>
            ))}
          </select>
        </label> */}

        {state.deviceCount > 0 &&
          Array.from({ length: state.deviceCount }, (_, key) => (
            <div className={styles.input_group} key={key}>
              <label htmlFor="devices">
                <select
                  name="devices"
                  id="devices"
                  onChange={e =>
                    handleChangeSelect('setDevice', e.target.value)
                  }
                >
                  <option>Selecione</option>
                  {equipments.map(({ value, name }) => (
                    <option value={value} key={value}>
                      {name}
                    </option>
                  ))}
                </select>
              </label>

              <label htmlFor="condition">
                <select
                  name="condition"
                  id="condition"
                  onChange={e =>
                    handleChangeSelect('setCondition', e.target.value)
                  }
                >
                  <option>Condição</option>
                  {states.map(({ value, name }) => (
                    <option value={value} key={value}>
                      {name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          ))}
      </div>

      <div className={styles.btn_group}>
        <div className={styles.prev}>
          <Link href="/">Voltar</Link>
        </div>
        <button className={styles.submit} type="submit" onClick={handleSubmit}>
          Concluir
        </button>
      </div>
    </div>
  );
}
