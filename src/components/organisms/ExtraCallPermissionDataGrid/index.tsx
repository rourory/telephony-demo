import { DataGrid } from 'devextreme-react';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
  Texts,
  RemoteOperations,
  Lookup,
  HeaderFilter,
  Export,
  ColumnFixing,
} from 'devextreme-react/data-grid';
import { DataErrorOccurredInfo } from 'devextreme/common/grids';
import dxDataGrid, { ExportingEvent } from 'devextreme/ui/data_grid';
import { EventInfo } from 'devextreme/events';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver-es';
import { exportDataGrid } from 'devextreme/excel_exporter';
import permittedCallDurationsDataSource from '../../../devextreme/data-sources/call-duration-data-source';
import convictedDataSource from '../../../devextreme/data-sources/convicted-data-source';
import extraCallPermissionsDataSource from '../../../devextreme/data-sources/extra-call-permissions-data-source';
import { headerFilterTexts, fiterRowOperationDescriptions, pagerInfoText, allowedPageSizes, dateNumberFilterOperations, stringFilterOperations } from '../../../devextreme/devextreme-settings';
import { appSettingsStateSelector } from '../../../redux/slices/app-settings-slice/app-settings-slice';
import { addNotification } from '../../../redux/slices/notify-slice/notify-slice';
import { userPermissions } from '../../../redux/slices/user-slice/user-slice';
import { AppDispatch } from '../../../redux/store';
import { dataGridRussianTexts } from '../../../utils/data-grid-russian-texts';

const ExtraCallPermissionDataGrid = () => {
  const dispatch = useDispatch<AppDispatch>();
  const backendSettings = useSelector(appSettingsStateSelector);

  const dataGrid = React.useRef<DataGrid>(null);
  const dataSource = React.useMemo(
    () => extraCallPermissionsDataSource(backendSettings),
    [backendSettings],
  );

  const convictedDS = React.useMemo(
    () => convictedDataSource(backendSettings),
    [backendSettings],
  );

  const permittedDurationsDS = React.useMemo(
    () => permittedCallDurationsDataSource(backendSettings),
    [backendSettings],
  );

  const {
    extraCallPageEditPermitted,
    extraCallPageDeletePermitted,
    auditionColumnsPermitted,
  } = useSelector(userPermissions);

  const convictedIdLookupDisplayExpression = React.useCallback(
    (val: PersonEntity) => {
      return `${val.secondName} ${val.firstName.charAt(0)}.${
        val.middleName ? val.middleName.charAt(0) + '.' : ''
      } ${val.squadNumber} отр.`;
    },
    [],
  );

  const durationLookupDisplayExpression = React.useCallback(
    (val: PermittedCallDurationEntity) => {
      return `${val.duration}`;
    },
    [],
  );

  const onDataErrorOccured = React.useCallback(
    (
      e: EventInfo<dxDataGrid<ExtraCallPermissionEntity, number>> &
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

  const onExporting = (e: ExportingEvent) => {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet(
      `Дополнительные звонки и замены КС на ${new Date().toLocaleDateString()}`,
    );
    exportDataGrid({
      component: e.component,
      worksheet,
      autoFilterEnabled: false,
    }).then(() => {
      workbook.xlsx.writeBuffer().then((buffer) => {
        saveAs(
          new Blob([buffer], { type: 'application/octet-stream' }),
          `Дополнительные звонки и замены КС на ${new Date().toLocaleDateString()}.xlsx`,
        );
      });
    });
  };

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
        allowUpdating={extraCallPageEditPermitted}
        allowDeleting={extraCallPageDeletePermitted}
        allowAdding={extraCallPageEditPermitted}
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
        fixed={true}
        fixedPosition={'left'}
        dataField={'id'}
        caption={'Порядок добавления'}
        dataType={'number'}
        allowReordering
        allowResizing
        minWidth={200}
        filterOperations={dateNumberFilterOperations}
        allowFiltering={true}
        allowEditing={false}
        allowHeaderFiltering={false}
      ></Column>
      <Column
        fixed={true}
        fixedPosition={'left'}
        dataField={'convictedId'}
        caption={'Осужденный'}
        dataType={'number'}
        minWidth={300}
        allowReordering
        allowResizing
        allowFiltering={true}
        allowHeaderFiltering={true}
      >
        <Lookup
          dataSource={convictedDS}
          valueExpr="id"
          displayExpr={convictedIdLookupDisplayExpression}
        />
        <HeaderFilter
          visible={true}
          allowSearch={true}
          dataSource={convictedDS}
          width={500}
          height={500}
        />
        <RequiredRule message={'Обязательное поле'} />
      </Column>
      <Column
        dataField={'duration.id'}
        caption={'Продолжительность'}
        dataType={'number'}
        allowReordering
        allowResizing
        allowFiltering={false}
        minWidth={150}
        allowHeaderFiltering={false}
      >
        <Lookup
          dataSource={permittedDurationsDS}
          valueExpr="id"
          displayExpr={durationLookupDisplayExpression}
        />
        <RequiredRule message={'Обязательное поле'} />
      </Column>
      <Column
        dataField={'commitingDate'}
        caption={'Дата осуществления'}
        dataType={'datetime'}
        allowReordering
        allowResizing
        filterOperations={dateNumberFilterOperations}
        allowEditing={false}
        allowFiltering
        minWidth={220}
        allowHeaderFiltering={false}
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
        minWidth={220}
        allowHeaderFiltering={false}
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
        minWidth={220}
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
        visible={true}
        filterOperations={dateNumberFilterOperations}
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
    </DataGrid>
  );
};

export default ExtraCallPermissionDataGrid;
