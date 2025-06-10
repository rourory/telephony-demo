import TabPanel, { Item } from 'devextreme-react/tab-panel';
import { DataGrid } from 'devextreme-react';
import React, { memo } from 'react';
import {
  Column,
  Editing,
  Lookup,
  MasterDetail,
  RemoteOperations,
  RequiredRule,
} from 'devextreme-react/data-grid';
import relativesDataSource from '../../../../devextreme/data-sources/relatives-data-source';
import relationTypesDataSource from '../../../../devextreme/data-sources/relation-types-data-source';
import { EventInfo } from 'devextreme/events';
import dxDataGrid, {
  DataErrorOccurredInfo,
  NewRowInfo,
} from 'devextreme/ui/data_grid';
import ContactsMasterDetails from './Details';
import CallsDataGrid from '../../CallsDataGrid';
import { AppDispatch } from '../../../../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { addNotification } from '../../../../redux/slices/notify-slice/notify-slice';
import {
  dateNumberFilterOperations,
  stringFilterOperations,
} from '../../../../devextreme/devextreme-settings';
import { userPermissions } from '../../../../redux/slices/user-slice/user-slice';
import RecognizedSpeechDataGrid from '../../RecognizedSpeechDataGrid';
import { appSettingsStateSelector } from '../../../../redux/slices/app-settings-slice/app-settings-slice';
import { dataGridRussianTexts } from '../../../../utils/data-grid-russian-texts';

export const TabbedDetails = memo((props: any) => {
  const dispatch = useDispatch<AppDispatch>();

  const person = React.useMemo(() => props.data.data as PersonEntity, [props]);
  const { backendAddress, backendPort, backendProtocol } = useSelector(
    appSettingsStateSelector,
  );

  const dataSource = React.useMemo(
    () =>
      relativesDataSource({
        backendProtocol: backendProtocol,
        backendAddress: backendAddress,
        backendPort: backendPort,
      }),
    [backendAddress, backendPort, backendProtocol],
  );
  const rtDataSource = React.useMemo(
    () =>
      relationTypesDataSource({
        backendProtocol: backendProtocol,
        backendAddress: backendAddress,
        backendPort: backendPort,
      }),
    [backendAddress, backendPort, backendProtocol],
  );
  const {
    convictedPageRelativeDataGridPermitted,
    convictedPageRelativeDataGridEditPermitted,
    convictedPageRelativeDataGridDeletePermitted,
    convictedPageCallsDataGridPermitted,
    convPageRecognizedSpeechDg_permitted,
    convPageRecognizedSpeechDgEditPermitted,
    convPageRecognizedSpeechDgDeletePermitted,
    relativeDataGridContactsDataGridPermitted,
    auditionColumnsPermitted,
  } = useSelector(userPermissions);

  const dataGrid = React.useRef<DataGrid>(null);

  const onDataErrorOccured = React.useCallback(
    (
      e: EventInfo<dxDataGrid<RelativeEntity, number>> & DataErrorOccurredInfo,
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
      e: EventInfo<dxDataGrid<RelativeEntity, number>> &
        NewRowInfo<RelativeEntity>,
    ) => (e.data.convictedId = person.id),
    [],
  );

  return (
    <TabPanel animationEnabled={true} swipeEnabled={true}>
      {convictedPageRelativeDataGridPermitted && (
        <Item title="Родственники">
          <div style={{ display: 'flex' }}>
            <div
              style={{
                backgroundColor: 'white',
                width: '5px',
                height: 'inherit',
                borderTopLeftRadius: '4px',
                borderBottomLeftRadius: '4px',
              }}
            ></div>
            <DataGrid
              style={{ position: 'relative', height: '100%', width: '100%' }}
              ref={dataGrid}
              dataSource={dataSource}
              onDataErrorOccurred={onDataErrorOccured}
              filterValue={['convictedId', '=', person.id]}
              onInitNewRow={onInitNewRow}
            >
              <Editing
                useIcons
                mode={'row'}
                allowUpdating={convictedPageRelativeDataGridEditPermitted}
                allowDeleting={convictedPageRelativeDataGridDeletePermitted}
                allowAdding={convictedPageRelativeDataGridEditPermitted}
                confirmDelete={true}
                texts={dataGridRussianTexts}
              ></Editing>
              <RemoteOperations filtering sorting />
              <Column
                dataField={'secondName'}
                caption={'Фамилия'}
                dataType={'string'}
                allowReordering
                allowResizing
                filterOperations={stringFilterOperations}
                allowFiltering
              >
                <RequiredRule message={'Обязательное поле'} />
              </Column>
              <Column
                dataField={'firstName'}
                caption={'Имя'}
                dataType={'string'}
                allowReordering
                allowResizing
                filterOperations={stringFilterOperations}
                allowFiltering
              >
                <RequiredRule message={'Обязательное поле'} />
              </Column>
              <Column
                dataField={'middleName'}
                caption={'Отчество'}
                dataType={'string'}
                allowReordering
                allowResizing
                filterOperations={stringFilterOperations}
                allowFiltering
              ></Column>
              <Column
                dataType={'number'}
                dataField={'relationType'}
                caption={'Степень родства'}
              >
                <Lookup
                  dataSource={rtDataSource}
                  valueExpr="id"
                  displayExpr="relationTypeName"
                />
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
              <Column
                dataField={'convictedId'}
                dataType={'number'}
                visible={false}
              />
              {relativeDataGridContactsDataGridPermitted && (
                <MasterDetail
                  enabled={true}
                  component={ContactsMasterDetails}
                />
              )}
            </DataGrid>
          </div>
        </Item>
      )}
      {convictedPageCallsDataGridPermitted && (
        <Item title="Звонки">
          <CallsDataGrid convictedId={person.id} />
        </Item>
      )}
      {convPageRecognizedSpeechDg_permitted && (
        <Item title="Распознная речь">
          <RecognizedSpeechDataGrid
            convictedId={person.id}
            editPermitted={convPageRecognizedSpeechDgEditPermitted}
            deletePermitted={convPageRecognizedSpeechDgDeletePermitted}
          />
        </Item>
      )}
    </TabPanel>
  );
});
