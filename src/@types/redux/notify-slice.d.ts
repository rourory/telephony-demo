
declare type AppNotification = {
  id?: number;
  type: 'default' | 'error' | 'success' | 'warning' | 'info' | undefined;
  message: string;
};
