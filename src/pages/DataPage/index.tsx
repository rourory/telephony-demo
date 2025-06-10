import TabPanel, { Item } from 'devextreme-react/tab-panel';
import { useSelector } from 'react-redux';
import { userPermissions } from '../../redux/slices/user-slice/user-slice';
import ContactsDataGrid from '../../components/organisms/ContactsDataGrid';
import RecognizedSpeechDataGrid from '../../components/organisms/RecognizedSpeechDataGrid';



const DataPage = () => {
  const {
    dataPageContactsDataGridPermitted,
    dataPageContactsDataGridEditPermitted,
    dataPageContactsDataGridDeletePermitted,
    dataPageRecognizedSpeechFgPermitted,
    dataPageRecognizedSpeechDgEditPermitted,
    dataPageRecognizedSpeechDgDeletePermitted,
  } = useSelector(userPermissions);

  return (
    <TabPanel animationEnabled={true} swipeEnabled={true} style={{ height: '100%' }}>
      {dataPageContactsDataGridPermitted && (
        <Item title="Все контакты">
          <ContactsDataGrid
            editPermitted={dataPageContactsDataGridEditPermitted}
            deletePermitted={dataPageContactsDataGridDeletePermitted}
          />
        </Item>
      )}
      {dataPageRecognizedSpeechFgPermitted && (
        <Item title="Вся распознанная речь">
          <RecognizedSpeechDataGrid
            editPermitted={dataPageRecognizedSpeechDgEditPermitted}
            deletePermitted={dataPageRecognizedSpeechDgDeletePermitted}
          />
        </Item>
      )}
    </TabPanel>
  );
};

export default DataPage;
