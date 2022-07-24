import styles from './styles.module.scss';

type ApiInformationProps = {
  alive: boolean;
};

export function ApiInformation({ alive }: ApiInformationProps) {
  return (
    <div className={styles.loading}>
      {alive ? (
        <div>
          <h1>
            <span>200</span> | API Online
          </h1>
        </div>
      ) : (
        <div>
          <h1>
            <span>500</span> | API Offline
          </h1>
          <img src="assets/img/500.svg" alt="Imagem" />
        </div>
      )}
    </div>
  );
}
