import { PaletteMode } from '@mui/material';

declare type ThemeOptionsType = {
  palette: {
    mode: PaletteMode;
  };
  typography: {
    fontFamily: React.CSSProperties['fontFamily'];
  };
  components?: any;
};
