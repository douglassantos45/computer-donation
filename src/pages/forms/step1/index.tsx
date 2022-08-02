import { useRouter } from 'next/router';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useForm, FormAction } from '../../../contexts/FormContext';
import { api } from '../../../services/api-cep';
import validation from '../../../utils/Validation';
import validator from 'validator';

import styles from './styles.module.scss';

export default function Step1() {
  const { state, dispatch } = useForm();
  const loading = useRef(null);
  const numero = useRef(null);
  const history = useRouter();
  const [emailError, setEmailError] = useState('');

  useEffect(() => {
    dispatch({
      type: FormAction.setCurrentStep,
      payload: 1,
    });
  }, []);

  const validateEmail = email => {
    if (!validator.isEmail(email)) {
      setEmailError('Digite um email válido!');
      return false;
    }
    setEmailError('Email válido!');
    return true;
  };

  //Capturando dados do inputs
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.name == 'setEmail') {
      validateEmail(e.target.value);
    }
    if (e.target.name == 'setPhone') {
      const phone = e.target.value
        .replaceAll('(', '')
        .replaceAll(')', '')
        .replaceAll('-', '')
        .replaceAll('.', '')
        .replaceAll(' ', '');
      dispatch({
        type: FormAction.setPhone,
        payload: phone,
      });
      return;
    }

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

    if (state.email !== '' && validateEmail(state.email) === false) {
      return toast.error('Email inválido');
    }

    if (validation(state) !== false) {
      return history.push('/forms/step2');
    }

    toast.error('Alguns campos não foram digitados');
  }

  return (
    <div className={styles.container}>
      <h1>Primeira Etapa</h1>
      <p>Passo {state.currentStep}/2</p>

      <form className="form-group">
        <div className="input-group">
          <label htmlFor="">
            Nome completo*
            <input
              className="input-invalid"
              type="text"
              placeholder="Digite seu nome"
              name="setName"
              onChange={handleChange}
              value={state.name}
            />
          </label>
        </div>

        <div className="input-group">
          <label htmlFor="">
            E-mail
            <input
              type="email"
              placeholder="ex: email@gmail.com"
              name="setEmail"
              onChange={handleChange}
              value={state.email}
            />
            <span>{emailError}</span>
          </label>
          <label htmlFor="">
            Telefone*
            <input
              type="text"
              placeholder="ex: 55749003452"
              name="setPhone"
              onChange={handleChange}
              value={state.phone}
            />
          </label>
        </div>

        <div className="input-group">
          <label htmlFor="">
            Cep*
            <input
              type="text"
              placeholder="ex: 44790000"
              name="setZip"
              onChange={handleChange}
              value={state.zip}
              onBlur={checkCep}
            />
          </label>

          <label htmlFor="">
            Rua*
            <input
              type="text"
              placeholder="ex: Rua Boa Vista"
              name="setStreet"
              onChange={handleChange}
              value={state.streetAddress}
            />
          </label>

          <label htmlFor="" className={styles.sm}>
            UF*
            <input
              type="text"
              placeholder="UF"
              name="setState"
              onChange={handleChange}
              value={state.state}
            />
          </label>
        </div>

        <div className="input-group">
          <label htmlFor="" className={styles.sm}>
            Numero*
            <input
              type="text"
              placeholder="ex: 22"
              name="setNumber"
              onChange={handleChange}
              value={state.number}
              ref={numero}
            />
          </label>

          <label htmlFor="">
            Cidade*
            <input
              type="text"
              placeholder="Digite sua cidade"
              name="setCity"
              onChange={handleChange}
              value={state.city}
            />
          </label>
        </div>

        <div className="input-group">
          <label htmlFor="">
            Complemento
            <input
              type="text"
              placeholder="ex: Clube Show"
              name="setComplement"
              onChange={handleChange}
              value={state.complement}
            />
          </label>

          <label htmlFor="">
            Vizinhança*
            <input
              type="text"
              placeholder="Informe a vizinhança"
              name="setNeighborhood"
              onChange={handleChange}
              value={state.neighborhood}
            />
          </label>
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
