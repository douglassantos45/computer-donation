import Link from 'next/link';
import { useRouter } from 'next/router';
import { ChangeEvent, MouseEvent, useEffect, useState } from 'react';
import { useForm, FormAction } from '../../../contexts/FormContext';
import toast from 'react-hot-toast';

import styles from './styles.module.scss';

export default function Step2() {
  const [serviceList, setServiceList] = useState([{ type: '', condition: '' }]);

  let amount = 2;

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
    Array.from(Array(amount)).map(_ => handleServiceAdd());
  }, [amount]);

  const handleServiceAdd = () => {
    setServiceList([...serviceList, { type: '', condition: '' }]);
  };

  const handleSubmit = () => {
    console.log(serviceList);
  };

  const handleServiceRemove = index => {
    const list = [...serviceList];
    list.splice(index, 1);
    setServiceList(list);

    amount -= 1;

    console.log(amount);
  };

  const handleServiceChange = (e: ChangeEvent<HTMLSelectElement>, index) => {
    const { name, value } = e.target;
    const list = [...serviceList];

    list[index][name] = value;
    setServiceList(list);
  };

  return (
    <>
      <form action="">
        <div className={styles.container}>
          {serviceList.map((service, index) => (
            <div key={index} className={styles.input_group}>
              <label htmlFor="service">
                <select
                  name="type"
                  value={service.type}
                  onChange={e => handleServiceChange(e, index)}
                >
                  <option value="">Selecione...</option>
                  {states.map(({ name, value }) => (
                    <option value={value} key={value}>
                      {name}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <select
                  name="condition"
                  value={service.condition}
                  onChange={e => handleServiceChange(e, index)}
                >
                  <option value="">Selecione</option>
                  {equipments.map(({ name, value }) => (
                    <option value={value} key={value}>
                      {name}
                    </option>
                  ))}
                </select>
              </label>

              <button onClick={e => handleServiceRemove(index)} type="button">
                Remover
              </button>
            </div>
          ))}
        </div>
      </form>
      <button onClick={handleSubmit}>Add</button>
    </>
  );
}
