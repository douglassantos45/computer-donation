import Link from 'next/link';
import { useRouter } from 'next/router';
import { ChangeEvent, MouseEvent, useEffect, useState } from 'react';
import { useForm, FormAction } from '../../../contexts/FormContext';
import toast from 'react-hot-toast';
import validation from '../../../utils/Validation';
import { FaTrash } from 'react-icons/fa';
import { FiPlus } from 'react-icons/fi';

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

  const handleNextForm = async (e: MouseEvent<HTMLElement>) => {
    e.preventDefault();

    dispatch({
      type: FormAction.setDevices,
      payload: serviceList,
    });

    //Verificando se existe algum select sem está selecionado
    for (let i = 0; i < renderSelects; i++) {
      if (serviceList[i]['type'] === '' || serviceList[i]['condition'] === '') {
        return toast.error('Alguns campos não foram selecionados');
      }
    }

    return history.push('/forms/step3');
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

  return (
    <div className={styles.container}>
      <h1>Segunda Etapa</h1>
      <p className="current-step">Passo {state.currentStep}/3</p>
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
        <div className="btn-prev">
          <Link href="/">Voltar</Link>
        </div>
        <div>
          <button onClick={handleNextForm}>Continuar</button>
        </div>
      </div>
    </div>
  );
}
