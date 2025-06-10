import { APP_TOKEN_ISSUED_KEY, APP_TOKEN_KEY, VALIDITY_TIME } from './../api/constants';

/**
 * The method saves the token in localStorage and registers the time of saving
 * @param token - the token passed for saving to localStorage
 */
export const setTokenToLocalStorage = (token: string): void => {
   localStorage.setItem(APP_TOKEN_KEY, token);
   localStorage.setItem(APP_TOKEN_ISSUED_KEY, new Date().getTime().toString());
};

/**
 * The method is engaged in extracting a previously saved token from localStorage. If it was saved earlier than {@link VALIDITY_TIME} before it was retrieved, undefined is returned
 * @returns token or undefined
 */
export const getTokenFromLocalStorage = (): string | undefined => {
   const issueDateMilliseconds = Number(localStorage.getItem(APP_TOKEN_ISSUED_KEY));
   if (new Date().getTime() - new Date(issueDateMilliseconds.valueOf()).getTime() <= VALIDITY_TIME)
      return localStorage.getItem(APP_TOKEN_KEY) || '';
   return undefined;
};

/**
 * Returns token issued date object from local storage if such object exists and it's still actual with {@link VALIDITY_TIME} or undefiend in other cases
 * @returns token issued date or undefined
 */
export const getIssedDateFromLocalStorage = (): Date | undefined => {
   if (localStorage.getItem(APP_TOKEN_ISSUED_KEY)) {
      const issuedDate = new Date(Number(localStorage.getItem(APP_TOKEN_ISSUED_KEY)).valueOf());
      if (new Date().getTime() - issuedDate.getTime() <= VALIDITY_TIME) return issuedDate;
   } else return undefined;
};
