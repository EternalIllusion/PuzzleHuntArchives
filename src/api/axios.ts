import axios from "axios";

const service = axios.create({
  baseURL: `${window.location.origin}/config`,
  timeout: 30000,
});

export default service;
