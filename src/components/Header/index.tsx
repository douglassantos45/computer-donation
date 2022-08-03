import Link from 'next/link';
import { useRef, useState } from 'react';
import { VscChromeClose, VscListSelection } from 'react-icons/vsc';

import styles from './styles.module.scss';

export function Header() {
  const [modal, setModal] = useState(false);
  const modalRef = useRef(null);

  function handleMenu() {
    setModal(!modal);
  }

  return (
    <header className={styles.header}>
      <nav className={`${styles.nav} ${styles.container}`}>
        <div className={styles.logo}>
          <h1>
            Doa<span>Vai</span>
          </h1>
        </div>
        <div className={modal ? styles.nav_menu : ''} ref={modalRef}>
          {modal && (
            <div className={styles.nav_logo}>
              <h1>
                Doa<span>Vai</span>
              </h1>
            </div>
          )}
          <ul className={styles.nav_list}>
            <li className={styles.nav_items}>
              <Link
                href="/"
                className={`${styles.nav_link} ${styles.active_link}`}
              >
                Doar
              </Link>
            </li>
            <li className={styles.nav_items}>
              <Link
                href="/institutions"
                className={`${styles.nav_link} ${styles.active_link}`}
              >
                Instituições
              </Link>
            </li>
          </ul>
          {modal && (
            <div className={styles.close} onClick={handleMenu}>
              <VscChromeClose />
            </div>
          )}
        </div>

        <div className={styles.open} onClick={handleMenu}>
          <VscListSelection />
        </div>
      </nav>
    </header>
  );
}
