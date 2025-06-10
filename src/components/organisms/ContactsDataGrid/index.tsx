import { DataGrid } from 'devextreme-react';
import {
  Column,
  Editing,
  RemoteOperations,
  RequiredRule,
  Lookup,
  FilterRow,
  Pager,
  Paging,
  SearchPanel,
  Sorting,
  Selection,
  ColumnFixing,
  HeaderFilter,
} from 'devextreme-react/data-grid';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dxDataGrid, {
  DataErrorOccurredInfo,
  NewRowInfo,
} from 'devextreme/ui/data_grid';
import { EventInfo } from 'devextreme/events';
import contactTypesDataSource from '../../../devextreme/data-sources/contact-types-data-source';
import contactsDataSource from '../../../devextreme/data-sources/contacts-data-source';
import relativesDataSource from '../../../devextreme/data-sources/relatives-data-source';
import { headerFilterTexts, fiterRowOperationDescriptions, pagerInfoText, allowedPageSizes, stringFilterOperations, dateNumberFilterOperations } from '../../../devextreme/devextreme-settings';
import { appSettingsStateSelector } from '../../../redux/slices/app-settings-slice/app-settings-slice';
import { addNotification } from '../../../redux/slices/notify-slice/notify-slice';
import { userPermissions, userSelector } from '../../../redux/slices/user-slice/user-slice';
import { AppDispatch } from '../../../redux/store';
import { dataGridRussianTexts } from '../../../utils/data-grid-russian-texts';

type ContactDataGridType = {
  addPermitted?: boolean;
  editPermitted?: boolean;
  deletePermitted?: boolean;
  relative?: RelativeEntity | null;
};
const ContactsDataGrid: React.FC<ContactDataGridType> = ({
  addPermitted = false,
  editPermitted = false,
  deletePermitted = false,
  relative = null,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const backendSettings = useSelector(appSettingsStateSelector);
  const { auditionColumnsPermitted } = useSelector(userPermissions);

  const { user } = useSelector(userSelector);

  const filterValue = React.useMemo<Array<any> | undefined>(() => {
    return relative != null ? ['relativeId', '=', relative.id] : undefined;
  }, [relative]);

  const dataSource = React.useMemo(
    () => contactsDataSource(backendSettings),
    [backendSettings],
  );
  const ctDataSource = React.useMemo(
    () => contactTypesDataSource(backendSettings),
    [backendSettings],
  );
  const relativesDS = React.useMemo(
    () => relativesDataSource(backendSettings),
    [backendSettings],
  );

  const relativeIdLookupDisplayExpression = React.useCallback(
    (val: RelativeEntity) => {
      return `${val.secondName} ${val.firstName} ${
        val.middleName ? val.middleName : ''
      }`;
    },
    [],
  );

  const onDataErrorOccured = React.useCallback(
    (
      e: EventInfo<dxDataGrid<ContactEntity, number>> & DataErrorOccurredInfo,
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
      e: EventInfo<dxDataGrid<ContactEntity, number>> &
        NewRowInfo<ContactEntity>,
    ) => {
      if (relative != null) e.data.relativeId = relative.id;
    },
    [relative],
  );

  return (
    <DataGrid
      stateStoring={{
        enabled: relative ? false : true,
        type: 'localStorage',
        storageKey: `relativeDataGridState.userId=${user?.id || 'default'}`,
      }}
      style={{
        position: 'relative',
        height: '100%',
        width: '100%',
      }}
      dataSource={dataSource}
      onDataErrorOccurred={onDataErrorOccured}
      filterValue={filterValue}
      onInitNewRow={onInitNewRow}
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
      <FilterRow
        visible={relative == null ? true : false}
        resetOperationText={'Сбросить фильтр'}
        operationDescriptions={fiterRowOperationDescriptions}
      />
      <RemoteOperations groupPaging filtering sorting paging />
      <SearchPanel
        visible={relative == null ? true : false}
        placeholder={'Поиск...'}
        width={'30vw'}
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
      <Paging defaultPageSize={20} defaultPageIndex={0} enabled={true} />
      <Editing
        useIcons
        mode={'row'}
        allowUpdating={editPermitted}
        allowDeleting={deletePermitted}
        allowAdding={addPermitted}
        confirmDelete={true}
        texts={dataGridRussianTexts}
      ></Editing>
      <Column
        fixed={true}
        fixedPosition={'left'}
        dataField={'contactValue'}
        caption={'Контакт'}
        dataType={'string'}
        allowReordering
        allowResizing
        filterOperations={stringFilterOperations}
        allowFiltering
        minWidth={300}
        allowHeaderFiltering={false}
      >
        <RequiredRule message={'Обязательное поле'} />
      </Column>
      <Column
        fixed={true}
        fixedPosition={'left'}
        dataType={'number'}
        dataField={'contactTypeId'}
        caption={'Способ связи'}
        allowFiltering={relative == null ? false : true}
        allowHeaderFiltering={true}
        minWidth={180}
      >
        <HeaderFilter
          visible={true}
          dataSource={ctDataSource}
          texts={headerFilterTexts}
          width={400}
          height={300}
        />
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
        allowFiltering={false}
        minWidth={180}
      ></Column>
      <Column
        dataType={'number'}
        dataField={'relativeId'}
        caption={'Принадлежит'}
        visible={relative ? false : true}
        allowEditing={false}
        allowFiltering={relative ? true : false}
        minWidth={400}
      >
        <Lookup
          dataSource={relativesDS}
          valueExpr="id"
          displayExpr={relativeIdLookupDisplayExpression}
        />
        <RequiredRule message={'Обязательное поле'} />
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

export default ContactsDataGrid;
