import * as React from 'react';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import BootstrapDialog from '../../atoms/BootstrapDialog/intex';
import { useDispatch, useSelector } from 'react-redux';
import {
  closeDialogStateSelector,
  setCloseDialogState,
} from '../../../redux/slices/close-dialog-slice/close-dialog-slice';
import { AppDispatch } from '../../../redux/store';
import StyledParagragp from '../../atoms/StyledParagraph/Index';
import { Theme } from '@mui/material';

const CloseApplicationDialog: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const open = useSelector(closeDialogStateSelector);

  const closeDialog = React.useCallback(
    () => dispatch(setCloseDialogState(false)),
    [],
  );

  const closeWindow = React.useCallback(
    () => window.electron.ipcRenderer.sendMessage('window.close'),
    [],
  );

  const defineColor = React.useCallback(
    (theme: Theme) => theme.palette.grey[500],
    [],
  );

  return (
    <React.Fragment>
      <BootstrapDialog
        onClose={closeDialog}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          <StyledParagragp
            text="Подтверждение выхода"
            fontSize="22px"
            fontWeight={600}
          />
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={closeDialog}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: defineColor,
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <Typography gutterBottom>
            <StyledParagragp text="Вы уверены, что хотите выйти? Все несохраненные данные будут потеряны" />
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeWindow}>
            <StyledParagragp text="Да" fontSize="16px" fontWeight={600} />
          </Button>
          <Button autoFocus onClick={closeDialog}>
            <StyledParagragp text="Нет" fontSize="16px" fontWeight={600} />
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </React.Fragment>
  );
};

export default CloseApplicationDialog;
