import { useRouter } from 'next/router';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useForm, FormAction } from '../../../contexts/FormContext';
import { api } from '../../../services/api-cep';
import validation from '../../../utils/Validation';
import validator from 'validator';

import styles from './styles.module.scss';
import MaskedInput from '../../../components/MaskedInput';

export default function Step1() {
  const { state, dispatch } = useForm();
  const loading = useRef(null);
  const numero = useRef(null);

  const history = useRouter();

  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [inputValid, setInputValid] = useState(false);
  const [zip, setZip] = useState('');

  useEffect(() => {
    //Recarrega em qual formulário o usuário está ex: 1/2 ou 2/2
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
    setEmailError('');
    return true;
  };

  const validatePhone = phone => {
    if (!validator.isMobilePhone(phone, ['pt-BR'])) {
      setPhoneError('Esse telefone é inválido!');
      return false;
    }
    setPhoneError('');
    return true;
  };

  //Capturando dados do inputs
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    if (name == 'setEmail') {
      setInputValid(validateEmail(value));
    } else if (name === 'setPhone') {
      //Removendo caracteres do telefone
      const phone = value
        .replaceAll('(', '')
        .replaceAll(')', '')
        .replaceAll('-', '')
        .replaceAll('.', '')
        .replaceAll(/[a-z A-Z]+/g, ' ')
        .trim();
      dispatch({
        type: FormAction.setPhone,
        payload: phone,
      });

      setInputValid(validatePhone(phone)); //Verificando se o telefone é válido 'pt-BR'
    }

    dispatch({
      type: FormAction[e.target.name],
      payload: e.target.value,
    });
  }

  async function checkCep(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    setZip(value); //Armazenando o cep com máscara ex:44790-000 (Para o back-end que aceita somente com máscara)

    if (e.target.value !== '') {
      dispatch({
        type: FormAction[name],
        payload: value,
      });

      loading.current.style.display = 'flex'; //Mostrando loading de carregamento do cep

      //Removendo loading depois de 2s
      setTimeout(async () => {
        loading.current.style.display = 'none';
      }, 2000); //2s

      const cep = value.replace(/\D/g, '');

      if (cep.length < 7) return;

      const result = await api.get(`${cep}/json/`);

      const { data } = result;

      if (data.erro) {
        setZip('');
        dispatch({
          type: FormAction.setZip,
          payload: '',
        });
        return toast.error('Cep Invalido');
      }

      dispatch({
        type: FormAction.setCity,
        payload: data.localidade,
      });

      dispatch({
        type: FormAction.setStreet,
        payload: data.logradouro,
      });

      dispatch({
        type: FormAction.setState,
        payload: data.uf,
      });

      numero.current.focus();
    }
  }

  //Validando alguns dados e passando para a próxima etapa do formulário
  function handleNextForm(e) {
    e.preventDefault();

    if (!inputValid)
      return toast.error('Preencha corretamente todos os campos');

    if (state.email !== '' && validateEmail(state.email) === false) {
      return toast.error('Email inválido');
    }

    if (validation(state) !== false) {
      return history.push('/forms/step2');
    }

    setInputValid(!inputValid);

    toast.error('Preencha todos os campos.');
  }

  return (
    <div className={styles.container}>
      <h1>Primeira Etapa</h1>
      <p className="current-step">Passo {state.currentStep}/2</p>

      <form className="form-group">
        <div className="separator">
          <div></div>
          <div>Informações</div>
          <div></div>
        </div>
        <section className={styles.info}>
          <div className="input-group">
            <label htmlFor="setName">
              Nome completo <span style={{ color: 'red' }}>*</span>
              <input
                type="text"
                placeholder="Digite seu nome"
                name="setName"
                onChange={handleChange}
                value={state.name}
                pattern="[a-z A-Z]*"
              />
            </label>
          </div>

          <div className="input-group">
            <label htmlFor="setEmail">
              E-mail
              <input
                type="email"
                placeholder="ex: email@gmail.com"
                name="setEmail"
                onChange={handleChange}
                value={state.email}
              />
              <span className={styles.input_invalid}>{emailError}</span>
            </label>
            <label htmlFor="setPhone">
              Telefone
              <span style={{ color: 'red' }}> *</span>
              <input
                type="text"
                placeholder="ex: 55749003452"
                name="setPhone"
                onChange={handleChange}
                value={state.phone}
                pattern="[0-9]*"
              />
              <span className={styles.input_invalid}>{phoneError}</span>
            </label>
          </div>
        </section>

        <div className="separator">
          <div></div>
          <div>Endereço</div>
          <div></div>
        </div>

        <section id={styles.address}>
          <div className="input-group">
            <label htmlFor="setZip">
              Cep
              <span style={{ color: 'red' }}> *</span>
              <MaskedInput
                value={state.zip}
                onChange={handleChange}
                name="setZip"
                onBlur={checkCep}
                placeholder="ex: 44790-000"
              />
            </label>

            <div className="input-group">
              <label htmlFor="setStreet">
                Rua
                <span style={{ color: 'red' }}> *</span>
                <input
                  type="text"
                  placeholder="ex: Rua Boa Vista"
                  name="setStreet"
                  onChange={handleChange}
                  value={state.streetAddress}
                />
              </label>

              <label htmlFor="setState" className="sm">
                UF
                <span style={{ color: 'red' }}> *</span>
                <input
                  type="text"
                  placeholder="UF"
                  name="setState"
                  onChange={handleChange}
                  value={state.state}
                  pattern="[a-z A-Z]*"
                />
              </label>
              <label htmlFor="setNumber" className="sm">
                Numero
                <span style={{ color: 'red' }}> *</span>
                <input
                  type="text"
                  placeholder="ex: 22"
                  name="setNumber"
                  onChange={handleChange}
                  value={state.number}
                  ref={numero}
                  pattern="[0-9]*"
                />
              </label>
            </div>
          </div>

          <div className="input-group"></div>

          <div className="input-group">
            <label htmlFor="setCity">
              Cidade
              <span style={{ color: 'red' }}> *</span>
              <input
                type="text"
                placeholder="Digite sua cidade"
                name="setCity"
                onChange={handleChange}
                value={state.city}
                pattern="[a-z A-Z]*"
              />
            </label>
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

            <label htmlFor="setNeighborhood">
              Vizinhança
              <span style={{ color: 'red' }}> *</span>
              <input
                type="text"
                placeholder="Informe a vizinhança"
                name="setNeighborhood"
                onChange={handleChange}
                value={state.neighborhood}
              />
            </label>
          </div>
        </section>

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
