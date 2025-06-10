import React from 'react';
import { AppDispatch } from '../../../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import administrationDataSource from '../../../devextreme/data-sources/administration-data-source';
import { EventInfo } from 'devextreme/events';
import dxDataGrid, { DataErrorOccurredInfo } from 'devextreme/ui/data_grid';
import { addNotification } from '../../../redux/slices/notify-slice/notify-slice';
import {
  DataGrid,
  Editing,
  FilterRow,
  Pager,
  Paging,
  RemoteOperations,
  SearchPanel,
  Sorting,
  Selection,
  Column,
  RequiredRule,
  Lookup,
  NumericRule,
  ColumnFixing,
} from 'devextreme-react/data-grid';
import rolesDataSource from '../../../devextreme/data-sources/roles-data-source';
import {
  allowedPageSizes,
  fiterRowOperationDescriptions,
  dateNumberFilterOperations,
  pagerInfoText,
  stringFilterOperations,
} from '../../../devextreme/devextreme-settings';
import {
  userPermissions,
  userSelector,
} from '../../../redux/slices/user-slice/user-slice';
import { appSettingsStateSelector } from '../../../redux/slices/app-settings-slice/app-settings-slice';
import { dataGridRussianTexts } from '../../../utils/data-grid-russian-texts';

export const AdministrationDataGrid = () => {
  const dispatch = useDispatch<AppDispatch>();
  const dataGrid = React.useRef<DataGrid>(null);
  const backendSettings = useSelector(appSettingsStateSelector);

  const { user } = useSelector(userSelector);
  const dataSource = React.useMemo(
    () => administrationDataSource(backendSettings),
    [backendSettings],
  );
  const rolesDS = React.useMemo(
    () => rolesDataSource(backendSettings),
    [backendSettings],
  );

  const { administrationPageEditPermitted, administrationPageDeletePermitted } =
    useSelector(userPermissions);

  const onDataErrorOccured = React.useCallback(
    (
      e: EventInfo<dxDataGrid<AdministrationEntity, number>> &
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

  const roleIdLookupDisplayExpression = React.useCallback((val: RoleEntity) => {
    return `${val.roleName}`;
  }, []);

  return (
    <DataGrid

      stateStoring={{
        enabled: true,
        type: 'localStorage',
        storageKey: `admininstrationDataGridState.userId=${
          user?.id || 'default'
        }`,
      }}
      style={{ position: 'relative', height: '100%' }}
      ref={dataGrid}
      dataSource={dataSource}
      onDataErrorOccurred={onDataErrorOccured}
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
        allowUpdating={administrationPageEditPermitted}
        allowDeleting={administrationPageDeletePermitted}
        allowAdding={administrationPageEditPermitted}
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
        dataField={'username'}
        caption={'Имя'}
        dataType={'string'}
        allowReordering
        minWidth={220}
        filterOperations={stringFilterOperations}
        allowHeaderFiltering={false}
        allowFiltering
      >
        <RequiredRule message={'Обязательное поле'} />
      </Column>
      <Column
        fixed={true}
        fixedPosition={'left'}
        dataField={'password'}
        caption={'Пароль'}
        dataType={'string'}
        allowReordering
        minWidth={300}
        filterOperations={stringFilterOperations}
        allowHeaderFiltering={false}
        allowFiltering
      ></Column>
      <Column
        dataField={'squadNumber'}
        caption={'Отряд'}
        dataType={'number'}
        allowReordering
        width={100}
        filterOperations={dateNumberFilterOperations}
        allowFiltering
        allowHeaderFiltering={false}
      >
        <NumericRule />
        <RequiredRule message={'Обязательное поле'} />
      </Column>
      <Column
        dataType={'number'}
        dataField={'roleId'}
        caption={'Роль'}
        minWidth={200}
        allowSorting={true}
        allowFiltering={false}
        allowHeaderFiltering={false}
      >
        <Lookup
          dataSource={rolesDS}
          valueExpr="id"
          displayExpr={roleIdLookupDisplayExpression}
        />
      </Column>
      <Column
        dataField={'archived'}
        caption={'Архив'}
        dataType={'boolean'}
        minWidth={140}
        allowReordering
        allowResizing
        allowFiltering={false}
      ></Column>
      <Column
        dataType={'datetime'}
        dataField={'passwordChangeDate'}
        caption={'Дата изменения пароля'}
        format={'dd-MM-yyyy HH:mm:ss'}
        minWidth={250}
        allowHeaderFiltering={false}
        allowFiltering={false}
      />
    </DataGrid>
  );
};
