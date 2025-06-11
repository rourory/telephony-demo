import React, { memo } from 'react';
import { DataGrid } from 'devextreme-react';
import { EventInfo } from 'devextreme/events';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../../redux/store';
import dxDataGrid, {
  CellDblClickEvent,
  DataErrorOccurredInfo,
  ExportingEvent,
} from 'devextreme/ui/data_grid';
import callsDataSource from '../../../devextreme/data-sources/calls-data-source';
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
  MasterDetail,
  SearchPanel,
  ColumnFixing,
} from 'devextreme-react/data-grid';
import contactsDataSource from '../../../devextreme/data-sources/contacts-data-source';
import relativesDataSource from '../../../devextreme/data-sources/relatives-data-source';
import convictedDataSource from '../../../devextreme/data-sources/convicted-data-source';
import administrationDataSource from '../../../devextreme/data-sources/administration-data-source';
import callResultTypesDataSource from '../../../devextreme/data-sources/result-data-source';
import { addNotification } from '../../../redux/slices/notify-slice/notify-slice';
import {
  allowedPageSizes,
  fiterRowOperationDescriptions,
  headerFilterTexts,
  dateNumberFilterOperations,
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
import CallTryingsMD from './Sub';
import { appSettingsStateSelector } from '../../../redux/slices/app-settings-slice/app-settings-slice';
import { dataGridRussianTexts } from '../../../utils/data-grid-russian-texts';
import { formatCallReport } from '../../../utils/report-exporting-utils';
import OpenIcon from '../../atoms/OpenIcon';

const calculateDuration = (rowData: CallEntity) => {
  if (rowData.callStartTime && rowData.callFinishTime) {
    const startTime = new Date(rowData.callStartTime);
    const finishTime = new Date(rowData.callFinishTime);
    const diff = finishTime.getTime() - startTime.getTime();
    const duration = new Date(diff);
    let hours = diff / 1000 / 60 / 60;
    if (hours >= 1) {
      hours = Math.floor(hours);
    }
    const minutes = duration.getMinutes();
    const seconds = duration.getSeconds();
    const result = `${hours >= 1 ? hours + ':' : ''}${
      minutes < 10 ? '0' + minutes : minutes
    }:${seconds < 10 ? '0' + seconds : seconds}`;
    return result;
  }
  return '';
};

type CallsDataGridComponentType = {
  convictedId?: number;
};

const CallsDataGrid: React.FC<CallsDataGridComponentType> = memo(
  ({ convictedId }) => {
    const dataGrid = React.useRef<DataGrid>(null);
    const backendSettings = useSelector(appSettingsStateSelector);

    const dataSource = React.useMemo(
      () => callsDataSource(backendSettings),
      [backendSettings],
    );
    const contactsDS = React.useMemo(
      () => contactsDataSource(backendSettings),
      [backendSettings],
    );
    const relativesDS = React.useMemo(
      () => relativesDataSource(backendSettings),
      [backendSettings],
    );
    const convictedDS = React.useMemo(
      () => convictedDataSource(backendSettings),
      [backendSettings],
    );
    const administrationDS = React.useMemo(
      () => administrationDataSource(backendSettings),
      [backendSettings],
    );
    const callResultTypesDS = React.useMemo(
      () => callResultTypesDataSource(backendSettings),
      [backendSettings],
    );
    const filterValue = React.useMemo(
      () => (convictedId ? ['convictedId', '=', convictedId] : undefined),
      [convictedId],
    );

    const dispatch = useDispatch<AppDispatch>();

    const onExporting = React.useCallback((e: ExportingEvent) => {
      const startDate = new Date(e.component.state().columns[4].filterValue);
      const finishDate = new Date(e.component.state().columns[5].filterValue);

      let fileName = `Статистика звонков`;
      if (startDate.getTime() > 0) {
        fileName += ` с ${startDate.toLocaleDateString()}`;
      }
      if (finishDate.getTime() > 0) {
        fileName += ` по ${finishDate.toLocaleDateString()}`;
      }

      const workbook = new Workbook();
      const worksheet = workbook.addWorksheet(fileName);
      exportDataGrid({
        component: e.component,
        worksheet,
        autoFilterEnabled: false,
      }).then(() => {
        const formattedWorkbook = formatCallReport(
          workbook,
          startDate,
          finishDate,
        );
        formattedWorkbook.xlsx.writeBuffer().then((buffer) => {
          saveAs(
            new Blob([buffer], { type: 'application/octet-stream' }),
            `${fileName}.xlsx`,
          );
        });
      });
    }, []);

    const {
      callsPageEditPermitted,
      callsPageDeletePermitted,
      convictedPageCallsDataGridEditPermitted,
      convictedPageCallsDataGridDeletePermitted,
    } = useSelector(userPermissions);

    const { user } = useSelector(userSelector);

    const onDataErrorOccured = React.useCallback(
      (
        e: EventInfo<dxDataGrid<CallEntity, number>> & DataErrorOccurredInfo,
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

    const administrationHeaderFilterData = React.useMemo(() => {
      return {
        store: administrationDS,
        map: (item: AdministrationEntity) => {
          return {
            text: `${item.username}`,
            value: item.id,
            id: item.id,
          };
        },
      };
    }, [administrationDS]);

    const callResultTypesHeaderFilterData = React.useMemo(() => {
      return {
        store: callResultTypesDS.store,
        map: (item: CallResultTypeEntity) => {
          return {
            text: `${item.callResultTypeName}`,
            value: item.id,
            id: item.id,
          };
        },
      };
    }, [callResultTypesDS.store]);

    const onCellClick = React.useCallback(
      (e: CellDblClickEvent<CallEntity, number>) => {
        if (e.column.dataField == 'play') {
          // window.electron.ipcRenderer.sendMessage(
          //   'open.video',
          //   e.data.videoPath,
          // );
        }
      },
      [],
    );

    const convictedIdLookupDisplayExpression = React.useCallback(
      (val: PersonEntity) => {
        return `${val.secondName} ${val.firstName.charAt(0)}.${
          val.middleName ? val.middleName.charAt(0) + '.' : ''
        } ${val.squadNumber} отр.`;
      },
      [],
    );

    const relativeIdLookupDisplayExpression = React.useCallback(
      (val: RelativeEntity) => `${val.secondName} ${val.firstName}`,
      [],
    );

    const contactIdLookupDisplayExpression = React.useCallback(
      (val: ContactEntity) => {
        return `${val.contactValue}`;
      },
      [],
    );

    const administrationIdLookupDisplayExpression = React.useCallback(
      (val: AdministrationEntity) => {
        return `${val.username}`;
      },
      [],
    );

    const resultIdLookupDisplayExpression = React.useCallback(
      (val: CallResultTypeEntity) => {
        return val.callResultTypeName;
      },
      [],
    );

    return (
      <DataGrid
        stateStoring={{
          enabled: true,
          type: 'localStorage',
          storageKey: `callsDataGridState.userId=${user?.id || 'default'}`,
        }}
        style={{ position: 'relative', height: '100%' }}
        ref={dataGrid}
        dataSource={dataSource}
        onDataErrorOccurred={onDataErrorOccured}
        allowColumnReordering
        filterValue={filterValue}
        onCellClick={onCellClick}
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
        <SearchPanel visible={true} placeholder={'Поиск...'} width={'30vw'} />
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
          allowUpdating={
            convictedId
              ? convictedPageCallsDataGridEditPermitted
              : callsPageEditPermitted
          }
          allowDeleting={
            convictedId
              ? convictedPageCallsDataGridDeletePermitted
              : callsPageDeletePermitted
          }
          allowAdding={
            convictedId
              ? convictedPageCallsDataGridEditPermitted
              : callsPageEditPermitted
          }
          confirmDelete={true}
          texts={dataGridRussianTexts}
        ></Editing>
        <RemoteOperations groupPaging filtering sorting paging />
        <FilterRow
          visible={true}
          resetOperationText={'Сбросить фильтр'}
          operationDescriptions={fiterRowOperationDescriptions}
        />
        <HeaderFilter visible={true} texts={headerFilterTexts} />
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
          visible={!convictedId}
          dataType={'number'}
          dataField={'convictedId'}
          caption={'Осужденный'}
          minWidth={220}
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
          fixed={true}
          fixedPosition={'left'}
          dataType={'number'}
          dataField={'relativeId'}
          caption={'Родственник'}
          minWidth={220}
          allowFiltering={false}
          allowHeaderFiltering={false}
        >
          <Lookup
            dataSource={relativesDS}
            valueExpr="id"
            displayExpr={relativeIdLookupDisplayExpression}
          />
        </Column>
        <Column
          dataType={'number'}
          dataField={'contactId'}
          caption={'Контакт'}
          minWidth={300}
          allowFiltering={true}
          allowHeaderFiltering={false}
          alignment={'center'}
        >
          <Lookup
            dataSource={contactsDS}
            valueExpr="id"
            displayExpr={contactIdLookupDisplayExpression}
          />
        </Column>
        <Column
          dataType={'number'}
          dataField={'administrationId'}
          caption={'Сотрудник'}
          minWidth={200}
          allowFiltering={false}
          allowHeaderFiltering={true}
        >
          <Lookup
            dataSource={administrationDS}
            valueExpr="id"
            displayExpr={administrationIdLookupDisplayExpression}
          />
          <HeaderFilter
            visible={true}
            dataSource={administrationHeaderFilterData}
            texts={headerFilterTexts}
          />
        </Column>
        <Column
          dataType={'datetime'}
          dataField={'callStartTime'}
          caption={'Начало звонка'}
          minWidth={180}
          format={'dd-MM-yyyy HH:mm:ss'}
          allowHeaderFiltering={false}
          allowFiltering={true}
          filterOperations={dateNumberFilterOperations}
          defaultSelectedFilterOperation={'>='}
          defaultSortOrder={'desc'}
        />

        <Column
          dataType={'datetime'}
          dataField={'callFinishTime'}
          caption={'Конец звонка'}
          minWidth={180}
          format={'dd-MM-yyyy HH:mm:ss'}
          allowHeaderFiltering={false}
          allowFiltering={true}
          filterOperations={dateNumberFilterOperations}
          defaultSelectedFilterOperation={'<='}
        />
        <Column
          caption={'Продолжительность'}
          minWidth={200}
          alignment={'center'}
          calculateCellValue={calculateDuration}
        />
        <Column
          dataType={'number'}
          dataField={'resultId'}
          caption={'Результат'}
          allowFiltering={false}
          minWidth={160}
          allowHeaderFiltering={true}
        >
          <Lookup
            dataSource={callResultTypesDS}
            valueExpr="id"
            displayExpr={resultIdLookupDisplayExpression}
          />
          <HeaderFilter
            dataSource={callResultTypesHeaderFilterData}
            texts={headerFilterTexts}
            width={350}
          />
        </Column>
        <Column
          dataType={'string'}
          dataField={'videoPath'}
          caption={'Запись разговора'}
          minWidth={700}
          allowFiltering={true}
          filterOperations={stringFilterOperations}
          allowEditing={false}
          allowHeaderFiltering={false}
        />
        <Column
          dataField={'play'}
          fixed={true}
          fixedPosition={'right'}
          caption={'Открыть'}
          width={98}
          allowEditing={false}
          cellRender={OpenIcon}
          alignment={'center'}
          allowFiltering={false}
        />
        <MasterDetail enabled={true} component={CallTryingsMD} />
      </DataGrid>
    );
  },
);

export default CallsDataGrid;
