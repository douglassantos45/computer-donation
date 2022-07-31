import Link from 'next/link';
import { useRouter } from 'next/router';
import { ChangeEvent, MouseEvent, useEffect, useState } from 'react';
import { useForm, FormAction } from '../../../contexts/FormContext';
import toast from 'react-hot-toast';
import validation from '../../../utils/Validation';
import { FaTrash } from 'react-icons/fa';

import styles from './styles.module.scss';
import { api } from '../../../services/api-donation';
import { responseMessage } from '../../../utils/Messages';
import { ImSpinner8 } from 'react-icons/im';

export default function Step2() {
  const history = useRouter();
  const { state, dispatch } = useForm();
  const [serviceList, setServiceList] = useState([{ type: '', condition: '' }]);
  const [renderSelects, setRenderSelects] = useState(1);
  const [loading, setLoading] = useState(false);

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
    if (validation(state) == false) {
      history.push('/');
    }

    dispatch({
      type: FormAction.setCurrentStep,
      payload: 2,
    });
  }, []);

  const handleServiceAdd = () => {
    setRenderSelects(renderSelects + 1);
    setServiceList([...serviceList, { type: '', condition: '' }]);
  };

  const handleSalvar = (e: MouseEvent<HTMLElement>) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 2000);

    handleSubmit(e);
  };

  const handleSubmit = async (e: MouseEvent<HTMLElement>) => {
    e.preventDefault();

    state.devices = serviceList;
    state.deviceCount = renderSelects;

    console.log(state);

    delete state.currentStep;

    const completed = await api
      .post('/donation', state)
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
      return setTimeout(() => window.location.reload(), 3500);
    }

    return;
  };

  const handleServiceRemove = index => {
    const list = [...serviceList];
    list.splice(index, 1);
    setServiceList(list);

    setRenderSelects(renderSelects - 1);

    console.log(renderSelects);
  };

  const handleServiceChange = (e: ChangeEvent<HTMLSelectElement>, index) => {
    const { name, value } = e.target;
    const list = [...serviceList];

    list[index][name] = value;
    setServiceList(list);
  };

  return (
    <div className={styles.container}>
      <h1>Segunda Etapa</h1>
      <p>Passo {state.currentStep}/2</p>
      <form action="" className={styles.form_group}>
        <div>
          {renderSelects > 0 &&
            serviceList.map((service, index) => (
              <div key={index} className={styles.input_group}>
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
        <div className={styles.add_device}>
          <button onClick={handleServiceAdd} type="button">
            Adicionar
          </button>
          <span className={styles.total_devices}>Total: {renderSelects}</span>
        </div>
      </form>

      <div className={styles.btn_group}>
        <div className={styles.prev}>
          <Link href="/">Voltar</Link>
        </div>
        <div>
          <button className={styles.submit} onClick={handleSalvar}>
            {loading ? <ImSpinner8 /> : 'Concluir'}
          </button>
        </div>
      </div>
    </div>
  );
}
