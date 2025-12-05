import * as Keychain from 'react-native-keychain';
import DeviceInfo from 'react-native-device-info';

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

const getDeviceId = async (): Promise<string> => {
  try {
    return await DeviceInfo.getUniqueId();
  } catch (error) {
    console.error('Error retrieving device ID:', error);
    return '';
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
  const deviceId = await getDeviceId();
  const token = await getToken();
  const headers: HeadersInit_ = {
    'Cache-Control': 'no-cache',
    Accept: 'application/json',
    'X-Device-Id': deviceId,
    Authorization: token ? `Bearer ${token}` : '',
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
export const userRegister = (data: object, onError?: (err: any) => void) => api.post('v1/auth/register', data, onError);
export const fetchUserDetail = async (onError?: (err: any) => void) => api.get(`v1/users/me`, undefined, onError);
export const fetchMeWallet = async (onError?: (err: any) => void) => api.post(`v1/wallet`, undefined, onError);
export const fetchMeWalletTransactions = async (page: number = 0, onError?: (err: any) => void) => api.post(`v1/wallet/transactions?page=${page}&size=10`, {}, onError);
export const fetchStation = async (data: object, onError?: (err: any) => void) => api.post(`v1/location/list`, data, onError);
export const evtStart = async (data: object, onError?: (err: any) => void) => api.post(`v1/chargers/remote-start`, data, onError);
export const topUp = async (data: object, onError?: (err: any) => void) => api.post(`v1/wallet/topup`, data, onError);
export const postLogout = (data: object, onError?: (err: any) => void) => api.post('v1/auth/logout', data, onError);
export const fetchHistory = (data: object, onError?: (err: any) => void) => api.post('v1/chargers/charging-history', data, onError);
export const updateMe = (data: object, onError?: (err: any) => void) => api.post('v1/users/me', data, onError);

export default api;
