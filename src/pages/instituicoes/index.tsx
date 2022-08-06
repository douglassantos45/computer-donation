import { institutions } from '../../database/institution';
import styles from './styles.module.scss';

import { RiShareBoxLine } from 'react-icons/ri';

export default function Institutions() {
  return (
    <div className={styles.container}>
      <section>
        {institutions.map(company => (
          <div key={company.id} className={styles.company_wrapper}>
            <div className="separator">
              <div></div>
              <div>Institição</div>
              <div></div>
            </div>
            <h1>{company.name}</h1>
            <div className={styles.address}>
              <h3>
                Cidade: <span>{company.city}</span>
              </h3>
              <h3>
                Bairro: <span>{company.district}</span>
              </h3>
            </div>
            <div className={styles.description}>
              <h3>Descrição:</h3> <p> {company.description}</p>
            </div>

            <div className={styles.social}>
              <h3>Redes Sociais: </h3>
              {company.social.map(({ url, name }, index) => (
                <a
                  href={url}
                  key={index}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {name}
                  <RiShareBoxLine />
                </a>
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
