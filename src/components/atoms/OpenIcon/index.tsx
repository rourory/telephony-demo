import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import styles from './play-icon.module.scss';
const OpenIcon = () => {
  return (
    <div>
      <FolderOpenIcon color="secondary" className={styles.play} />
    </div>
  );
};

export default OpenIcon;
