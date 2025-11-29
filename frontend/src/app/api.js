import Axios from "axios";
import { getAuthToken } from "./authorization";

const api = Axios.create({
  baseURL: "http://api/users",
  timeout: 10000,
});

export default api;
