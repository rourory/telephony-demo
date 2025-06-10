import styled from '@emotion/styled';
import { Tooltip, tooltipClasses, TooltipProps } from '@mui/material';

export const RecognizerAlertTooltip = styled(
  ({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ),
)({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: 'rgba(65, 65, 65, 0.98)',
    color: 'rgba(243, 243, 243, 0.87)',
    maxWidth: 320,
    minWidth: 250,
    fontSize: '14px',
    border: '1px solid rgba(167, 0, 0, 0.8)',
  },
});
