import { NativeModules } from 'react-native';
import {
  ChargingPresenceDriver,
  ChargingPresenceEndPayload,
  ChargingPresenceStartPayload,
  ChargingPresenceUpdatePayload,
} from './types';

const { ChargingActivityModule } = NativeModules as {
  ChargingActivityModule?: {
    startActivity: (payload: object) => void;
    updateActivity: (payload: object) => void;
    endActivity: (payload: object) => void;
  };
};

const iosDriver: ChargingPresenceDriver = {
  start: (payload: ChargingPresenceStartPayload & ChargingPresenceUpdatePayload) => {
    ChargingActivityModule?.startActivity(payload);
  },
  update: (payload: ChargingPresenceUpdatePayload) => {
    ChargingActivityModule?.updateActivity(payload);
  },
  end: (payload: ChargingPresenceEndPayload) => {
    ChargingActivityModule?.endActivity(payload);
  },
};

export default iosDriver;
