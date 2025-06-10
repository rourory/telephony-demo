import React from 'react';
import styles from './not-found.module.scss';
import { Link } from 'react-router-dom';
import { applicationThemeSelector } from '../../redux/slices/theme-slice/theme-slice';
import { useSelector } from 'react-redux';

const NotFoundPage: React.FC = () => {
  const visual = React.useRef<any>(null);
  const themeOptions = useSelector(applicationThemeSelector);

  React.useEffect(() => {
    ['resize', 'load'].forEach(function (e) {
      window.addEventListener(e, function () {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const ratio = 45 / (width / height);
        if (visual.current) {
          visual.current.style.transform = 'rotate(-' + ratio + 'deg)';
        }
      });
    });
  }, []);

  return (
    <div
      className={`${styles.container} ${
        themeOptions.palette.mode === 'dark' ? styles.container_dark : ''
      }`}
    >
      <Link
        className={styles.link}
        to="/"
        draggable="false"
        style={{ fontFamily: 'AdventPro', fontSize: '20px', fontWeight: 600 }}
      >
        <svg
          className={styles.svg}
          height="0.8em"
          width="0.8em"
          viewBox="0 0 2 1"
          preserveAspectRatio="none"
        >
          <polyline
            fill="none"
            stroke="#777777"
            strokeWidth="0.1"
            points="0.9,0.1 0.1,0.5 0.9,0.9"
          />
        </svg>{' '}
        Рабочая область
      </Link>
      <div className={styles.background_wrapper}>
        <h1 className={styles.header} ref={visual}>
          =(
        </h1>
      </div>
      <p
        className={`${styles.paragraph} ${
          themeOptions.palette.mode === 'dark' ? styles.paragraph_dark : ''
        }`}
        style={{ fontFamily: 'AdventPro' }}
      >
        Функциональность пока не реализована
      </p>
    </div>
  );
};

export default NotFoundPage;
