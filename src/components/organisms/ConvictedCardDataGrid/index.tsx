import { DataGrid } from 'devextreme-react';
import {
  Column,
  Editing,
  FilterRow,
  Pager,
  Paging,
  RequiredRule,
  SearchPanel,
  Sorting,
  Selection,
  RemoteOperations,
  MasterDetail,
  Export,
  NumericRule,
  ColumnFixing,
} from 'devextreme-react/data-grid';
import React from 'react';
import { EventInfo } from 'devextreme/events';
import dxDataGrid, {
  DataErrorOccurredInfo,
  ExportingEvent,
} from 'devextreme/ui/data_grid';
import convictedDataSource from '../../../devextreme/data-sources/convicted-data-source';
import { TabbedDetails } from './Details';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../../redux/store';
import { addNotification } from '../../../redux/slices/notify-slice/notify-slice';
import {
  allowedPageSizes,
  dateNumberFilterOperations,
  fiterRowOperationDescriptions,
  pagerInfoText,
  stringFilterOperations,
} from '../../../devextreme/devextreme-settings';
import {
  userPermissions,
  userSelector,
} from '../../../redux/slices/user-slice/user-slice';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver-es';
import { exportDataGrid } from 'devextreme/excel_exporter';
import { appSettingsStateSelector } from '../../../redux/slices/app-settings-slice/app-settings-slice';
import { dataGridRussianTexts } from '../../../utils/data-grid-russian-texts';

const onExporting = (e: ExportingEvent) => {
  const workbook = new Workbook();
  const worksheet = workbook.addWorksheet(
    `Карточки осужденных на ${new Date().toDateString()}`,
  );

  exportDataGrid({
    component: e.component,
    worksheet,
    autoFilterEnabled: true,
  }).then(() => {
    workbook.xlsx.writeBuffer().then((buffer) => {
      saveAs(
        new Blob([buffer], { type: 'application/octet-stream' }),
        `Карточки осужденных на ${new Date().toDateString()}.xlsx`,
      );
    });
  });
};

const ConvictedCardDataGrid = () => {
  const dispatch = useDispatch<AppDispatch>();
  const backendSettings = useSelector(appSettingsStateSelector);
  const { user } = useSelector(userSelector);
  const dataGrid = React.useRef<DataGrid>(null);
  const dataSource = React.useMemo(
    () => convictedDataSource(backendSettings),
    [backendSettings],
  );
  const {
    convictedPageEditPermitted,
    convictedPageDeletePermitted,
    auditionColumnsPermitted,
  } = useSelector(userPermissions);

  const onDataErrorOccured = React.useCallback(
    (
      e: EventInfo<dxDataGrid<PersonEntity, number>> & DataErrorOccurredInfo,
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

  return (
    <DataGrid
      stateStoring={{
        enabled: true,
        type: 'localStorage',
        storageKey: `convDataGridState.userId=${user?.id || 'default'}`,
      }}
      style={{ position: 'relative', height: '100%' }}
      ref={dataGrid}
      dataSource={dataSource}
      onDataErrorOccurred={onDataErrorOccured}
      onExporting={onExporting}
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
      <Export
        enabled={true}
        allowExportSelectedData={true}
        texts={{
          exportAll: 'Экспортировать все',
          exportSelectedRows: 'Экспортировать выделенные',
        }}
      />
      <Editing
        useIcons
        mode={'row'}
        allowUpdating={convictedPageEditPermitted}
        allowDeleting={convictedPageDeletePermitted}
        allowAdding={convictedPageEditPermitted}
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
        dataField={'personalFileNumber'}
        caption={'№ л/д'}
        dataType={'number'}
        allowReordering
        allowResizing
        filterOperations={dateNumberFilterOperations}
        allowFiltering
        minWidth={180}
      >
        <NumericRule />
        <RequiredRule message={'Обязательное поле'} />
      </Column>
      <Column
        fixed={true}
        fixedPosition={'left'}
        dataField={'secondName'}
        caption={'Фамилия'}
        dataType={'string'}
        allowReordering
        allowResizing
        filterOperations={stringFilterOperations}
        allowFiltering
        minWidth={180}
      >
        <RequiredRule message={'Обязательное поле'} />
      </Column>
      <Column
        fixed={true}
        fixedPosition={'left'}
        dataField={'firstName'}
        caption={'Имя'}
        dataType={'string'}
        allowReordering
        allowResizing
        filterOperations={stringFilterOperations}
        allowFiltering
        minWidth={180}
      >
        <RequiredRule message={'Обязательное поле'} />
      </Column>
      <Column
        fixed={true}
        fixedPosition={'left'}
        dataField={'middleName'}
        caption={'Отчество'}
        dataType={'string'}
        allowReordering
        allowResizing
        filterOperations={stringFilterOperations}
        allowFiltering
        minWidth={180}
      ></Column>
      <Column
        dataField={'squadNumber'}
        caption={'Отряд'}
        dataType={'number'}
        allowReordering
        allowResizing
        filterOperations={dateNumberFilterOperations}
        allowFiltering
        minWidth={150}
      >
        <NumericRule />
        <RequiredRule message={'Обязательное поле'} />
      </Column>
      <Column
        dataField={'isUnderControl'}
        caption={'Контроль'}
        dataType={'boolean'}
        allowReordering
        allowResizing
        allowFiltering={false}
        minWidth={150}
      ></Column>
      <Column
        dataField={'archived'}
        caption={'Архив'}
        dataType={'boolean'}
        allowReordering
        allowResizing
        allowFiltering={false}
        minWidth={150}
      ></Column>
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
        minWidth={200}
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
        minWidth={200}
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
        minWidth={200}
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
        minWidth={200}
      />
      <MasterDetail enabled={true} component={TabbedDetails} />
    </DataGrid>
  );
};

export default ConvictedCardDataGrid;
