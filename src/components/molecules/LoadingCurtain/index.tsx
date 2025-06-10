import React from 'react';
import styles from './loading_curtain.module.scss';
import UltraLightLoadingIndicator from '../UltraLightLoadingIndicator';

type Props = {
  show: boolean;
};

const LoadingCurtain: React.FC<Props> = ({ show }) => {
  return (
    <div
      className={styles.curtain}
      style={{ opacity: show ? 0.8 : 0, zIndex: show ? 9999 : -9999 }}
    >
      <UltraLightLoadingIndicator />
    </div>
  );
};

export default LoadingCurtain;
