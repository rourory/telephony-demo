import { APP_TOKEN_KEY } from "./../api/constants";

export const setTokenToLocalStorage = (token: string): void => {
  localStorage.setItem(APP_TOKEN_KEY, token);
};
export const getTokenFromLocalStorage = (): string | undefined | null => {
  return localStorage.getItem(APP_TOKEN_KEY);
};
