import * as Keychain from 'react-native-keychain';
import DeviceInfo from 'react-native-device-info';

export const BASE_URL = 'https://tgevstation.com/api/';
const TIMEOUT = 60000;

const getToken = async (): Promise<string | null> => {
  try {
    const creds = await Keychain.getGenericPassword();
    return creds ? creds.password : null;
  } catch (err) {
    console.error('Token error:', err);
    return null;
  }
};

const getDeviceId = async () => {
  try {
    return await DeviceInfo.getUniqueId();
  } catch (e) {
    return '';
  }
};

type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface RequestOptions {
  endpoint: string;
  method?: HTTPMethod;
  body?: any;
  onError?: (err: any) => void;
}


const request = async ({
  endpoint,
  method = 'GET',
  body,
  onError,
}: RequestOptions) => {
  const isForm = body instanceof FormData;
  const token = await getToken();
  const deviceId = await getDeviceId();

  const headers: any = {
    Accept: 'application/json',
    'Cache-Control': 'no-cache',
    'X-Device-Id': deviceId,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(isForm ? {} : { 'Content-Type': 'application/json' }),
  };

  // Timeout controller
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT);

  const options: any = {
    method,
    headers,
    signal: controller.signal,
  };

  if (method !== 'GET' && body) {
    options.body = isForm ? body : JSON.stringify(body);
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, options);

    clearTimeout(timeout);

    const json = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorPayload = {
        status: response.status,
        message: json?.message || 'Request failed',
        data: json,
      };
      onError?.(errorPayload);
      return errorPayload;
    }

    return {
      status: response.status,
      message: 'Success',
      data: json,
    };
  } catch (err: any) {
    clearTimeout(timeout);

    console.error('Network Request Error:', {
      endpoint,
      error: err?.message || err,
      name: err?.name,
      stack: err?.stack,
    });

    const errorPayload = {
      status: 0,
      message:
        err?.name === 'AbortError'
          ? 'Request timeout'
          : err?.message || 'Network error (Request never reached server)',
      data: null,
    };

    onError?.(errorPayload);
    return errorPayload;
  }
};

/**
 * --------------------------------------------------------------------
 *  CLEAN API METHODS
 * --------------------------------------------------------------------
 */
const api = {
  get: (endpoint: string, onError?: (err: any) => void) =>
    request({ method: 'GET', endpoint, onError }),

  post: (endpoint: string, body?: any, onError?: (err: any) => void) =>
    request({ method: 'POST', endpoint, body, onError }),

  put: (endpoint: string, body?: any, onError?: (err: any) => void) =>
    request({ method: 'PUT', endpoint, body, onError }),

  delete: (endpoint: string, onError?: (err: any) => void) =>
    request({ method: 'DELETE', endpoint, onError }),
};



export const userLogin = (data: any, onError?: (err: any) => void) =>
  api.post('v1/auth/login', data, onError);

export const checkPhone = (data: any, onError?: (err: any) => void) =>
  api.post('v1/auth/exist-phone-number', data, onError);

export const userRegister = (data: any, onError?: (err: any) => void) =>
  api.post('v1/auth/register', data, onError);

export const postLogout = (data: any, onError?: (err: any) => void) =>
  api.post('v1/auth/logout', data, onError);

export const fetchUserDetail = (onError?: (err: any) => void) =>
  api.get('v1/users/me', onError);

export const updateMe = (data: any, onError?: (err: any) => void) =>
  api.post('v1/users/me', data, onError);


export const fetchMeWallet = (onError?: (err: any) => void) =>
  api.post('v1/wallet', {}, onError);

export const fetchMeWalletTransactions = (
  page = 0,
  onError?: (err: any) => void,
) =>
  api.post(
    `v1/wallet/transactions?page=${page}&size=10`,
    {},
    onError,
  );

export const topUp = (data: any, onError?: (err: any) => void) =>
  api.post('v1/wallet/topup', data, onError);

export const verifyTransaction = (data: any,onError?: (err: any) => void) =>
  api.post('v1/wallet/verify', data, onError);


export const fetchStation = (data: any, onError?: (err: any) => void) =>
  api.post('v1/location/list', data, onError);


export const evtStart = (data: any, onError?: (err: any) => void) =>
  api.post('v1/chargers/remote-start', data, onError);

export const evtStop = (data: any, onError?: (err: any) => void) =>
  api.post('v1/chargers/remote-stop', data, onError);

export const chargingSessions = (id: string, onError?: (err: any) => void) =>
  api.post(`v1/chargers/charging-sessions/${id}`, {}, onError);

export const fetchHistory = (data: any, onError?: (err: any) => void) =>
  api.post('v1/chargers/charging-history', data, onError);

export const fetchContact = (onError?: (err: any) => void) =>
  api.post('v1/lookup/contact-us', {}, onError);

export const fetchFAQ = (onError?: (err: any) => void) =>
  api.post('v1/lookup/faq', {}, onError);

export const fetchHistoryDetail = (data:any,onError?: (err: any) => void) =>
  api.post(`v1/chargers/charging-history/${data}`, onError);

export const fetchSlideShow = (data:any,onError?: (err: any) => void) =>
  api.post(`v1/lookup/slide-show`,data, onError);


export const fetchTopupAmount = (data:any,onError?: (err: any) => void) =>
  api.post(`v1/lookup/topup-amount`,data, onError);

export default api;
