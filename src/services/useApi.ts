import * as Keychain from 'react-native-keychain';

export const BASE_URL = 'https://tgevstation.com/api/';

const TIMEOUT = 60000;

const getToken = async (): Promise<string | null> => {
  try {
    const credentials = await Keychain.getGenericPassword();
    return credentials ? credentials.password : null;
  } catch (error) {
    console.error('Error retrieving token:', error);
    return null;
  }
};

type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface RequestType {
  endpoint: string;
  method?: HTTPMethod;
  body?: object;
  onError?: (err: any) => void;
}

const request = async ({
  method = 'GET',
  endpoint,
  body,
  onError,
}: RequestType) => {
  const isFormData = body instanceof FormData;

  const headers: HeadersInit_ = {
    'Cache-Control': 'no-cache',
    Accept: 'application/json',
    ...(isFormData
      ? {'Content-Type': 'multipart/form-data'}
      : {'Content-Type': 'application/json'}),
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method,
      headers,
      ...(body ? {body: isFormData ? body : JSON.stringify(body)} : {}),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    const responseData = await response.json();

    if (!response.ok) {
      const errorData = {
        status: response.status,
        message: responseData?.message || 'An error occurred',
        data: responseData,
      };
      onError?.(errorData);
      return errorData;
    }
    return {status: response.status, message: 'Success', data: responseData};
  } catch (error: any) {
    clearTimeout(timeoutId);
    const errorData = {
      status: 500,
      message:
        error.name === 'AbortError' ? 'Request timeout' : 'Network error',
      data: null,
    };
    onError?.(errorData);
    return errorData;
  }
};

const api = {
  get: (endpoint: string, body?: object, onError?: (err: any) => void) =>
    request({method: 'GET', endpoint, body, onError}),
  post: (endpoint: string, body?: object, onError?: (err: any) => void) =>
    request({method: 'POST', endpoint, body, onError}),
  put: (endpoint: string, body: object, onError?: (err: any) => void) =>
    request({method: 'PUT', endpoint, body, onError}),
  delete: (endpoint: string, onError?: (err: any) => void) =>
    request({method: 'DELETE', endpoint, onError}),
};

export const userLogin = (data: object, onError?: (err: any) => void) => api.post('v1/auth/login', data, onError);
export const checkPhone = (data: object, onError?: (err: any) => void) => api.post('v1/auth/exist-phone-number', data, onError);

export const fetchUserDetail = async (onError?: (err: any) => void) => {
  const token = await getToken();
  return api.get(`me/detail?s_id=${token}`, undefined, onError);
};

export const postLogout = (data: object, onError?: (err: any) => void) => api.post('user/logout', data, onError);

export default api;
