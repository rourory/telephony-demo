import React from 'react';

export const useMenuPhotoHolder = () => {
  const [menuPhotoHolderAnchorEl, setMenuPhotoHolderAnchorEl] =
    React.useState<null | HTMLElement>(null);

  const menuPhotoHolderOpen = React.useMemo(
    () => Boolean(menuPhotoHolderAnchorEl),
    [menuPhotoHolderAnchorEl],
  );
  const handleMenuPhotoHolderClick = React.useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      setMenuPhotoHolderAnchorEl(event.currentTarget);
    },
    [],
  );
  const handleMenuPhotoHolderClose = React.useCallback(() => {
    setMenuPhotoHolderAnchorEl(null);
  }, []);

  return {
    menuPhotoHolderAnchorEl,
    menuPhotoHolderOpen,
    handleMenuPhotoHolderClick,
    handleMenuPhotoHolderClose,
  };
};
