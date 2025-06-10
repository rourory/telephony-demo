import TabPanel, { Item } from 'devextreme-react/tab-panel';
import NotFoundPage from '../NotFoundPage';
import PermissionsDataGrid from '../../components/organisms/PermissionsDataGrid';
import RolesDataGrid from '../../components/organisms/RolesDataGrid';
import { useSelector } from 'react-redux';
import { userPermissions } from '../../redux/slices/user-slice/user-slice';
import CallDurationsDataGrid from '../../components/organisms/CallDurationsDataGrid';
import CommonSettings from '../../components/organisms/CommonSettingsTab';

const SettingsPage = () => {
  const {
    permissionsDataGridPermitted,
    rolesDataGridPermitted,
    durationsPagePermitted,
    settingsTabPermitted,
  } = useSelector(userPermissions);

  return (
    <TabPanel
      animationEnabled={true}
      swipeEnabled={true}
      style={{ height: '100%' }}
    >
      {permissionsDataGridPermitted && (
        <Item title="Разрешения">
          <PermissionsDataGrid />
        </Item>
      )}
      {rolesDataGridPermitted && (
        <Item title="Роли">
          <RolesDataGrid />
        </Item>
      )}
      {durationsPagePermitted && (
        <Item title={'Продолжительности звонков'}>
          <CallDurationsDataGrid />
        </Item>
      )}
      {settingsTabPermitted && (
        <Item title="Общие настройки">
          <CommonSettings />
        </Item>
      )}
      <Item title="Другое">
        <NotFoundPage />
      </Item>
    </TabPanel>
  );
};

export default SettingsPage;
