import axios from "axios";

export default axios.create({
  baseURL: (!process.env.NODE_ENV || process.env.NODE_ENV === 'development')
    ? "http://localhost:8080/api/v1"
    : "http://16.171.22.232:8080/api/v1",
});
