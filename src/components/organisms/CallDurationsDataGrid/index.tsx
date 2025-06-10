import DataGrid, { NumericRule } from 'devextreme-react/data-grid';
import { EventInfo } from 'devextreme/events';
import dxDataGrid, { DataErrorOccurredInfo } from 'devextreme/ui/data_grid';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Editing,
  FilterRow,
  RemoteOperations,
  Sorting,
  Pager,
  Paging,
  Selection,
  Column,
  RequiredRule,
} from 'devextreme-react/data-grid';
import permittedCallDurationsDataSource from '../../../devextreme/data-sources/call-duration-data-source';
import { fiterRowOperationDescriptions, pagerInfoText, allowedPageSizes, stringFilterOperations, dateNumberFilterOperations } from '../../../devextreme/devextreme-settings';
import { appSettingsStateSelector } from '../../../redux/slices/app-settings-slice/app-settings-slice';
import { addNotification } from '../../../redux/slices/notify-slice/notify-slice';
import { loadServerSettingsThunk } from '../../../redux/slices/server-settings-slice/thunks';
import { userPermissions } from '../../../redux/slices/user-slice/user-slice';
import { AppDispatch } from '../../../redux/store';
import { dataGridRussianTexts } from '../../../utils/data-grid-russian-texts';

const CallDurationsDataGrid = () => {
  const dataGrid = React.useRef<DataGrid>(null);
  const backendSettings = useSelector(appSettingsStateSelector);

  const dataSource = React.useMemo(
    () => permittedCallDurationsDataSource(backendSettings),
    [backendSettings],
  );

  const dispatch = useDispatch<AppDispatch>();

  const {
    durationsPageEditPermitted,
    durationsPageDeletePermitted,
    auditionColumnsPermitted,
  } = useSelector(userPermissions);

  const onDataErrorOccured = React.useCallback(
    (e: EventInfo<dxDataGrid<RoleEntity, number>> & DataErrorOccurredInfo) => {
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
        allowUpdating={durationsPageEditPermitted}
        allowDeleting={durationsPageDeletePermitted}
        allowAdding={durationsPageEditPermitted}
        confirmDelete={true}
        texts={dataGridRussianTexts}
      ></Editing>
      <RemoteOperations groupPaging filtering sorting paging />
      <FilterRow
        visible={true}
        resetOperationText={'Сбросить фильтр'}
        operationDescriptions={fiterRowOperationDescriptions}
      />
      <Sorting mode={'multiple'} />
      <Selection mode={'single'} />
      <Pager
        displayMode={'full'}
        showInfo={true}
        infoText={pagerInfoText}
        showPageSizeSelector={true}
        allowedPageSizes={allowedPageSizes}
        showNavigationButtons={true}
      />
      <Paging defaultPageSize={30} defaultPageIndex={0} enabled={true} />
      <Column
        dataType={'number'}
        dataField={'duration'}
        caption={'Продолжительность (минут)'}
        allowFiltering={false}
      >
        <NumericRule />
        <RequiredRule />
      </Column>
      <Column
        dataField={'createdBy'}
        caption={'Создан (кем)'}
        dataType={'string'}
        allowReordering
        allowResizing
        filterOperations={stringFilterOperations}
        allowFiltering
        visible={auditionColumnsPermitted}
        allowEditing={false}
      ></Column>
      <Column
        dataField={'updatedBy'}
        caption={'Обновлен (кем)'}
        dataType={'string'}
        allowReordering
        allowResizing
        filterOperations={stringFilterOperations}
        allowFiltering
        visible={auditionColumnsPermitted}
        allowEditing={false}
      ></Column>
      <Column
        dataType={'datetime'}
        dataField={'createdAt'}
        caption={'Создан (когда)'}
        width={170}
        format={'dd-MM-yyyy HH:mm:ss'}
        allowHeaderFiltering={false}
        allowFiltering={true}
        allowEditing={false}
        visible={auditionColumnsPermitted}
        filterOperations={dateNumberFilterOperations}
      />
      <Column
        dataType={'datetime'}
        dataField={'updatedAt'}
        caption={'Обновлен (когда)'}
        width={170}
        format={'dd-MM-yyyy HH:mm:ss'}
        allowHeaderFiltering={false}
        allowFiltering={true}
        allowEditing={false}
        visible={auditionColumnsPermitted}
        filterOperations={dateNumberFilterOperations}
      />
    </DataGrid>
  );
};

export default CallDurationsDataGrid;
