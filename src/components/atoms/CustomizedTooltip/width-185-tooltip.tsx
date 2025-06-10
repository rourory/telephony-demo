import styled from '@emotion/styled';
import { Tooltip, tooltipClasses, TooltipProps } from '@mui/material';

export const CustomWidth185Tooltip = styled(
  ({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ),
)({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: 185,
  },
});


