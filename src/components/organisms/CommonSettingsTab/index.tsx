import { DataGrid } from 'devextreme-react';
import { EventInfo } from 'devextreme/events';
import dxDataGrid, { DataErrorOccurredInfo } from 'devextreme/ui/data_grid';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Editing,
  RemoteOperations,
  Texts,
  Column,
  Lookup,
  RequiredRule,
  NumericRule,
} from 'devextreme-react/data-grid';
import permittedCallDurationsDataSource from '../../../devextreme/data-sources/call-duration-data-source';
import serverSettingsDataSource from '../../../devextreme/data-sources/server-settings-data-source';
import { appSettingsStateSelector } from '../../../redux/slices/app-settings-slice/app-settings-slice';
import { addNotification } from '../../../redux/slices/notify-slice/notify-slice';
import { loadServerSettingsThunk } from '../../../redux/slices/server-settings-slice/thunks';
import { AppDispatch } from '../../../redux/store';

const CommonSettings = () => {
  const dataGrid = React.useRef<DataGrid>(null);
  const dispatch = useDispatch<AppDispatch>();

  const backendSettings = useSelector(appSettingsStateSelector);

  const dataSource = React.useMemo(
    () => serverSettingsDataSource(backendSettings),
    [backendSettings],
  );

  const permittedDurationsDS = React.useMemo(
    () => permittedCallDurationsDataSource(backendSettings),
    [backendSettings],
  );

  const durationLookupDisplayExpression = React.useCallback(
    (val: PermittedCallDurationEntity) => {
      return `${val.duration}`;
    },
    [],
  );

  const onDataErrorOccured = React.useCallback(
    (
      e: EventInfo<dxDataGrid<UiPermissionEntity, number>> &
        DataErrorOccurredInfo,
    ) => {
      dispatch(
        addNotification({
          type: 'error',
          message: e.error?.message || 'Неожиданная ошибка',
        }),
      );
    },
    [],
  );

  const onRowUpdated = React.useCallback(() => {
    dispatch(loadServerSettingsThunk(backendSettings));
    dispatch(
      addNotification({ type: 'success', message: 'Настройки применены' }),
    );
  }, [backendSettings]);

  return (
    <DataGrid
      style={{ position: 'relative', height: '100%' }}
      ref={dataGrid}
      dataSource={dataSource}
      onDataErrorOccurred={onDataErrorOccured}
      columnHidingEnabled
      allowColumnReordering
      onRowUpdated={onRowUpdated}
    >
      <Editing
        useIcons
        mode={'row'}
        allowUpdating={true}
        allowDeleting={false}
        allowAdding={false}
        confirmDelete={true}
      >
        <Texts
          deleteRow={'Удалить'}
          editRow={'Редактировать'}
          saveRowChanges={'Сохранить'}
          cancelRowChanges={'Отмена'}
          confirmDeleteMessage={'Вы уверены, что хотите удалить строку?'}
        />
      </Editing>
      <RemoteOperations groupPaging filtering sorting paging />
      <Column
        dataType={'number'}
        dataField={'beforeTimerEndsWarningMinutes'}
        caption={'Предупреждение оператора об окончании сеанса за (мин.)'}
      >
        <NumericRule />
        <RequiredRule />
      </Column>
      <Column
        dataType={'number'}
        dataField={'standardCallDuration.id'}
        caption={'Стандартная продолжительность сеанса звонка'}
      >
        <Lookup
          dataSource={permittedDurationsDS}
          valueExpr="id"
          displayExpr={durationLookupDisplayExpression}
        />
        <RequiredRule />
      </Column>
      <Column
        dataType={'number'}
        dataField={'changePasswordRequiredIntervalMonths'}
        caption={'Уведомление о необходимости сменить пароль через (мес.)'}
      >
        <NumericRule />
        <RequiredRule />
      </Column>
    </DataGrid>
  );
};

export default CommonSettings;
