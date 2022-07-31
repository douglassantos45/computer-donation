import Link from 'next/link';
import { useRouter } from 'next/router';
import { ChangeEvent, MouseEvent, useEffect, useState } from 'react';
import { useForm, FormAction } from '../../../contexts/FormContext';
import toast from 'react-hot-toast';

import styles from './styles.module.scss';

export default function Step2() {
  const [serviceList, setServiceList] = useState([{ type: '', condition: '' }]);

  const amount = 2;

  useEffect(() => {
    Array.from(Array(2)).map(_ => handleServiceAdd());
  }, []);

  const handleServiceAdd = () => {
    setServiceList([...serviceList, { type: '', condition: '' }]);
  };

  const handleSubmit = () => {
    console.log(serviceList);
  };

  const handleServiceRemove = index => {
    console.log('');
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
        <div>
          <label htmlFor="service">Services</label>
          {serviceList.map((service, index) => (
            <div key={index}>
              <select
                name="type"
                value={service.type}
                onChange={e => handleServiceChange(e, index)}
              >
                <option value="">Selecione</option>
                <option value="notebook">Notebook</option>
              </select>

              <select
                name="condition"
                value={service.condition}
                onChange={e => handleServiceChange(e, index)}
              >
                <option value="">Selecione</option>
                <option value="ruim">ruim</option>
              </select>
            </div>
          ))}
        </div>
      </form>
      <button onClick={handleSubmit}>Add</button>
    </>
  );
}
