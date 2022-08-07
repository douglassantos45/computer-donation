import { useRouter } from 'next/router';
import { ChangeEvent, MouseEvent, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useForm, FormAction } from '../../../contexts/FormContext';
import { api } from '../../../services/api-cep';
import { validation } from '../../../utils/Validation';
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
  const [inputInvalid, setInputInvalid] = useState(false);

  useEffect(() => {
    //Recarrega em qual formulário o usuário está ex: 1/2 ou 2/2

    state.phone !== '' ? validatePhone(state.phone) : '';
    validateEmail(state.email);

    dispatch({
      type: FormAction.setCurrentStep,
      payload: 1,
    });
  }, []);

  const validateEmail = email => {
    if (!validator.isEmail(email) && email != '') {
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
      validateEmail(value);
    } else if (name === 'setPhone') {
      //Removendo caracteres do telefone
      const phone = value.replaceAll(/[a-z A-Z-+=~,;´`'().\[\]]+/g, '').trim();

      //Verificando se o telefone é válido 'pt-BR'
      if (validatePhone(phone)) {
        dispatch({
          type: FormAction.setPhone,
          payload: phone,
        });
        return;
      }
    }

    dispatch({
      type: FormAction[name],
      payload: value,
    });
  }

  async function checkCep(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    //Capturando os dados e armazenando somente se tiver dados
    if (e.target.value !== '') {
      const cep = value.replace(/\D/g, '');

      dispatch({
        type: FormAction[name],
        payload: value,
      });

      if (cep.length < 7) return; //Impedindo o loading e a consulta da api quando o tatal de caracteres for abaixo do padrão do cep

      loading.current.style.display = 'flex'; //Mostrando loading de carregamento do cep

      //Removendo loading depois de 2s
      setTimeout(async () => {
        loading.current.style.display = 'none';
      }, 2000); //2s

      try {
        const result = await api.get(`${cep}/json/`);
        const { data } = result;

        //Verificando se o cep foi encontrado e retornando uma mensagem de erro
        if (data.erro) {
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
      } catch (e) {
        return toast.error('Serviço de CEP indisponível no momento.');
      }
    }
  }

  function addBorderInputInvalid() {
    const fieldsEmpty = [];
    //Verificando quais campos estão vazios e preenchendo um array para popular o contexto
    Object.keys(state).forEach(key => {
      if (state[key] === '' && key !== 'email' && key !== 'complement') {
        fieldsEmpty.push(key);
      }
    });
    dispatch({
      type: FormAction.setFieldsError,
      payload: fieldsEmpty,
    });
  }

  //Validando alguns dados e passando para a próxima etapa do formulário
  function handleNextForm(e: MouseEvent) {
    e.preventDefault();

    if (validation(state) !== false) {
      return history.push('/forms/step2');
    }

    state.phone === '' ? validatePhone(state.phone) : '';

    setInputInvalid(!inputInvalid);
    toast.error('Preencha todos os campos obrigatórios.');
    setTimeout(() => setInputInvalid(false), 1000);
    return addBorderInputInvalid();
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
                className={
                  inputInvalid && state.name === '' ? styles.input_invalid : ''
                }
                type="text"
                placeholder="Digite seu nome"
                name="setName"
                onChange={handleChange}
                value={state.name}
                pattern="[a-z A-Z]*"
                required={state.fieldsError?.includes('name')}
              />
              {state.name === '' && state.fieldsError?.includes('name') && (
                <span className={styles.input_invalid_msg}>
                  Informe um nome válido
                </span>
              )}
            </label>
          </div>

          <div className="input-group">
            <label htmlFor="setEmail">
              E-mail
              <input
                className={emailError ? styles.input_invalid : ''}
                type="email"
                placeholder="ex: email@gmail.com"
                name="setEmail"
                onChange={handleChange}
                value={state.email}
              />
              {(emailError || state.fieldsError?.includes('email')) && (
                <span className={styles.input_invalid_msg}>{emailError}</span>
              )}
            </label>
            <label htmlFor="setPhone">
              Telefone
              <span style={{ color: 'red' }}> *</span>
              <input
                className={
                  phoneError && inputInvalid ? styles.input_invalid : ''
                }
                style={phoneError ? { border: '1px solid red' } : {}}
                type="tel"
                placeholder="ex: 55749003452"
                name="setPhone"
                onChange={handleChange}
                value={state.phone}
                pattern="[0-9]*"
                required={state.fieldsError?.includes('phone')}
              />
              {(phoneError || state.fieldsError?.includes('phone')) && (
                <span className={styles.input_invalid_msg}>
                  {state.phone === ''
                    ? 'Digite o número do telefone'
                    : phoneError}
                </span>
              )}
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
                className={
                  inputInvalid && state.zip === '' ? styles.input_invalid : ''
                }
                required={state.fieldsError?.includes('zip')}
              />
              {state.zip === '' && state.fieldsError?.includes('zip') && (
                <span className={styles.input_invalid_msg}>
                  Digite um CEP válido
                </span>
              )}
            </label>

            <div className="input-group">
              <label htmlFor="setStreet">
                Rua
                <span style={{ color: 'red' }}> *</span>
                <input
                  className={
                    inputInvalid && state.streetAddress === ''
                      ? styles.input_invalid
                      : ''
                  }
                  type="text"
                  placeholder="ex: Rua Boa Vista"
                  name="setStreet"
                  onChange={handleChange}
                  value={state.streetAddress}
                  required={state.fieldsError?.includes('streetAddress')}
                />
                {state.streetAddress === '' &&
                  state.fieldsError?.includes('streetAddress') && (
                    <span className={styles.input_invalid_msg}>
                      Informe um valor válido.
                    </span>
                  )}
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
                  disabled
                />
              </label>
              <label htmlFor="setNumber" className="sm">
                Numero
                <span style={{ color: 'red' }}> *</span>
                <input
                  className={
                    (inputInvalid && state.number === '') ||
                    (state.number && parseInt(state.number) < 1)
                      ? styles.input_invalid
                      : ''
                  }
                  type="text"
                  placeholder="ex: 22"
                  name="setNumber"
                  onChange={handleChange}
                  value={state.number}
                  ref={numero}
                  pattern="[1-9]*"
                  required={state.fieldsError?.includes('number')}
                />
                {((state.number && parseInt(state.number) < 1) ||
                  (state.number === '' &&
                    state.fieldsError?.includes('number'))) && (
                  <span className={styles.input_invalid_msg}>
                    O número deve ser maior que 0
                  </span>
                )}
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
                placeholder="Cidade"
                name="setCity"
                onChange={handleChange}
                value={state.city}
                disabled
              />
            </label>
            <label htmlFor="">
              Complemento
              <input
                className={
                  state.complement && state.complement.length < 2
                    ? styles.input_invalid
                    : ''
                }
                type="text"
                placeholder="ex: Clube Show"
                name="setComplement"
                onChange={handleChange}
                value={state.complement}
                style={
                  (state.complement !== '' && state.complement.length < 2) ||
                  state.fieldsError?.includes('complement')
                    ? { border: '1px solid red' }
                    : {}
                }
              />
              {state.complement && state.complement.length < 2 && (
                <span className={styles.input_invalid_msg}>
                  O complemento deve ter no minino 2 caracters
                </span>
              )}
            </label>

            <label htmlFor="setNeighborhood">
              Vizinhança
              <span style={{ color: 'red' }}> *</span>
              <input
                className={
                  inputInvalid && state.neighborhood === ''
                    ? styles.input_invalid
                    : ''
                }
                type="text"
                placeholder="Informe a vizinhança"
                name="setNeighborhood"
                onChange={handleChange}
                value={state.neighborhood}
                required={state.fieldsError?.includes('neighborhood')}
              />
              {state.neighborhood === '' &&
                state.fieldsError?.includes('neighborhood') && (
                  <span className={styles.input_invalid_msg}>
                    Informe um valor válido.
                  </span>
                )}
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
