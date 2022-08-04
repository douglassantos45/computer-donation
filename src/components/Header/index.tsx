import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { VscChromeClose, VscListSelection } from 'react-icons/vsc';
import { ActiveLink } from '../ActiveLink';

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
              <ActiveLink activeClassName={styles.active_link} href={'/'}>
                <a className={`${styles.nav_link} ${styles.active_link}`}>
                  Doar
                </a>
              </ActiveLink>
            </li>
            <li className={styles.nav_items}>
              <ActiveLink
                activeClassName={styles.active_link}
                href="/institutions"
              >
                <a className={`${styles.nav_link} ${styles.active_link}`}>
                  Instituições
                </a>
              </ActiveLink>
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
