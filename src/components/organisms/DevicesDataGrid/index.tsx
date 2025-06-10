import { DataGrid } from 'devextreme-react';
import React from 'react';
import { EventInfo } from 'devextreme/events';
import dxDataGrid, { DataErrorOccurredInfo } from 'devextreme/ui/data_grid';
import devicesDataSource from '../../../devextreme/data-sources/devices-data-sources';
import {
  FilterRow,
  RemoteOperations,
  Editing,
  SearchPanel,
  Sorting,
  Selection,
  Pager,
  Paging,
  Column,
  RequiredRule,
  NumericRule,
  PatternRule,
  ColumnFixing,
} from 'devextreme-react/data-grid';
import { addNotification } from '../../../redux/slices/notify-slice/notify-slice';
import { AppDispatch } from '../../../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import {
  allowedPageSizes,
  dateNumberFilterOperations,
  fiterRowOperationDescriptions,
  pagerInfoText,
  stringFilterOperations,
} from '../../../devextreme/devextreme-settings';
import { userPermissions } from '../../../redux/slices/user-slice/user-slice';
import { appSettingsStateSelector } from '../../../redux/slices/app-settings-slice/app-settings-slice';
import { loadDevicesThunk } from '../../../redux/slices/devices-slice/subthunks/load-devices-thunk';
import { dataGridRussianTexts } from '../../../utils/data-grid-russian-texts';

const DevicesDataGrid = () => {
  const dispatch = useDispatch<AppDispatch>();
  const dataGrid = React.useRef<DataGrid>(null);
  const backendSettings = useSelector(appSettingsStateSelector);

  const dataSource = React.useMemo(
    () => devicesDataSource(backendSettings),
    [backendSettings],
  );

  const { devicesPageEditPermitted, devicesPageDeletePermitted } =
    useSelector(userPermissions);

  const onDataErrorOccured = React.useCallback(
    (
      e: EventInfo<dxDataGrid<DeviceEntity, number>> & DataErrorOccurredInfo,
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
    dispatch(loadDevicesThunk(backendSettings));
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
      onRowUpdated={onRowUpdated}
      onRowInserted={onRowUpdated}
      onRowRemoved={onRowUpdated}
    >
      <ColumnFixing
        enabled={true}
        texts={{
          fix: 'Зафиксировать',
          unfix: 'Восстановить фиксацию',
          leftPosition: 'Слева',
          rightPosition: 'Справа',
        }}
      />
      <Editing
        useIcons
        mode={'row'}
        allowUpdating={devicesPageEditPermitted}
        allowDeleting={devicesPageDeletePermitted}
        allowAdding={devicesPageEditPermitted}
        confirmDelete={true}
        texts={dataGridRussianTexts}
      />
      <RemoteOperations groupPaging filtering sorting paging />
      <FilterRow
        visible={true}
        resetOperationText={'Сбросить фильтр'}
        operationDescriptions={fiterRowOperationDescriptions}
      />
      <SearchPanel visible={true} placeholder={'Поиск...'} width={'30vw'} />
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
        fixed={true}
        fixedPosition={'left'}
        dataField={'number'}
        caption={'Номер'}
        dataType={'number'}
        allowReordering
        minWidth={100}
        filterOperations={dateNumberFilterOperations}
        allowFiltering
      >
        <NumericRule />
        <RequiredRule message={'Обязательное поле'} />
      </Column>
      <Column
        fixed={true}
        fixedPosition={'left'}
        dataField={'ip'}
        caption={'Сетевой адрес'}
        dataType={'string'}
        allowReordering
        minWidth={150}
        filterOperations={stringFilterOperations}
        allowFiltering
      >
        <PatternRule
          pattern={/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/}
          message={'Сетевой адрес должен соответствовать шаблону IP'}
        />
        <RequiredRule message={'Обязательное поле'} />
      </Column>
      <Column
        dataField={'devicePassword'}
        caption={'Пароль'}
        dataType={'string'}
        allowReordering
        minWidth={120}
        filterOperations={stringFilterOperations}
        allowFiltering
      >
        <RequiredRule message={'Обязательное поле'} />
      </Column>
      <Column
        dataField={'recordingServiceVideoPath'}
        caption={'Путь для записи видео'}
        dataType={'string'}
        allowReordering
        minWidth={220}
        filterOperations={stringFilterOperations}
        allowFiltering
      >
        <RequiredRule message={'Обязательное поле'} />
      </Column>
      <Column
        dataField={'vncUsername'}
        caption={'Имя пользователя VNC'}
        dataType={'string'}
        allowReordering
        minWidth={220}
        filterOperations={stringFilterOperations}
        allowFiltering
      >
        <RequiredRule message={'Обязательное поле'} />
      </Column>
      <Column
        dataField={'vncPassword'}
        caption={'Пароль VNC'}
        dataType={'string'}
        allowReordering
        minWidth={150}
        filterOperations={stringFilterOperations}
        allowFiltering
      >
        <RequiredRule message={'Обязательное поле'} />
      </Column>
      <Column
        dataField={'vncViewOnly'}
        caption={'VNC ViewOnly'}
        dataType={'boolean'}
        allowReordering
        minWidth={130}
        allowFiltering={false}
      ></Column>
      <Column
        dataField={'speechRecognizingEnabled'}
        caption={'Сервис распознавания голоса'}
        dataType={'boolean'}
        allowReordering
        minWidth={130}
        allowFiltering={false}
      ></Column>
      <Column
        dataField={'vncServicePort'}
        caption={'Порт сервиса VNC'}
        dataType={'number'}
        allowReordering
        minWidth={170}
        filterOperations={dateNumberFilterOperations}
        allowFiltering
      >
        <NumericRule />
        <RequiredRule message={'Обязательное поле'} />
      </Column>
      <Column
        dataField={'recordingServicePort'}
        caption={'Порт сервиса записи видео экрана'}
        dataType={'number'}
        allowReordering
        minWidth={280}
        filterOperations={dateNumberFilterOperations}
        allowFiltering
      >
        <NumericRule />
        <RequiredRule message={'Обязательное поле'} />
      </Column>
      <Column
        dataField={'audioStreamingServicePort'}
        caption={'Порт сервиса прослушки аудио'}
        dataType={'number'}
        allowReordering
        minWidth={280}
        filterOperations={dateNumberFilterOperations}
        allowFiltering
      >
        <NumericRule />
        <RequiredRule message={'Обязательное поле'} />
      </Column>
      <Column
        dataField={'speechStreamingServicePort'}
        caption={'Порт сервиса голосовой связи'}
        dataType={'number'}
        allowReordering
        minWidth={280}
        filterOperations={dateNumberFilterOperations}
        allowFiltering
      >
        <NumericRule />
        <RequiredRule message={'Обязательное поле'} />
      </Column>
      <Column
        dataField={'uiControllingServicePort'}
        caption={'Порт сервиса контроля UI'}
        dataType={'number'}
        allowReordering
        minWidth={280}
        filterOperations={dateNumberFilterOperations}
        allowFiltering
      >
        <NumericRule />
        <RequiredRule message={'Обязательное поле'} />
      </Column>
      <Column
        dataField={'powerManagementServicePort'}
        caption={'Порт сервиса менеджмента питания'}
        dataType={'number'}
        allowReordering
        minWidth={280}
        filterOperations={dateNumberFilterOperations}
        allowFiltering
      >
        <NumericRule />
        <RequiredRule message={'Обязательное поле'} />
      </Column>
      <Column
        dataField={'speechRecognitionServicePort'}
        caption={'Порт сервиса распознавания речи'}
        dataType={'number'}
        allowReordering
        minWidth={280}
        filterOperations={dateNumberFilterOperations}
        allowFiltering
      >
        <NumericRule />
        <RequiredRule message={'Обязательное поле'} />
      </Column>
    </DataGrid>
  );
};

export default DevicesDataGrid;
