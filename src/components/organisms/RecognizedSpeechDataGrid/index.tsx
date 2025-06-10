import React, { memo } from 'react';
import { DataGrid } from 'devextreme-react';
import { EventInfo } from 'devextreme/events';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../../redux/store';
import dxDataGrid, {
  DataErrorOccurredInfo,
  ExportingEvent,
} from 'devextreme/ui/data_grid';
import {
  Editing,
  FilterRow,
  RemoteOperations,
  Sorting,
  Pager,
  Paging,
  Selection,
  Column,
  Lookup,
  HeaderFilter,
  Export,
  SearchPanel,
  ColumnFixing,
} from 'devextreme-react/data-grid';
import convictedDataSource from '../../../devextreme/data-sources/convicted-data-source';
import { addNotification } from '../../../redux/slices/notify-slice/notify-slice';
import {
  allowedPageSizes,
  fiterRowOperationDescriptions,
  dateNumberFilterOperations,
  pagerInfoText,
  stringFilterOperations,
  headerFilterTexts,
} from '../../../devextreme/devextreme-settings';
import {
  userPermissions,
  userSelector,
} from '../../../redux/slices/user-slice/user-slice';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver-es';
import { exportDataGrid } from 'devextreme/excel_exporter';
import recognizedSpeechDataSource from '../../../devextreme/data-sources/recognized_speech_data_source';
import { appSettingsStateSelector } from '../../../redux/slices/app-settings-slice/app-settings-slice';
import { dataGridRussianTexts } from '../../../utils/data-grid-russian-texts';

const onExporting = (e: ExportingEvent) => {
  const workbook = new Workbook();
  const worksheet = workbook.addWorksheet(
    `Разговоры осужденного на ${new Date().toLocaleDateString()}`,
  );
  exportDataGrid({
    component: e.component,
    worksheet,
    autoFilterEnabled: false,
  }).then(() => {
    workbook.xlsx.writeBuffer().then((buffer) => {
      saveAs(
        new Blob([buffer], { type: 'application/octet-stream' }),
        `Разговоры осужденного на ${new Date().toLocaleDateString()}.xlsx`,
      );
    });
  });
};

type RecognizedSpeechDataGridComponentType = {
  convictedId?: number;
  editPermitted?: boolean;
  deletePermitted?: boolean;
};

const RecognizedSpeechDataGrid: React.FC<RecognizedSpeechDataGridComponentType> =
  memo(({ convictedId, editPermitted = false, deletePermitted = false }) => {
    const dataGrid = React.useRef<DataGrid>(null);
    const backendSettings = useSelector(appSettingsStateSelector);

    const { user } = useSelector(userSelector);

    const dataSource = React.useMemo(
      () => recognizedSpeechDataSource(backendSettings),
      [backendSettings],
    );

    const convictedDS = React.useMemo(
      () => convictedDataSource(backendSettings),
      [backendSettings],
    );

    const convictedIdLookupDisplayExpression = React.useCallback(
      (val: PersonEntity) => {
        return `${val.secondName} ${val.firstName.charAt(0)}.${
          val.middleName ? val.middleName.charAt(0) + '.' : ''
        } ${val.squadNumber} отр.`;
      },
      [],
    );

    const filterValue = React.useMemo(
      () => (convictedId ? ['convictedId', '=', convictedId] : undefined),
      [convictedId],
    );

    const dispatch = useDispatch<AppDispatch>();

    const { auditionColumnsPermitted } = useSelector(userPermissions);

    const onDataErrorOccured = React.useCallback(
      (
        e: EventInfo<dxDataGrid<ReconizedSpeechEntity, number>> &
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
        stateStoring={{
          enabled: convictedId ? false : true,
          type: 'localStorage',
          storageKey: `recSpDataGridState.userId=${user?.id || 'default'}`,
        }}
        style={{ position: 'relative', height: '100%' }}
        ref={dataGrid}
        dataSource={dataSource}
        onDataErrorOccurred={onDataErrorOccured}
        allowColumnReordering
        filterValue={filterValue}
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
        <SearchPanel
          visible={convictedId == null ? true : false}
          placeholder={'Поиск...'}
          width={'30vw'}
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
          allowUpdating={editPermitted}
          allowDeleting={deletePermitted}
          allowAdding={editPermitted}
          confirmDelete={true}
          texts={dataGridRussianTexts}
        ></Editing>
        <RemoteOperations groupPaging filtering sorting paging />
        <FilterRow
          visible={true}
          resetOperationText={'Сбросить фильтр'}
          operationDescriptions={fiterRowOperationDescriptions}
        />
        <HeaderFilter visible={!convictedId} texts={headerFilterTexts} />
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
        <Paging defaultPageSize={20} defaultPageIndex={0} enabled={true} />
        <Column
          fixed={true}
          fixedPosition={'left'}
          dataField={'id'}
          caption={'№ п/п'}
          dataType={'number'}
          minWidth={100}
          filterOperations={dateNumberFilterOperations}
          allowFiltering={true}
          allowHeaderFiltering={false}
          allowEditing={false}
        ></Column>
        <Column
          fixed={true}
          fixedPosition={'left'}
          visible={convictedId == null ? true : false}
          dataType={'number'}
          dataField={'convictedId'}
          caption={'Осужденный'}
          minWidth={240}
          allowFiltering={false}
          allowHeaderFiltering={true}
        >
          <HeaderFilter
            visible={true}
            allowSearch={true}
            dataSource={convictedDS}
            width={500}
            height={500}
          />
          <Lookup
            dataSource={convictedDS}
            valueExpr="id"
            displayExpr={convictedIdLookupDisplayExpression}
          />
        </Column>
        <Column
          dataType={'number'}
          dataField={'callId'}
          caption={'Звонок'}
          allowFiltering={true}
          allowHeaderFiltering={false}
          visible={false}
        ></Column>
        <Column
          dataField={'convictedSaid'}
          caption={'Осужденный сказал'}
          dataType={'string'}
          allowReordering
          minWidth={600}
          filterOperations={stringFilterOperations}
          allowFiltering
          allowHeaderFiltering={false}
        ></Column>
        <Column
          dataField={'relativeSaid'}
          caption={'Собеседник сказал'}
          dataType={'string'}
          allowReordering
          minWidth={600}
          filterOperations={stringFilterOperations}
          allowFiltering
          allowHeaderFiltering={false}
        ></Column>
        <Column
          dataType={'datetime'}
          dataField={'createdAt'}
          caption={'Создан (когда)'}
          minWidth={170}
          format={'dd-MM-yyyy HH:mm:ss'}
          allowHeaderFiltering={false}
          allowFiltering={true}
          allowEditing={false}
          filterOperations={dateNumberFilterOperations}
          defaultSortOrder={'asc'}
        />
        <Column
          dataType={'datetime'}
          dataField={'updatedAt'}
          caption={'Обновлен (когда)'}
          minWidth={170}
          format={'dd-MM-yyyy HH:mm:ss'}
          allowHeaderFiltering={false}
          allowFiltering={true}
          allowEditing={false}
          visible={auditionColumnsPermitted}
          filterOperations={dateNumberFilterOperations}
        />
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
      </DataGrid>
    );
  });

export default RecognizedSpeechDataGrid;
