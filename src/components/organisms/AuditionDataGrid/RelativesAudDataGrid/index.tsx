import React from "react";
import dxDataGrid, {
  DataErrorOccurredInfo,
  ExportingEvent,
} from "devextreme/ui/data_grid";
import { Workbook } from "exceljs";
import { saveAs } from "file-saver-es";
import { exportDataGrid } from "devextreme/excel_exporter";
import { useDispatch, useSelector } from "react-redux";
import { DataGrid } from "devextreme-react";
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
} from "devextreme-react/data-grid";
import { EventInfo } from "devextreme/events";
import enversActionsDataSource from "../../../../devextreme/data-sources/audition/envers-actions-data-sourse";
import relativesAudDataSource from "../../../../devextreme/data-sources/audition/relatives-aud-data-source";
import relationTypesDataSource from "../../../../devextreme/data-sources/relation-types-data-source";
import {
  headerFilterTexts,
  fiterRowOperationDescriptions,
  pagerInfoText,
  allowedPageSizes,
  dateNumberFilterOperations,
  stringFilterOperations,
} from "../../../../devextreme/devextreme-settings";
import { appSettingsStateSelector } from "../../../../redux/slices/app-settings-slice/app-settings-slice";
import { addNotification } from "../../../../redux/slices/notify-slice/notify-slice";
import { AppDispatch } from "../../../../redux/store";
import { dataGridRussianTexts } from "../../../../utils/data-grid-russian-texts";
import revInfoDataSource from "../../../../devextreme/data-sources/audition/rev-info-data-sourse";

const onExporting = (e: ExportingEvent) => {
  const workbook = new Workbook();
  const worksheet = workbook.addWorksheet(
    `История изменений данных родственников на ${new Date().toDateString()}`
  );

  exportDataGrid({
    component: e.component,
    worksheet,
    autoFilterEnabled: true,
  }).then(() => {
    workbook.xlsx.writeBuffer().then((buffer) => {
      saveAs(
        new Blob([buffer], { type: "application/octet-stream" }),
        `История изменений данных родственников на ${new Date().toDateString()}.xlsx`
      );
    });
  });
};

const RelativesAudDataGrid = () => {
  const dispatch = useDispatch<AppDispatch>();
  const backendSettings = useSelector(appSettingsStateSelector);

  const dataGrid = React.useRef<DataGrid>(null);

  const dataSource = React.useMemo(
    () => relativesAudDataSource(backendSettings),
    [backendSettings]
  );

  const rtDataSource = React.useMemo(
    () => relationTypesDataSource(backendSettings),
    [backendSettings]
  );

  const eaDataSource = React.useMemo(
    () => enversActionsDataSource(backendSettings),
    [backendSettings]
  );

  const revInfoDS = React.useMemo(
    () => revInfoDataSource(backendSettings),
    [backendSettings]
  );

  const revUsernameLookupDisplayExpression = React.useCallback(
    (val: Revision) => {
      return `${val.username}`;
    },
    []
  );

  const revTimestampLookupDisplayExpression = React.useCallback(
    (val: Revision) => {
      return new Date(val.revtstmp);
    },
    []
  );

  const onDataErrorOccured = React.useCallback(
    (
      e: EventInfo<dxDataGrid<RelativesAudEntity, number>> &
        DataErrorOccurredInfo
    ) => {
      dispatch(
        addNotification({
          type: "error",
          message: e.error?.message || "Неожиданная ошибка",
        })
      );
    },
    []
  );

  return (
    <DataGrid
      style={{ position: "relative", height: "100%" }}
      ref={dataGrid}
      dataSource={dataSource}
      onDataErrorOccurred={onDataErrorOccured}
      onExporting={onExporting}
    >
      <HeaderFilter visible={true} texts={headerFilterTexts} />
      <ColumnFixing
        enabled={true}
        texts={{
          fix: "Зафиксировать",
          unfix: "Восстановить фиксацию",
          leftPosition: "Слева",
          rightPosition: "Справа",
        }}
      />
      <Export
        enabled={true}
        allowExportSelectedData={true}
        texts={{
          exportAll: "Экспортировать все",
          exportSelectedRows: "Экспортировать выделенные",
        }}
      />
      <Editing
        useIcons
        mode={"row"}
        allowUpdating={false}
        allowDeleting={false}
        allowAdding={false}
        confirmDelete={true}
        texts={dataGridRussianTexts}
      ></Editing>
      <RemoteOperations groupPaging filtering sorting paging />
      <FilterRow
        visible={true}
        resetOperationText={"Сбросить фильтр"}
        operationDescriptions={fiterRowOperationDescriptions}
      />
      <SearchPanel visible={true} placeholder={"Поиск..."} width={"30vw"} />
      <Sorting mode={"multiple"} />
      <Selection mode={"single"} />
      <Pager
        displayMode={"full"}
        showInfo={true}
        infoText={pagerInfoText}
        showPageSizeSelector={true}
        allowedPageSizes={allowedPageSizes}
        showNavigationButtons={true}
      />
      <Paging defaultPageSize={30} defaultPageIndex={0} enabled={true} />
      <Column
        caption={"Информация о транзакции"}
        fixed={true}
        fixedPosition={"left"}
      >
        <Column
          dataField={"id"}
          caption={"ID записи"}
          dataType={"number"}
          minWidth={110}
          allowReordering
          allowResizing
          filterOperations={dateNumberFilterOperations}
          allowFiltering
          allowHeaderFiltering={false}
        ></Column>
        <Column
          dataField={"rev"}
          caption={"№ транзацкии"}
          dataType={"number"}
          minWidth={80}
          allowReordering
          allowResizing
          filterOperations={dateNumberFilterOperations}
          allowFiltering
          allowHeaderFiltering={false}
        ></Column>
        <Column
          dataField={"revtype"}
          caption={"Действие"}
          minWidth={150}
          dataType={"string"}
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
          dataField={"rev.rev"}
          caption={"Кем совершена"}
          minWidth={200}
          dataType={"string"}
          allowReordering
          allowResizing
          filterOperations={stringFilterOperations}
          allowFiltering
          allowHeaderFiltering={false}
        >
          <Lookup
            dataSource={revInfoDS}
            valueExpr="id"
            displayExpr={revUsernameLookupDisplayExpression}
          />
        </Column>
        <Column
          dataType={"datetime"}
          dataField={"rev.revtstmp"}
          caption={"Когда совершена"}
          minWidth={170}
          format={"dd-MM-yyyy HH:mm:ss"}
          allowFiltering={true}
          allowEditing={false}
          filterOperations={dateNumberFilterOperations}
          allowHeaderFiltering={false}
        >
          <Lookup
            dataSource={revInfoDS}
            valueExpr="id"
            displayExpr={revTimestampLookupDisplayExpression}
          />
        </Column>
      </Column>
      <Column caption={"Значения строки"}>
        <Column
          dataField={"secondName"}
          caption={"Фамилия"}
          dataType={"string"}
          allowReordering
          allowResizing
          filterOperations={stringFilterOperations}
          allowFiltering
          minWidth={170}
          allowHeaderFiltering={false}
        ></Column>
        <Column
          dataField={"firstName"}
          caption={"Имя"}
          dataType={"string"}
          allowReordering
          allowResizing
          filterOperations={stringFilterOperations}
          allowFiltering
          minWidth={170}
          allowHeaderFiltering={false}
        ></Column>
        <Column
          dataField={"middleName"}
          caption={"Отчество"}
          dataType={"string"}
          allowReordering
          allowResizing
          filterOperations={stringFilterOperations}
          allowFiltering
          minWidth={170}
          allowHeaderFiltering={false}
        ></Column>
        <Column
          dataType={"number"}
          dataField={"relationType"}
          caption={"Степень родства"}
          allowFiltering={false}
          minWidth={170}
          allowHeaderFiltering={false}
        >
          <Lookup
            dataSource={rtDataSource}
            valueExpr="id"
            displayExpr="relationTypeName"
          />
        </Column>
        <Column
          dataField={"createdBy"}
          caption={"Создан (кем)"}
          dataType={"string"}
          allowReordering
          allowResizing
          filterOperations={stringFilterOperations}
          allowFiltering
          allowEditing={false}
          minWidth={170}
          allowHeaderFiltering={false}
        ></Column>
        <Column
          dataField={"updatedBy"}
          caption={"Обновлен (кем)"}
          dataType={"string"}
          allowReordering
          allowResizing
          filterOperations={stringFilterOperations}
          allowFiltering
          allowEditing={false}
          minWidth={170}
          allowHeaderFiltering={false}
        ></Column>
        <Column
          dataType={"datetime"}
          dataField={"createdAt"}
          caption={"Создан (когда)"}
          minWidth={170}
          format={"dd-MM-yyyy HH:mm:ss"}
          allowFiltering={true}
          allowEditing={false}
          filterOperations={dateNumberFilterOperations}
          allowHeaderFiltering={false}
        />
        <Column
          dataType={"datetime"}
          dataField={"updatedAt"}
          caption={"Обновлен (когда)"}
          minWidth={170}
          format={"dd-MM-yyyy HH:mm:ss"}
          allowFiltering={true}
          allowEditing={false}
          filterOperations={dateNumberFilterOperations}
          allowHeaderFiltering={false}
        />
      </Column>
    </DataGrid>
  );
};

export default RelativesAudDataGrid;
