import { Box } from '@mui/material';
import React from 'react';
import UltraLightLoadingIndicator from '../../molecules/UltraLightLoadingIndicator';


type ContentLoaderComponentType = {
   height: string | number | (() => string | number);
};

const ContentLoader: React.FC<ContentLoaderComponentType> = ({ height }) => {
   return (
      <Box display={'flex'} height={height} sx={{ justifyContent: 'center', alignItems: 'center' }}>
         <UltraLightLoadingIndicator />
      </Box>
   );
};

export default ContentLoader;
