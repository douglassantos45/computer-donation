import Link from 'next/link';
import { useRouter } from 'next/router';
import { ChangeEvent, useEffect, useRef, useState } from 'react';

import { useForm, FormAction } from '../../../contexts/FormContext';
import { api } from '../../../services/api-cep';

import styles from './styles.module.scss';

export default function Step1() {
  const { state, dispatch } = useForm();
  const loading = useRef(null);
  const numero = useRef(null);
  const history = useRouter();

  const devices = [
    { value: 'notebook', name: 'Notebook' },
    { value: 'desktop', name: 'Desktop' },
    { value: 'netBook', name: 'NetBook' },
    { value: 'screen', name: 'Monitor' },
    { value: 'printer', name: 'Impressora' },
    { value: 'scanner', name: 'Scanner' },
  ];

  useEffect(() => {
    dispatch({
      type: FormAction.setCurrentStep,
      payload: 1,
    });
  }, []);

  //Capturando dados do inputs
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    dispatch({
      type: FormAction[e.target.name],
      payload: e.target.value,
    });
  }

  async function checkCep(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.value !== '') {
      dispatch({
        type: FormAction[e.target.name],
        payload: e.target.value,
      });

      loading.current.style.display = 'flex';

      setTimeout(async () => {
        loading.current.style.display = 'none';
      }, 2000);

      const cep = e.target.value.replace(/\D/g, '');
      const result = await api.get(`${cep}/json/`).then(res => res.data);

      dispatch({
        type: FormAction.setCity,
        payload: result.localidade,
      });

      dispatch({
        type: FormAction.setStreet,
        payload: result.logradouro,
      });

      dispatch({
        type: FormAction.setState,
        payload: result.uf,
      });

      numero.current.focus();
    }
  }

  function handleNextForm(e) {
    e.preventDefault();
    history.push('/forms/step2');
  }

  function handleChangeSelect(value: string) {}

  return (
    <div className={styles.container}>
      <h1>Primeira Etapa</h1>
      <p>Passo {state.currentStep}/2</p>

      <form>
        <div className={styles.form_group}>
          <label htmlFor="">
            <input
              type="text"
              placeholder="name"
              name="setName"
              onChange={handleChange}
              value={state.name}
              required
            />
          </label>

          <div className={styles.input_group}>
            <label htmlFor="">
              <input
                type="email"
                placeholder="Email"
                name="setEmail"
                onChange={handleChange}
                value={state.email}
                required
              />
            </label>

            <label htmlFor="">
              <input
                type="text"
                placeholder="Phone"
                name="setPhone"
                onChange={handleChange}
                value={state.phone}
                required
              />
            </label>
          </div>

          <div className={styles.input_group}>
            <label htmlFor="">
              <input
                type="text"
                placeholder="Cep"
                name="setZip"
                onChange={handleChange}
                value={state.zip}
                required
                onBlur={checkCep}
              />
            </label>

            <label htmlFor="">
              <input
                type="text"
                placeholder="Rua"
                name="setStreet"
                onChange={handleChange}
                value={state.streetAddress}
                required
              />
            </label>

            <label htmlFor="" className={styles.sm}>
              <input
                type="text"
                placeholder="UF"
                name="setState"
                onChange={handleChange}
                value={state.state}
                required
              />
            </label>
          </div>

          <div className={styles.input_group}>
            <label htmlFor="" className={styles.sm}>
              <input
                type="text"
                placeholder="Number"
                name="setNumber"
                onChange={handleChange}
                value={state.number}
                required
                ref={numero}
              />
            </label>

            <label htmlFor="">
              <input
                type="text"
                placeholder="Cidade"
                name="setCity"
                onChange={handleChange}
                value={state.city}
                required
              />
            </label>
          </div>

          <div className={styles.input_group}>
            <label htmlFor="">
              <input
                type="text"
                placeholder="Complemento"
                name="setComplement"
                onChange={handleChange}
                value={state.complement}
                required
              />
            </label>

            <label htmlFor="">
              <input
                type="text"
                placeholder="Vizinhança"
                name="setNeighborhood"
                onChange={handleChange}
                value={state.neighborhood}
                required
              />
            </label>

            <label htmlFor="" className={styles.sm}>
              <input
                type="Number"
                name="setDeviceCount"
                onChange={handleChange}
                value={state.deviceCount}
                required
              />
            </label>
          </div>
        </div>
        <button onClick={handleNextForm} type="button">
          Continuar
        </button>
      </form>

      <div ref={loading} className={styles.loading}>
        <p>Carregando...</p>
      </div>
    </div>
  );
}
