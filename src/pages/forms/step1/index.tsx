import { useRouter } from 'next/router';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
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

  useEffect(() => {
    //Recarrega em qual formulário o usuário está ex: 1/2 ou 2/2
    validateEmail(state.email);
    state.phone && validatePhone(state.phone);

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

      validatePhone(phone); //Verificando se o telefone é válido 'pt-BR'
    }

    dispatch({
      type: FormAction[e.target.name],
      payload: e.target.value,
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

  //Validando alguns dados e passando para a próxima etapa do formulário
  function handleNextForm(e) {
    e.preventDefault();
    if (validation(state) !== false) {
      return history.push('/forms/step2');
    }
    toast.error('Preencha todos os campos obrigatórios.');
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
                  state.fieldsError?.includes('name')
                    ? styles.input_invalid
                    : ''
                }
                type="text"
                placeholder="Digite seu nome"
                name="setName"
                onChange={handleChange}
                value={state.name}
                pattern="[a-z A-Z]*"
              />
              {state.fieldsError?.includes('name') && (
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
                className={emailError && styles.input_invalid}
                type="email"
                placeholder="ex: email@gmail.com"
                name="setEmail"
                onChange={handleChange}
                value={state.email}
              />
              <span className={styles.input_invalid_msg}>{emailError}</span>
            </label>
            <label htmlFor="setPhone">
              Telefone
              <span style={{ color: 'red' }}> *</span>
              <input
                className={
                  phoneError && state.fieldsError?.includes('phone')
                    ? styles.input_invalid
                    : ''
                }
                type="text"
                placeholder="ex: 55749003452"
                name="setPhone"
                onChange={handleChange}
                value={state.phone}
                pattern="[0-9]*"
              />
              <span className={styles.input_invalid_msg}>{phoneError}</span>
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
                  state.fieldsError?.includes('zip') ? styles.input_invalid : ''
                }
              />
              {state.fieldsError?.includes('zip') && (
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
                    state.fieldsError?.includes('streetAddress')
                      ? styles.input_invalid
                      : ''
                  }
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
                  disabled
                />
              </label>
              <label htmlFor="setNumber" className="sm">
                Numero
                <span style={{ color: 'red' }}> *</span>
                <input
                  className={
                    (state.number && parseInt(state.number) < 1) ||
                    state.fieldsError?.includes('number')
                      ? styles.input_invalid
                      : ''
                  }
                  type="text"
                  placeholder="ex: 22"
                  name="setNumber"
                  onChange={handleChange}
                  value={state.number}
                  ref={numero}
                  pattern="[0-9]*"
                />
                {state.number && parseInt(state.number) < 1 && (
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
                placeholder="Digite sua cidade"
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
                  state.fieldsError?.includes('neighborhood')
                    ? styles.input_invalid
                    : ''
                }
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
