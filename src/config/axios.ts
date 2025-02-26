import axios from "axios";

export default axios.create({
  baseURL: import.meta.env.VITE_PUBLIC_SERVER_URL,
});
