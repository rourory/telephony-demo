import React from 'react';
import dxDataGrid, {
  DataErrorOccurredInfo,
  ExportingEvent,
} from 'devextreme/ui/data_grid';
import { Workbook } from 'exceljs';
import { exportDataGrid } from 'devextreme/excel_exporter';
import { useDispatch, useSelector } from 'react-redux';
import { DataGrid } from 'devextreme-react';
import {
  Column,
  Editing,
  FilterRow,
  Pager,
  Paging,
  SearchPanel,
  Sorting,
  Selection,
  RemoteOperations,
  Export,
  Lookup,
  HeaderFilter,
  ColumnFixing,
} from 'devextreme-react/data-grid';
import { EventInfo } from 'devextreme/events';
import { saveAs } from 'file-saver-es';
import contactsAudDataSource from '../../../../devextreme/data-sources/audition/contacts-aud-data-source';
import enversActionsDataSource from '../../../../devextreme/data-sources/audition/envers-actions-data-sourse';
import contactTypesDataSource from '../../../../devextreme/data-sources/contact-types-data-source';
import { headerFilterTexts, fiterRowOperationDescriptions, pagerInfoText, allowedPageSizes, dateNumberFilterOperations, stringFilterOperations } from '../../../../devextreme/devextreme-settings';
import { appSettingsStateSelector } from '../../../../redux/slices/app-settings-slice/app-settings-slice';
import { addNotification } from '../../../../redux/slices/notify-slice/notify-slice';
import { AppDispatch } from '../../../../redux/store';
import { dataGridRussianTexts } from '../../../../utils/data-grid-russian-texts';

const onExporting = (e: ExportingEvent) => {
  const workbook = new Workbook();
  const worksheet = workbook.addWorksheet(
    `История изменений контактов на ${new Date().toDateString()}`,
  );

  exportDataGrid({
    component: e.component,
    worksheet,
    autoFilterEnabled: true,
  }).then(() => {
    workbook.xlsx.writeBuffer().then((buffer) => {
      saveAs(
        new Blob([buffer], { type: 'application/octet-stream' }),
        `История изменений контактов на ${new Date().toDateString()}.xlsx`,
      );
    });
  });
};

const ContactsAudDataGrid = () => {
  const dispatch = useDispatch<AppDispatch>();
  const backendSettings = useSelector(appSettingsStateSelector);

  const dataGrid = React.useRef<DataGrid>(null);

  const dataSource = React.useMemo(
    () => contactsAudDataSource(backendSettings),
    [backendSettings],
  );
  const ctDataSource = React.useMemo(
    () => contactTypesDataSource(backendSettings),
    [backendSettings],
  );

  const eaDataSource = React.useMemo(
    () => enversActionsDataSource(backendSettings),
    [backendSettings],
  );

  const onDataErrorOccured = React.useCallback(
    (
      e: EventInfo<dxDataGrid<ContactsAudEntity, number>> &
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

  return (
    <DataGrid
      style={{ position: 'relative', height: '100%' }}
      ref={dataGrid}
      dataSource={dataSource}
      onDataErrorOccurred={onDataErrorOccured}
      onExporting={onExporting}
    >
      <HeaderFilter visible={true} texts={headerFilterTexts} />
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
        allowUpdating={false}
        allowDeleting={false}
        allowAdding={false}
        confirmDelete={true}
        texts={dataGridRussianTexts}
      ></Editing>
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
        caption={'Информация о транзакции'}
        fixed={true}
        fixedPosition={'left'}
      >
        <Column
          dataField={'id'}
          caption={'ID записи'}
          dataType={'number'}
          minWidth={110}
          allowReordering
          allowResizing
          filterOperations={dateNumberFilterOperations}
          allowFiltering
          allowHeaderFiltering={false}
        ></Column>
        <Column
          dataField={'rev'}
          caption={'№ транзацкии'}
          dataType={'number'}
          minWidth={80}
          allowReordering
          allowResizing
          filterOperations={dateNumberFilterOperations}
          allowFiltering
          allowHeaderFiltering={false}
        ></Column>
        <Column
          dataField={'revtype'}
          caption={'Действие'}
          minWidth={150}
          dataType={'string'}
          allowReordering
          allowResizing
          filterOperations={stringFilterOperations}
          allowFiltering={false}
          allowHeaderFiltering={true}
        >
          <HeaderFilter
            visible={true}
            dataSource={eaDataSource}
            width={500}
            height={300}
          />
          <Lookup
            dataSource={eaDataSource}
            valueExpr="actionTypeNumber"
            displayExpr="actionTypeName"
          />
        </Column>
        <Column
          dataField={'revision.username'}
          caption={'Кем совершена'}
          minWidth={200}
          dataType={'ыекштп'}
          allowReordering
          allowResizing
          filterOperations={stringFilterOperations}
          allowFiltering
          allowHeaderFiltering={false}
        ></Column>
        <Column
          dataType={'datetime'}
          dataField={'revision.revtstmp'}
          caption={'Когда совершена'}
          minWidth={170}
          format={'dd-MM-yyyy HH:mm:ss'}
          allowFiltering={true}
          allowEditing={false}
          filterOperations={dateNumberFilterOperations}
          allowHeaderFiltering={false}
        />
      </Column>
      <Column caption={'Значения строки'}>
        <Column
          dataField={'contactValue'}
          caption={'Контакт'}
          dataType={'string'}
          allowReordering
          allowResizing
          filterOperations={stringFilterOperations}
          allowFiltering
          allowHeaderFiltering={false}
          minWidth={170}
        ></Column>
        <Column
          dataType={'number'}
          dataField={'contactTypeId'}
          caption={'Способ связи'}
          allowFiltering={false}
          allowHeaderFiltering={false}
          minWidth={170}
        >
          <Lookup
            dataSource={ctDataSource}
            valueExpr="id"
            displayExpr="contactTypeName"
          />
        </Column>
        <Column
          dataField={'frozen'}
          caption={'Приостановлено'}
          dataType={'boolean'}
          allowReordering
          allowResizing
          allowFiltering
          allowHeaderFiltering={false}
          minWidth={170}
        ></Column>
        <Column
          dataField={'createdBy'}
          caption={'Создан (кем)'}
          dataType={'string'}
          allowReordering
          allowResizing
          filterOperations={stringFilterOperations}
          allowFiltering
          allowEditing={false}
          allowHeaderFiltering={false}
          minWidth={170}
        ></Column>
        <Column
          dataField={'updatedBy'}
          caption={'Обновлен (кем)'}
          dataType={'string'}
          allowReordering
          allowResizing
          filterOperations={stringFilterOperations}
          allowFiltering
          allowEditing={false}
          allowHeaderFiltering={false}
          minWidth={170}
        ></Column>
        <Column
          dataType={'datetime'}
          dataField={'createdAt'}
          caption={'Создан (когда)'}
          minWidth={170}
          format={'dd-MM-yyyy HH:mm:ss'}
          allowFiltering={true}
          allowEditing={false}
          filterOperations={dateNumberFilterOperations}
          allowHeaderFiltering={false}
        />
        <Column
          dataType={'datetime'}
          dataField={'updatedAt'}
          caption={'Обновлен (когда)'}
          minWidth={170}
          format={'dd-MM-yyyy HH:mm:ss'}
          allowFiltering={true}
          allowEditing={false}
          filterOperations={dateNumberFilterOperations}
          allowHeaderFiltering={false}
        />
      </Column>
    </DataGrid>
  );
};

export default ContactsAudDataGrid;
