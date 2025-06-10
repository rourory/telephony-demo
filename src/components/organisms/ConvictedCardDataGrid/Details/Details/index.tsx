import React, { memo } from 'react';

import { useSelector } from 'react-redux';
import { userPermissions } from '../../../../../redux/slices/user-slice/user-slice';
import { PhotoHolder } from '../../../../molecules/PhotoHolder';
import ContactsDataGrid from '../../../ContactsDataGrid';

const ContactsMasterDetails = memo((props: any) => {
  const relative = React.useMemo(
    () => props.data.data as RelativeEntity,
    [props],
  );

  const {
    relativeDataGridContactsDataGridEditPermitted,
    relativeDataGridContactsDataGridDeletePermitted,
  } = useSelector(userPermissions);

  return (
    <>
      <div style={{ display: 'flex' }}>
        <PhotoHolder
          id={relative.id || 0}
          entity={'RELATIVE'}
          margin={'0px 15px 10px 0px'}
          width={157}
          height={187}
          showControls={true}
        />
        <ContactsDataGrid
          addPermitted={relativeDataGridContactsDataGridEditPermitted}
          editPermitted={relativeDataGridContactsDataGridEditPermitted}
          deletePermitted={relativeDataGridContactsDataGridDeletePermitted}
          relative={relative}
        />
      </div>
    </>
  );
});

export default ContactsMasterDetails;
