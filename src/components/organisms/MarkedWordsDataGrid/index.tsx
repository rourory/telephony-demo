import React from 'react';
import DataGrid, {
  Editing,
  FilterRow,
  RemoteOperations,
  Sorting,
  Pager,
  Paging,
  Selection,
  Column,
  RequiredRule,
  ColumnFixing,
} from 'devextreme-react/data-grid';
import { useDispatch, useSelector } from 'react-redux';
import dxDataGrid, { DataErrorOccurredInfo } from 'devextreme/ui/data_grid';
import { EventInfo } from 'devextreme/events';
import markedWordsDataSource from '../../../devextreme/data-sources/marked-words-data-source';
import { fiterRowOperationDescriptions, pagerInfoText, allowedPageSizes, dateNumberFilterOperations, stringFilterOperations } from '../../../devextreme/devextreme-settings';
import { appSettingsStateSelector } from '../../../redux/slices/app-settings-slice/app-settings-slice';
import { addNotification } from '../../../redux/slices/notify-slice/notify-slice';
import { userPermissions } from '../../../redux/slices/user-slice/user-slice';
import { AppDispatch } from '../../../redux/store';
import { dataGridRussianTexts } from '../../../utils/data-grid-russian-texts';

const MarkedWordsDataGrid = () => {
  const dispatch = useDispatch<AppDispatch>();
  const dataGrid = React.useRef<DataGrid>(null);

  const {
    markedWordsPageEditPermitted,
    markedWordsPageDeletePermitted,
    auditionColumnsPermitted,
  } = useSelector(userPermissions);

  const backendSettings = useSelector(appSettingsStateSelector);

  const dataSource = React.useMemo(
    () => markedWordsDataSource(backendSettings),
    [backendSettings],
  );

  const onDataErrorOccured = React.useCallback(
    (
      e: EventInfo<dxDataGrid<MarkedWordEntity, number>> &
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
      allowColumnReordering
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
        allowUpdating={markedWordsPageEditPermitted}
        allowDeleting={markedWordsPageDeletePermitted}
        allowAdding={markedWordsPageEditPermitted}
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
      ></Column>
      <Column
        fixed={true}
        fixedPosition={'left'}
        dataType={'string'}
        dataField={'word'}
        caption={'Слово'}
        minWidth={200}
        allowFiltering={false}
      >
        <RequiredRule />
      </Column>
      <Column
        fixed={true}
        fixedPosition={'left'}
        dataType={'string'}
        dataField={'root'}
        caption={'Корень для поиска в тексте'}
        minWidth={200}
        allowFiltering={false}
      >
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

export default MarkedWordsDataGrid;
