import axios from 'axios';

export const api = axios.create({
  /* baseURL: 'https://doar-computador-api.herokuapp.com/', */
  baseURL: 'https://doar-computador.herokuapp.com/',
});
