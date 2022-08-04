import { institutions } from '../../database/institution';
import styles from './styles.module.scss';

export default function Institutions() {
  return (
    <div className={styles.container}>
      <h1>Institutions</h1>

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
              <span>Cidade: {company.city}</span>
              <span>Bairro: {company.district}</span>
            </div>
            <div className={styles.description}>
              Descrição: <p> {company.description}</p>
            </div>

            <div className={styles.social}>
              <span>Redes Sociais: </span>
              {company.social.map(({ url, name }, index) => (
                <a
                  href={url}
                  key={index}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {name}
                </a>
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
