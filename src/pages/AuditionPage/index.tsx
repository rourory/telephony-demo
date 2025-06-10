import TabPanel, { Item } from 'devextreme-react/tab-panel';
import ContactsAudDataGrid from '../../components/organisms/AuditionDataGrid/ContactsAudDataGrid';
import ConvictedAudDataGrid from '../../components/organisms/AuditionDataGrid/ConvictedAudDataGrid';
import RelativesAudDataGrid from '../../components/organisms/AuditionDataGrid/RelativesAudDataGrid';



const AuditionPage = () => {
  return (
    <TabPanel
      animationEnabled={true}
      swipeEnabled={true}
      style={{ height: '100%' }}
    >
      <Item title="Заявления">
        <ConvictedAudDataGrid />
      </Item>
      )
      <Item title="Родственники">
        <RelativesAudDataGrid />
      </Item>
      )
      <Item title="Контакты">
        <ContactsAudDataGrid />
      </Item>
    </TabPanel>
  );
};

export default AuditionPage;
