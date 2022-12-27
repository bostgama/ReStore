import axios, { AxiosError, AxiosResponse } from 'axios';
import { toast } from 'react-toastify';
import { history } from '../..';

axios.defaults.baseURL = 'http://localhost:5000/api/';
axios.defaults.withCredentials = true;

const sleep = () => new Promise(resolve => setTimeout(resolve, 500));




axios.interceptors.response.use(async response => {

  await sleep();

  return response
}, (error: AxiosError) => {
 const {data, status} = error.response!;
 const dataAny = data as any;
 switch (status) {
  case 400:
    if(dataAny.errors) {
      const modelStateErrors: string[] = [];
      for(const key in dataAny.errors) {
        if(dataAny.errors[key]) {
          modelStateErrors.push(dataAny.errors[key])
        }
      }
      throw modelStateErrors.flat();

    }
    toast.error(dataAny.title);
    break;
  case 401:
    toast.error(dataAny.title);
    break;
  case 500:
      history.push({
        pathname: '/server-error',
        state:{error: dataAny}
      });
      toast.error(dataAny.title);
    break; 
  default:
    break;
 }

  return Promise.reject(error.response);
})

const responseBody = (response: AxiosResponse) => response.data;

const request = {
  get: (url: string) => axios.get(url).then(responseBody),
  post: (url: string, body: {}) => axios.post(url, body).then(responseBody),
  put: (url: string, body: {}) => axios.put(url, body).then(responseBody),
  delete: (url: string) => axios.delete(url).then(responseBody),
};

const Catalog = {
  list: () => request.get('products'),
  details: (id: number) => request.get(`products/${id}`),
};

const TestError = {
  get400Error: () => request.get('buggy/bad-request'),
  get401Error: () => request.get('buggy/unauthorised'),
  get404Error: () => request.get('buggy/not-found'),
  get500Error: () => request.get('buggy/server-error'),
  getValidationError: () => request.get('buggy/validation-error'),
};

const Basket = {
  get: () => request.get('basket'),
  addItem:(productId: number, quantity = 1) => request.post(`basket?productId=${productId}&quantity=${quantity}`,{}),
  removeItem:(productId: number, quantity = 1) => request.delete(`basket?productId=${productId}&quantity=${quantity}`)

}

const agent = {
  Catalog,
  TestError,
  Basket
};

export default agent;
