import axios from "axios";
const baseURL = "/api/persons/";

const getAll = () => {
  return axios.get(baseURL).then((response) => response.data);
};

const addNumber = (name, number) => {
  return axios
    .post(baseURL, { name, number })
    .then((response) => response.data);
};

const deleteNumber = (person) => {
  return axios
    .delete(baseURL + person.id)
    .then((response) => response.data)
    .catch((error) => {
      alert(`${person.name}'s number has already been deleted`);
    });
};

const replaceNumber = (id, name, number) => {
  return axios
    .put(baseURL + id, { name, number })
    .then((response) => response.data);
};

let serverServices = { getAll, addNumber, deleteNumber, replaceNumber };
export default serverServices;
