import { getApi } from "./ApiMethods";

export const getCountriesApiCall = () => {
  return getApi(`https://restcountries.com/v3.1/all`);
};
