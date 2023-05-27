import axios from 'axios';

export default axios.create({
  // TODO: Choose between local and production environments after deploying.
  baseURL: 'http://localhost:8080/api/v1'
});
