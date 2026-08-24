import notifee, { AndroidForegroundServiceType, AndroidImportance } from '@notifee/react-native';
import {
  ChargingPresenceDriver,
  ChargingPresenceEndPayload,
  ChargingPresenceLinkPayload,
  ChargingPresenceStartPayload,
  ChargingPresenceUpdatePayload,
} from './types';

const NOTIFICATION_ID = 'charging-session';
const CHANNEL_ID = 'charging-session';
const END_NOTIFICATION_LINGER_MS = 3000;
const PRESS_ACTION_OPEN_CHARGING_DETAIL = 'open-charging-detail';
const CHARGING_DETAIL_DEEP_LINK = 'tanevcharger://charging-detail';

let channelReady: Promise<string> | null = null;

const ensureChannel = () => {
  if (!channelReady) {
    channelReady = notifee.createChannel({
      id: CHANNEL_ID,
      name: 'Charging Session',
      importance: AndroidImportance.DEFAULT,
    });
  }
  return channelReady;
};

const formatBody = (payload: ChargingPresenceUpdatePayload, statusLabel: string) =>
  [
    `${statusLabel} • ${Math.round(payload.batteryPercent)}%`,
    `Power: ${payload.currentPowerKw.toFixed(1)} kW`,
    `Energy: ${payload.energyKwh.toFixed(1)} kWh`,
    `Duration: ${Math.round(payload.chargingMinutes)} min`,
    `Cost: $${payload.costSoFar.toFixed(2)}`,
  ].join('\n');

const display = async (
  chargerName: string,
  payload: ChargingPresenceUpdatePayload,
  statusLabel: string,
  deepLink = CHARGING_DETAIL_DEEP_LINK,
) => {
  await ensureChannel();
  await notifee.displayNotification({
    id: NOTIFICATION_ID,
    title: chargerName,
    body: formatBody(payload, statusLabel),
    data: {
      type: 'charging-session',
      deepLink,
      screen: 'ChargingDetail',
    },
    android: {
      channelId: CHANNEL_ID,
      ongoing: true,
      colorized: true,
      onlyAlertOnce: true,
      asForegroundService: true,
      foregroundServiceTypes: [AndroidForegroundServiceType.FOREGROUND_SERVICE_TYPE_DATA_SYNC],
      largeIcon: require('@/assets/images/charging.jpeg'),
      pressAction: {
        id: PRESS_ACTION_OPEN_CHARGING_DETAIL,
      },
      progress: {
        max: 100,
        current: Math.min(100, Math.max(0, Math.round(payload.batteryPercent))),
      },
    },
  });
};

let activeChargerName = 'TAN EV Charger';
let activeDeepLink = CHARGING_DETAIL_DEEP_LINK;

const androidDriver: ChargingPresenceDriver = {
  start: (payload: ChargingPresenceStartPayload & ChargingPresenceUpdatePayload & ChargingPresenceLinkPayload) => {
    activeChargerName = payload.chargerName;
    activeDeepLink = payload.deepLink ?? CHARGING_DETAIL_DEEP_LINK;
    display(activeChargerName, payload, 'Charging', activeDeepLink);
  },
  update: (payload: ChargingPresenceUpdatePayload) => {
    display(activeChargerName, payload, 'Charging', activeDeepLink);
  },
  end: (payload: ChargingPresenceEndPayload) => {
    display(activeChargerName, payload, payload.finalStatus, activeDeepLink).then(() => {
      setTimeout(() => {
        notifee.stopForegroundService();
      }, END_NOTIFICATION_LINGER_MS);
    });
  },
};

export default androidDriver;
