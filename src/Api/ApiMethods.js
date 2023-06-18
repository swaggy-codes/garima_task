import axios from "axios";

export const getApi = (path) => {
  return axios.get(path, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
