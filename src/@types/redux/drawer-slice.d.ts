declare type DirectionType = 'rtl' | 'ltr';

declare type DrawerItemType = {
  url: string;
  icon: any;
  title: string;
  visible: boolean;
};

declare type DrawerTypeItems = {
  infoItems: DrawerItemType[];
  actionItems: DrawerItemType[];
};

declare type DrawerType = {
  open: boolean;
  direction: DirectionType;
  items: DrawerTypeItems;
};
