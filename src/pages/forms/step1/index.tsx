import Link from 'next/link';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useForm, FormAction } from '../../../contexts/FormContext';
import { api } from '../../../services/api-cep';

import styles from './styles.module.scss';

export default function Step1() {
  const { state, dispatch } = useForm();
  const loading = useRef(null);
  const numero = useRef(null);

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
    dispatch({
      type: FormAction[e.target.name],
      payload: e.target.value,
    });

    loading.current.style.display = 'block';

    setTimeout(async () => {
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
        type: FormAction.setUF,
        payload: result.uf,
      });

      dispatch({
        type: FormAction.setDistrict,
        payload: result.bairro,
      });

      numero.current.focus();
      loading.current.style.display = 'none';
    }, 2000);
  }

  return (
    <div className={styles.container}>
      <h1>Step1 {state.currentStep}</h1>

      <label htmlFor="">
        <input
          type="text"
          placeholder="name"
          name="setName"
          onChange={handleChange}
          value={state.name}
        />
      </label>

      <label htmlFor="">
        <input
          type="email"
          placeholder="Email"
          name="setEmail"
          onChange={handleChange}
          value={state.email}
        />
      </label>

      <label htmlFor="">
        <input
          type="text"
          placeholder="Phone"
          name="setPhone"
          onChange={handleChange}
          value={state.phone}
        />
      </label>

      <label htmlFor="">
        <input
          type="text"
          placeholder="Cep"
          name="setCep"
          onChange={handleChange}
          value={state.cep}
          onBlur={checkCep}
        />
      </label>

      <label htmlFor="">
        <input
          type="text"
          placeholder="Rua"
          name="setStreet"
          onChange={handleChange}
          value={state.street}
        />
      </label>

      <label htmlFor="">
        <input
          type="text"
          placeholder="Number"
          name="setNumber"
          onChange={handleChange}
          value={state.number}
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
        />
      </label>

      <label htmlFor="">
        <input
          type="text"
          placeholder="UF"
          name="setUF"
          onChange={handleChange}
          value={state.uf}
        />
      </label>

      <label htmlFor="">
        <input
          type="text"
          placeholder="Bairro"
          name="setDistrict"
          onChange={handleChange}
          value={state.district}
        />
      </label>

      <div ref={loading} className={styles.loading}>
        <h1>Carregando</h1>
      </div>

      <Link href="/forms/step2">Continuar</Link>
    </div>
  );
}
