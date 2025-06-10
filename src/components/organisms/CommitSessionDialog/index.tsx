import React from 'react';
import BootstrapDialog from '../../atoms/BootstrapDialog/intex';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../../redux/store';
import {
  closeCommitSessionDialogAndClearState,
  commitSessionStateSelector,
  setOpenState,
} from '../../../redux/slices/commit-session-slice/commit-session-slice';
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Theme,
  Typography,
} from '@mui/material';
import StyledParagragp from '../../atoms/StyledParagraph/Index';
import CloseIcon from '@mui/icons-material/Close';
import { setCommitSessionButtonLoading } from '../../../redux/slices/devices-slice/devices-slice';

const CommitSessionDialog = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { ipAddress, open, person, successAction, failedAction, errorAction } =
    useSelector(commitSessionStateSelector);

  const closeDialog = React.useCallback(() => {
    dispatch(setOpenState(false));
    dispatch(
      setCommitSessionButtonLoading({ address: ipAddress, loading: false }),
    );
  }, [ipAddress, open]);

  const defineColor = React.useCallback(
    (theme: Theme) => theme.palette.grey[500],
    [],
  );

  const successButtonClicked = React.useCallback(() => {
    successAction?.();
    dispatch(closeCommitSessionDialogAndClearState({ address: ipAddress }));
  }, [successAction]);

  const failedButtonClicked = React.useCallback(() => {
    failedAction?.();
    dispatch(closeCommitSessionDialogAndClearState({ address: ipAddress }));
  }, [failedAction]);

  const errorButtonClicked = React.useCallback(() => {
    errorAction?.();
    dispatch(closeCommitSessionDialogAndClearState({ address: ipAddress }));
  }, [errorAction]);

  return (
    <React.Fragment>
      <BootstrapDialog
        onClose={closeDialog}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          <StyledParagragp
            text="Подтверждение завершения сессии"
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
            <StyledParagragp
              text={`Вы уверены, что хотите завершить сеанс для осужденного ${person?.secondName}. Укажите, прошел ли сеанс удачно.`}
            />
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={successButtonClicked}>
            <StyledParagragp text="Успешно" fontSize="16px" fontWeight={600} />
          </Button>
          <Button autoFocus onClick={failedButtonClicked}>
            <StyledParagragp
              text="Недозвонился"
              fontSize="16px"
              fontWeight={600}
            />
          </Button>
          <Button autoFocus onClick={errorButtonClicked}>
            <StyledParagragp
              text="Ошибочный сеанс"
              fontSize="16px"
              fontWeight={600}
            />
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </React.Fragment>
  );
};

export default CommitSessionDialog;
