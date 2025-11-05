import '../../index.css';
import styles from './app.module.css';

import { AppHeader } from '@components';
import { AuthInit } from '../auth-init';
import { ModalSwitch } from '../modal-switch';
import { BrowserRouter } from 'react-router-dom';
import { FC } from 'react';

const App: FC = () => (
  <BrowserRouter>
    <div className={styles.app}>
      <AppHeader />
      <AuthInit />
      <ModalSwitch />
    </div>
  </BrowserRouter>
);

export default App;
