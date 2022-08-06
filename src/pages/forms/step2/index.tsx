import Link from 'next/link';
import { useRouter } from 'next/router';
import { ChangeEvent, MouseEvent, useEffect, useState } from 'react';
import { useForm, FormAction } from '../../../contexts/FormContext';
import toast from 'react-hot-toast';
import { validation, messageError } from '../../../utils/Validation';
import { FaTrash } from 'react-icons/fa';
import { FiPlus } from 'react-icons/fi';
import { api } from '../../../services/api-donation';
import { responseMessage } from '../../../utils/Messages';
import { ImSpinner8 } from 'react-icons/im';

import { equipments, states } from '../../../database/devices';

import styles from './styles.module.scss';

export default function Step2() {
  const history = useRouter();
  const { state, dispatch } = useForm();
  const [serviceList, setServiceList] = useState([...state.devices]);
  const [renderSelects, setRenderSelects] = useState(state.devices.length);
  const [loading, setLoading] = useState(false);
  const [inputInvalid, setInputInvalid] = useState(false);

  useEffect(() => {
    /* if (validation(state) == false) {
      history.push('/');
    } */
    //Recarregando o total de dispositivo quando o usuário voltar para o formulário 1
    dispatch({
      type: FormAction.setDeviceCount,
      payload: state.devices.length,
    });

    dispatch({
      type: FormAction.setCurrentStep,
      payload: 2,
    });
  }, []);

  //Função para adicionar select de forma dinâmica quando clica no botão de add
  const handleServiceAdd = () => {
    setRenderSelects(renderSelects + 1); //Armazenando o total de selects adicionado
    setServiceList([...serviceList, { type: '', condition: '' }]); //Criando novo campo select
  };

  //Removendo o campo de select pelo index
  const handleServiceRemove = index => {
    const list = [...serviceList]; //Copiando os dados do state para uma constante
    list.splice(index, 1);
    setServiceList(list); //Atualizando o state para a versão com uma remoção.

    setRenderSelects(renderSelects - 1);
  };

  //Adicionado na lista de devices todos os dados que foram selecionados nos campos dos selects
  const handleServiceChange = (e: ChangeEvent<HTMLSelectElement>, index) => {
    const { name, value } = e.target;
    console.log(value);
    const list = [...serviceList]; //Realizando uma cópia do state anterior

    list[index][name] = value; //Alterando os valores dos selects pelo index do select selecionado
    setServiceList(list);
  };

  const pagePreview = () => {
    return history.push('/');
  };

  const handleSaveState = () => {
    dispatch({
      type: FormAction.setDevices,
      payload: serviceList,
    });

    pagePreview();
  };

  const handleSubmit = async (e: MouseEvent<HTMLElement>) => {
    e.preventDefault();

    //Verificando se existe algum select sem está selecionado
    for (let i = 0; i < renderSelects; i++) {
      if (serviceList[i]['type'] === '' || serviceList[i]['condition'] === '') {
        setInputInvalid(!inputInvalid);
        toast.error('Selecione todos os campos.');
        setTimeout(() => setInputInvalid(false), 650);
        return;
      }
    }

    const request = {
      name: state.name.trim(),
      email: state.email.trim() === '' ? undefined : state.email.trim(),
      phone: state.phone.trim(),
      zip: state.zip,
      city: state.city.trim(),
      state: state.state.trim(),
      streetAddress: state.streetAddress.trim(),
      number: parseInt(state.number),
      complement:
        state.complement.trim() === '' ? undefined : state.complement.trim(),
      neighborhood: state.neighborhood.trim(),
      deviceCount: renderSelects,
      devices: serviceList,
    };

    setLoading(true);

    try {
      const completed = await api.post('/donation', request);

      if (completed.status === 200) {
        toast.success('Seus dados foram enviados com sucesso!');
        return setLoading(false);
      }
    } catch (e) {
      const { data } = e.response;
      const message = messageError(data.requiredFields);

      dispatch({
        type: FormAction.setFieldsError,
        payload: data.requiredFields,
      });

      if (e.response.status == 500) {
        return toast.error(responseMessage['500']);
      }
      toast.error(message);
      return setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Segunda Etapa</h1>
      <p className="current-step">Passo {state.currentStep}/2</p>
      <div className={styles.add}>
        <span className={styles.total_devices}>Total: {renderSelects}</span>

        <div onClick={handleServiceAdd}>
          <FiPlus />
        </div>
      </div>
      <form action="" className="form-group">
        <div className={styles.wrapper}>
          {renderSelects > 0 &&
            serviceList.map((service, index) => (
              <div key={index} className={`input-group ${styles.wrapper}`}>
                <label htmlFor="type">
                  Equipamentos
                  <select
                    name="type"
                    value={service.type}
                    onChange={e => handleServiceChange(e, index)}
                    className={
                      inputInvalid && state.devices[index].type === ''
                        ? styles.input_invalid
                        : ''
                    }
                  >
                    <option value="">Selecione...</option>
                    {equipments.map(({ name, value }) => (
                      <option value={value} key={value}>
                        {name}
                      </option>
                    ))}
                  </select>
                </label>

                <label htmlFor="condition">
                  Condição
                  <select
                    name="condition"
                    value={service.condition}
                    onChange={e => handleServiceChange(e, index)}
                    className={
                      inputInvalid && state.devices[index].condition === ''
                        ? styles.input_invalid
                        : ''
                    }
                  >
                    <option value="">Selecione...</option>
                    {states.map(({ name, value }) => (
                      <option value={value} key={value}>
                        {name}
                      </option>
                    ))}
                  </select>
                </label>
                {renderSelects > 1 && (
                  <div
                    onClick={e => handleServiceRemove(index)}
                    className={styles.remove_select}
                  >
                    <FaTrash />
                  </div>
                )}
              </div>
            ))}
        </div>
        <br />
      </form>

      <div className="btn-group">
        <div className="btn-prev" onClick={handleSaveState}>
          <span>Voltar</span>
        </div>
        <div>
          <button
            className={styles.submit}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? <ImSpinner8 /> : 'Concluir'}
          </button>
        </div>
      </div>
    </div>
  );
}
