import { Platform } from 'react-native';
import { ChargingPresenceDriver } from './types';

const noopDriver: ChargingPresenceDriver = {
  start: () => {},
  update: () => {},
  end: () => {},
};

const driver: ChargingPresenceDriver = Platform.select({
  ios: () => require('./ios').default as ChargingPresenceDriver,
  android: () => require('./android').default as ChargingPresenceDriver,
  default: () => noopDriver,
})();

export default driver;
export * from './types';
