import { useSnackbar } from 'notistack';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { notifySelector, removeEnqueued, itsTimeToEnqueue } from '../../../redux/slices/notify-slice/notify-slice';
import { AppDispatch } from '../../../redux/store';

const NitificationEnqueuer = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { enqueueSnackbar } = useSnackbar();

  const { notifications, itsTimeToBeEqueued } = useSelector(notifySelector);
  React.useEffect(() => {
    if (itsTimeToBeEqueued) {
      const enqueued: Array<AppNotification> = [];
      notifications.forEach((element) => {
        enqueueSnackbar(element.message, { variant: element.type });
        enqueued.push(element);
      });
      dispatch(removeEnqueued(enqueued));
      dispatch(itsTimeToEnqueue(false));
    }
  }, [itsTimeToBeEqueued]);

  React.useEffect(() => {
    const interval = setInterval(() => dispatch(itsTimeToEnqueue(true)), 300);
    return () => clearInterval(interval);
  }, []);

  return <></>;
};

export default NitificationEnqueuer;
