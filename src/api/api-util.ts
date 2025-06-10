export const convertMessagesArrayToString = (error: ErrorWithMessage) => {
  return error.messages.reduce((prev, curr) => `${prev}; ${curr}`);
};
