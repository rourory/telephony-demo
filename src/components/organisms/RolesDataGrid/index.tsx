import React from 'react';
import { DataGrid } from 'devextreme-react';
import { EventInfo } from 'devextreme/events';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../../redux/store';
import dxDataGrid, { DataErrorOccurredInfo } from 'devextreme/ui/data_grid';
import {
  Editing,
  FilterRow,
  RemoteOperations,
  Sorting,
  Pager,
  Paging,
  Selection,
  Column,
  RequiredRule,
} from 'devextreme-react/data-grid';
import { addNotification } from '../../../redux/slices/notify-slice/notify-slice';
import {
  allowedPageSizes,
  fiterRowOperationDescriptions,
  pagerInfoText,
} from '../../../devextreme/devextreme-settings';
import rolesDataSource from '../../../devextreme/data-sources/roles-data-source';
import { userPermissions } from '../../../redux/slices/user-slice/user-slice';
import { appSettingsStateSelector } from '../../../redux/slices/app-settings-slice/app-settings-slice';
import { dataGridRussianTexts } from '../../../utils/data-grid-russian-texts';

const RolesDataGrid: React.FC = () => {
  const dataGrid = React.useRef<DataGrid>(null);
  const backendSettings = useSelector(appSettingsStateSelector);

  const dataSource = React.useMemo(
    () => rolesDataSource(backendSettings),
    [backendSettings],
  );

  const dispatch = useDispatch<AppDispatch>();

  const { rolesDataGridEditPermitted, rolesDataGridDeletePermitted } =
    useSelector(userPermissions);

  const onDataErrorOccured = React.useCallback(
    (e: EventInfo<dxDataGrid<RoleEntity, number>> & DataErrorOccurredInfo) => {
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
      columnHidingEnabled
      allowColumnReordering
    >
      <Editing
        useIcons
        mode={'row'}
        allowUpdating={rolesDataGridEditPermitted}
        allowDeleting={rolesDataGridDeletePermitted}
        allowAdding={rolesDataGridEditPermitted}
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
        dataType={'string'}
        dataField={'roleName'}
        caption={'Роль'}
        allowFiltering={false}
      >
        <RequiredRule />
      </Column>
    </DataGrid>
  );
};

export default RolesDataGrid;
