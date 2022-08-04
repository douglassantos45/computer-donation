import Link from 'next/link';
import { useRouter } from 'next/router';
import { ChangeEvent, MouseEvent, useEffect, useState } from 'react';
import { useForm, FormAction } from '../../../contexts/FormContext';
import toast from 'react-hot-toast';
import validation from '../../../utils/Validation';
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
  const [renderSelects, setRenderSelects] = useState(state.deviceCount);
  const [loading, setLoading] = useState(false);

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

    setServiceList([...serviceList, { type: '', condition: '' }]);
  };

  //Removendo o campo de select pelo index
  const handleServiceRemove = index => {
    const list = [...serviceList];
    list.splice(index, 1);
    setServiceList(list);

    setRenderSelects(renderSelects - 1);
  };

  //Adicionado na lista de devices todos os dados que foram selecionados nos campos dos selects
  const handleServiceChange = (e: ChangeEvent<HTMLSelectElement>, index) => {
    const { name, value } = e.target;
    const list = [...serviceList];

    list[index][name] = value;
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
        return toast.error('Alguns campos não foram selecionados');
      }
    }

    const response = {
      name: state.name.trim(),
      email: state.email.trim(),
      phone: state.phone.trim(),
      zip: state.zip,
      city: state.city.trim(),
      state: state.state.trim(),
      streetAddress: state.streetAddress.trim(),
      number: parseInt(state.number),
      complement: state.complement.trim(),
      neighborhood: state.neighborhood.trim(),
      deviceCount: state.deviceCount,
      devices: state.devices,
    };

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 2000);

    console.log(response);

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
        <div>
          {renderSelects > 0 &&
            serviceList.map((service, index) => (
              <div key={index} className={`input-group ${styles.hr}`}>
                <label htmlFor="type">
                  Equipamentos
                  <select
                    name="type"
                    value={service.type}
                    onChange={e => handleServiceChange(e, index)}
                  >
                    <option>Selecione...</option>
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
                  >
                    <option value="">Selecione</option>
                    {states.map(({ name, value }) => (
                      <option value={value} key={value}>
                        {name}
                      </option>
                    ))}
                  </select>
                </label>
                {renderSelects > 1 && (
                  <div
                    onClick={handleServiceRemove}
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
          <button className={styles.submit} onClick={handleSubmit}>
            {loading ? <ImSpinner8 /> : 'Concluir'}
          </button>
        </div>
      </div>
    </div>
  );
}
