import React from 'react';
import { DataGrid } from 'devextreme-react';
import { EventInfo } from 'devextreme/events';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../../redux/store';
import dxDataGrid, {
  DataErrorOccurredInfo,
  NewRowInfo,
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
  RequiredRule,
} from 'devextreme-react/data-grid';
import { addNotification } from '../../../redux/slices/notify-slice/notify-slice';
import {
  allowedPageSizes,
  fiterRowOperationDescriptions,
  headerFilterTexts,
  pagerInfoText,
} from '../../../devextreme/devextreme-settings';
import rolesDataSource from '../../../devextreme/data-sources/roles-data-source';
import uiPermissionsDataSource from '../../../devextreme/data-sources/ui-permission-data-source';
import { userPermissions } from '../../../redux/slices/user-slice/user-slice';
import { appSettingsStateSelector } from '../../../redux/slices/app-settings-slice/app-settings-slice';
import { loadPermissions } from '../../../redux/slices/user-slice/thunks';
import { dataGridRussianTexts } from '../../../utils/data-grid-russian-texts';

const gridColumns = [
  {
    field: 'canGiveCallsToAnotherSquad',
    caption: 'Может предоставлять звонки любому отряду',
  },
  {
    field: 'canGiveCallsToControlled',
    caption: 'Может предоставлять звонки осужденным под контролем',
  },
  {
    field: 'convictedPagePermitted',
    caption: 'Доступ к странице "Заявления"',
  },
  {
    field: 'convictedPageEditPermitted',
    caption: 'Редактирование на странице "Заявления"',
  },
  {
    field: 'convictedPageDeletePermitted',
    caption: 'Удаление на странице "Заявления"',
  },
  {
    field: 'convictedPageRelativeDataGridPermitted',
    caption: 'Доступ к таблице "Родственники" на странице "Заявления"',
  },
  {
    field: 'convictedPageRelativeDataGridEditPermitted',
    caption: 'Редактирование в таблице "Родственники" на странице "Заявления"',
  },
  {
    field: 'convictedPageRelativeDataGridDeletePermitted',
    caption: 'Удаление в таблице "Родственники" на странице "Заявления"',
  },
  {
    field: 'convictedPageCallsDataGridPermitted',
    caption: 'Доступ к таблице "Звонки" на странице "Заявления"',
  },
  {
    field: 'convictedPageCallsDataGridEditPermitted',
    caption: 'Редактирование в таблице "Звонки" на странице "Заявления"',
  },
  {
    field: 'convictedPageCallsDataGridDeletePermitted',
    caption: 'Удаление в таблице "Звонки" на странице "Заявления"',
  },
  {
    field: 'convPageRecognizedSpeechDg_permitted',
    caption: 'Доступ к таблице "Распознанная речь" на странице "Заявления"',
  },
  {
    field: 'convPageRecognizedSpeechDgEditPermitted',
    caption:
      'Редактирование в таблице "Распознанная речь" на странице "Заявления"',
  },
  {
    field: 'convPageRecognizedSpeechDgDeletePermitted',
    caption: 'Удаление в таблице "Распознанная речь" на странице "Заявления"',
  },
  {
    field: 'relativeDataGridContactsDataGridPermitted',
    caption: 'Доступ в таблице "Контакты" в таблице "Заявления"',
  },
  {
    field: 'relativeDataGridContactsDataGridEditPermitted',
    caption: 'Редактирование в таблице "Контакты" на странице "Заявления"',
  },
  {
    field: 'relativeDataGridContactsDataGridDeletePermitted',
    caption: 'Удаление в таблице "Контакты" на странице "Заявления"',
  },
  { field: 'callsPagePermitted', caption: 'Доступ к странице "Звонки"' },
  {
    field: 'callsPageEditPermitted',
    caption: 'Редактирование на странице "Звонки"',
  },
  {
    field: 'callsPageDeletePermitted',
    caption: 'Удаление на странице "Звонки"',
  },
  {
    field: 'callTryingsDataGridPermitted',
    caption: 'Доступ к таблице "Попытки дозвона" на странице "Звонки"',
  },
  {
    field: 'callTryingsDataGridEditPermitted',
    caption: 'Редактирование в таблице "Попытки дозвона" на странице "Звонки"',
  },
  {
    field: 'callTryingsDataGridDeletePermitted',
    caption: 'Удаление в таблице "Попытки дозвона" на странице "Звонки"',
  },
  {
    field: 'devicesPagePermitted',
    caption: 'Доступ к странице "Аппараты"',
  },

  {
    field: 'devicesPageEditPermitted',
    caption: 'Редактирование на странице "Аппараты"',
  },
  {
    field: 'devicesPageDeletePermitted',
    caption: 'Удаление на странице "Аппараты"',
  },
  {
    field: 'administrationPagePermitted',
    caption: 'Доступ к странице "Сотрудники"',
  },
  {
    field: 'administrationPageEditPermitted',
    caption: 'Редактирование на странице "Сотрудники"',
  },
  {
    field: 'administrationPageDeletePermitted',
    caption: 'Удаление на странице "Сотрудники"',
  },
  {
    field: 'extraCallPagePermitted',
    caption: 'Доступ к странице "Дополнительные разрешения на звонок"',
  },
  {
    field: 'extraCallPageEditPermitted',
    caption: 'Редактирование на странице "Дополнительные разрешения на звонок"',
  },
  {
    field: 'extraCallPageDeletePermitted',
    caption: 'Удаление на странице "Дополнительные разрешения на звонок"',
  },
  {
    field: 'settingsPagePermitted',
    caption: 'Доступ к странице "Настройки"',
  },
  {
    field: 'permissionsDataGridPermitted',
    caption: 'Доступ к таблице "Разрешения" на странице "Настройки"',
  },
  {
    field: 'rolesDataGridPermitted',
    caption: 'Доступ к таблице "Роли" на странице "Настройки"',
  },
  {
    field: 'rolesDataGridEditPermitted',
    caption: 'Редактирование в таблице "Роли" на странице "Настройки"',
  },
  {
    field: 'rolesDataGridDeletePermitted',
    caption: 'Удаление в таблице "Роли" на странице "Настройки"',
  },
  {
    field: 'permissionsDataGridEditPermitted',
    caption: 'Редактирование в таблице "Разрешения" на странице "Настройки"',
  },
  {
    field: 'permissionsDataGridDeletePermitted',
    caption: 'Удаление в таблице "Разрешения" на странице "Настройки"',
  },
  {
    field: 'durationsPagePermitted',
    caption:
      'Доступ к таблице "Продолжительности звонков" на странице "Настройки"',
  },
  {
    field: 'durationsPageEditPermitted',
    caption:
      'Редактирование в таблице "Продолжительности звонков" на странице "Настройки"',
  },
  {
    field: 'durationsPageDeletePermitted',
    caption:
      'Удаление в таблице "Продолжительности звонков" на странице "Настройки"',
  },
  {
    field: 'dataPagePermitted',
    caption: 'Доступ к странице "Данные"',
  },
  {
    field: 'dataPageContactsDataGridPermitted',
    caption: 'Доступ к таблице "Все контакты" на странице "Данные"',
  },
  {
    field: 'dataPageContactsDataGridEditPermitted',
    caption: 'Редактирование в таблице "Все контакты" на странице "Данные"',
  },
  {
    field: 'dataPageContactsDataGridDeletePermitted',
    caption: 'Удаление в таблице "Все контакты" на странице "Данные"',
  },
  {
    field: 'dataPageRecognizedSpeechFgPermitted',
    caption: 'Доступ к таблице "Вся распознанная речь" на странице "Данные"',
  },
  {
    field: 'dataPageRecognizedSpeechDgEditPermitted',
    caption:
      'Редактирование в таблице "Вся распознанная речь" на странице "Данные"',
  },
  {
    field: 'dataPageRecognizedSpeechDgDeletePermitted',
    caption: 'Удаление в таблице "Вся распознанная речь" на странице "Данные"',
  },
  {
    field: 'settingsTabPermitted',
    caption: 'Доступ к вкладке "Общие настройки" на странице "Настройки"',
  },
  {
    field: 'auditionPagePermitted',
    caption: 'Доступ к странице истории изменений',
  },
  {
    field: 'auditionColumnsPermitted',
    caption: 'Доступ к колонкам с информацией об изменении строки',
  },
  {
    field: 'vncControllingPermitted',
    caption: 'Полный доступ к управлению удаленной машиной',
  },

  {
    field: 'markedWordsPagePermitted',
    caption: 'Доступ к странице "Распознавание речи"',
  },
  {
    field: 'markedWordsPageEditPermitted',
    caption: 'Редактирование на странице "Распознавание речи"',
  },
  {
    field: 'markedWordsPageDeletePermitted',
    caption: 'Удаление на странице "Распознавание речи"',
  },
  {
    field: 'statisticsPagePermitted',
    caption: 'Доступ к странице странице "Статистика"',
  },
  {
    field: 'addRelativePhotoPermitted',
    caption: 'Добавление фото родственников',
  },
  {
    field: 'deleteRelativePhotoPermitted',
    caption: 'Удаление фото родственников',
  },
];

const PermissionsDataGrid: React.FC = () => {
  const dataGrid = React.useRef<DataGrid>(null);
  const backendSettings = useSelector(appSettingsStateSelector);

  const onInitNewRow = React.useCallback(
    (
      e: EventInfo<dxDataGrid<UiPermissionEntity, number>> &
        NewRowInfo<UiPermissionEntity>,
    ) => {
      gridColumns.forEach((column) => {
        e.data[column.field as keyof UiPermissionEntityBooleanColumns] = false;
      });
    },
    [gridColumns],
  );

  const dataSource = React.useMemo(
    () => uiPermissionsDataSource(backendSettings),
    [backendSettings],
  );
  const rolesDS = React.useMemo(
    () => rolesDataSource(backendSettings),
    [backendSettings],
  );

  const dispatch = useDispatch<AppDispatch>();

  const {
    roleId,
    permissionsDataGridEditPermitted,
    permissionsDataGridDeletePermitted,
  } = useSelector(userPermissions);

  const onDataErrorOccured = React.useCallback(
    (
      e: EventInfo<dxDataGrid<UiPermissionEntity, number>> &
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

  const roleHeaderFilterData = React.useMemo(() => {
    return {
      store: rolesDS,
      map: (item: RoleEntity) => {
        return {
          text: item.roleName,
          value: item.id,
          id: item.id,
        };
      },
    };
  }, [rolesDS]);

  const onRowUpdated = React.useCallback(() => {
    if (roleId) {
      dispatch(
        loadPermissions({
          roleId: roleId,
          backendSettings: backendSettings,
        }),
      );
      dispatch(
        addNotification({ type: 'success', message: 'Настройки применены' }),
      );
    }
  }, [backendSettings, roleId]);

  return (
    <DataGrid
      style={{ position: 'relative', height: '100%' }}
      ref={dataGrid}
      dataSource={dataSource}
      onDataErrorOccurred={onDataErrorOccured}
      columnHidingEnabled
      allowColumnReordering
      onRowUpdated={onRowUpdated}
      onInitNewRow={onInitNewRow}
    >
      <Editing
        useIcons
        mode={'row'}
        allowUpdating={permissionsDataGridEditPermitted}
        allowDeleting={permissionsDataGridDeletePermitted}
        allowAdding={permissionsDataGridEditPermitted}
        confirmDelete={true}
        texts={dataGridRussianTexts}
      ></Editing>
      <RemoteOperations groupPaging filtering sorting paging />
      <FilterRow
        visible={true}
        resetOperationText={'Сбросить фильтр'}
        operationDescriptions={fiterRowOperationDescriptions}
      />
      <HeaderFilter visible={true} />
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
        dataType={'number'}
        dataField={'roleId'}
        caption={'Роль'}
        width={200}
        allowFiltering={false}
        allowHeaderFiltering={true}
      >
        <Lookup
          dataSource={rolesDS}
          valueExpr="id"
          displayExpr={roleIdLookupDisplayExpression}
        />
        <HeaderFilter
          dataSource={roleHeaderFilterData}
          texts={headerFilterTexts}
        />
        <RequiredRule />
      </Column>
      {gridColumns.map((col) => (
        <Column
          key={col.field}
          dataType={'boolean'}
          dataField={col.field}
          caption={col.caption}
          allowFiltering={false}
          allowHeaderFiltering={false}
        ></Column>
      ))}
      <Column
        dataType={'datetime'}
        dataField={'temporaryGivingCallsToAnotherSquad'}
        caption={
          'Временное разрешение на предоставление звонков любому отряду с (дата)'
        }
        width={200}
        format={'dd-MM-yyyy HH:mm:ss'}
        allowHeaderFiltering={false}
        allowFiltering={false}
      />
      <Column
        dataField={'temporaryGivingCallsToAnotherSquadHours'}
        caption={
          'Временное разрешение на предоставление звонков любому отряду на (часы)'
        }
        dataType={'number'}
        allowReordering
        width={200}
        allowFiltering={false}
        allowHeaderFiltering={false}
      ></Column>
    </DataGrid>
  );
};

export default PermissionsDataGrid;
