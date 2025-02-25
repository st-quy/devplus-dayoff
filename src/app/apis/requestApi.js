import axios from "axios";

export const RequestApi = {
  getAll: () => {
    return axios.get(import.meta.env.VITE_BE_URL);
  },
  update: (record) => {
    return axios.post(import.meta.env.VITE_BE_URL, record, {
      headers: {
        "Content-Type": "text/plain",
      },
      mode: "no-cors",
    });
  },
  add: (record) => {
    return axios.post(import.meta.env.VITE_BE_URL, record, {
      headers: {
        "Content-Type": "text/plain",
      },
      mode: "no-cors",
    });
  },
};
