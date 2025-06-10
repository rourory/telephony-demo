import { DataGrid } from 'devextreme-react';
import { EventInfo } from 'devextreme/events';
import dxDataGrid, {
  DataErrorOccurredInfo,
  NewRowInfo,
} from 'devextreme/ui/data_grid';
import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Editing,
  RemoteOperations,
  Column,
  Lookup,
  RequiredRule,
} from 'devextreme-react/data-grid';
import callTryingsDataSource from '../../../../devextreme/data-sources/call-tryings-data-source';
import contactsDataSource from '../../../../devextreme/data-sources/contacts-data-source';
import { dateNumberFilterOperations } from '../../../../devextreme/devextreme-settings';
import { appSettingsStateSelector } from '../../../../redux/slices/app-settings-slice/app-settings-slice';
import { addNotification } from '../../../../redux/slices/notify-slice/notify-slice';
import { userPermissions } from '../../../../redux/slices/user-slice/user-slice';
import { AppDispatch } from '../../../../redux/store';
import { dataGridRussianTexts } from '../../../../utils/data-grid-russian-texts';

export const CallTryingsMD = React.memo((props: any) => {
  const dispatch = useDispatch<AppDispatch>();

  const parent = useMemo(() => props.data.data as CallEntity, [props]);
  const backendSettings = useSelector(appSettingsStateSelector);

  const dataSource = React.useMemo(
    () => callTryingsDataSource(backendSettings),
    [backendSettings],
  );
  const contactsDS = React.useMemo(
    () => contactsDataSource(backendSettings),
    [backendSettings],
  );

  const { callTryingsDataGridDeletePermitted } = useSelector(userPermissions);

  const dataGrid = React.useRef<DataGrid>(null);

  const onDataErrorOccured = React.useCallback(
    (
      e: EventInfo<dxDataGrid<CallTryingEntity, number>> &
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

  const onInitNewRow = React.useCallback(
    (
      e: EventInfo<dxDataGrid<CallTryingEntity, number>> &
        NewRowInfo<CallTryingEntity>,
    ) => {
      e.data.callId = parent.id || -1;
    },
    [],
  );

  const contactIdLookupDisplayExpression = React.useCallback(
    (val: ContactEntity) => {
      return `${val.contactValue}`;
    },
    [],
  );

  return (
    <DataGrid
      style={{ position: 'relative', height: '100%', width: '100%' }}
      ref={dataGrid}
      dataSource={dataSource}
      onDataErrorOccurred={onDataErrorOccured}
      filterValue={['callId', '=', parent.id]}
      onInitNewRow={onInitNewRow}
    >
      <Editing
        useIcons
        mode={'row'}
        allowDeleting={callTryingsDataGridDeletePermitted}
        confirmDelete={true}
        texts={dataGridRussianTexts}
      ></Editing>
      <RemoteOperations filtering sorting />
      <Column
        dataField={'callId'}
        caption={'Звонок'}
        dataType={'number'}
        allowReordering
        allowResizing
        filterOperations={dateNumberFilterOperations}
        allowFiltering
        visible={false}
      >
        <RequiredRule message={'Обязательное поле'} />
      </Column>
      <Column
        dataField={'contactId'}
        caption={'Контакт'}
        dataType={'number'}
        allowReordering
        allowResizing
        width={400}
        filterOperations={dateNumberFilterOperations}
        allowFiltering
      >
        <Lookup
          dataSource={contactsDS}
          valueExpr="id"
          displayExpr={contactIdLookupDisplayExpression}
        />
        <RequiredRule message={'Обязательное поле'} />
      </Column>
      <Column
        dataField={'tryingDate'}
        caption={'Время попытки'}
        dataType={'datetime'}
        allowReordering
        allowResizing
        width={170}
        format={'dd-MM-yyyy HH:mm:ss'}
        filterOperations={dateNumberFilterOperations}
        allowFiltering
      >
        <RequiredRule message={'Обязательное поле'} />
      </Column>
    </DataGrid>
  );
});

export default CallTryingsMD;
