import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';

export interface AppUpdateInfo {
  shouldUpdate: boolean;
  force: boolean;
  latestVersion: string;
  minVersion?: string;
  storeUrl?: string;
  message?: string;
}

const APP_STORE_ID = '6755755811'; // Fill with numeric App Store ID if not provided by API

const compareVersions = (a: string, b: string): number => {
  const pa = a.split('.').map((n) => parseInt(n, 10) || 0);
  const pb = b.split('.').map((n) => parseInt(n, 10) || 0);
  const len = Math.max(pa.length, pb.length);
  for (let i = 0; i < len; i += 1) {
    const na = pa[i] ?? 0;
    const nb = pb[i] ?? 0;
    if (na > nb) return 1;
    if (na < nb) return -1;
  }
  return 0;
};

const buildStoreUrl = async (): Promise<string | undefined> => {
  if (Platform.OS === 'ios') {
    if (!APP_STORE_ID) return undefined;
    return `itms-apps://apps.apple.com/app/id${APP_STORE_ID}`;
  }
  const bundleId = DeviceInfo.getBundleId();
  return `https://play.google.com/store/apps/details?id=${bundleId}`;
};

const fetchLatestVersionFromStore = async (): Promise<string | null> => {
  if (Platform.OS === 'ios') {
    if (!APP_STORE_ID) return null;
    const resp = await fetch(`https://itunes.apple.com/lookup?id=${APP_STORE_ID}`);
    const json = await resp.json();
    const version = json?.results?.[0]?.version;
    return typeof version === 'string' && version.length > 0 ? version : null;
  }

  const bundleId = DeviceInfo.getBundleId();
  const resp = await fetch(`https://play.google.com/store/apps/details?id=${bundleId}&hl=en&gl=US`);
  const html = await resp.text();
  const match =
    html.match(/\[\[\["([0-9]+(?:\.[0-9]+)*)"\]\]\]/) ||
    html.match(/Current Version<\/div><span[^>]*><div[^>]*><span[^>]*>([^<]+)<\/span>/i) ||
    html.match(/softwareVersion\"\s*:\s*\"([0-9]+(?:\.[0-9]+)*)\"/i);
  const version = match?.[1]?.trim();
  return version ? version : null;
};

export const checkForAppUpdate = async (): Promise<AppUpdateInfo | null> => {
  const currentVersion = DeviceInfo.getVersion();

  const latestVersion = await fetchLatestVersionFromStore();
  if (!latestVersion) return null;

  const storeUrl = await buildStoreUrl();
  const force = false;
  const minVersion = undefined;
  const message = undefined;

  const shouldUpdate = compareVersions(latestVersion, currentVersion) === 1;

  return {
    shouldUpdate,
    force,
    latestVersion,
    minVersion,
    storeUrl,
    message,
  };
};
