export interface ChargingPresenceStartPayload {
  sessionId: string;
  chargerName: string;
}

export interface ChargingPresenceUpdatePayload {
  status: string;
  batteryPercent: number;
  currentPowerKw: number;
  averagePowerKw: number;
  energyKwh: number;
  chargingMinutes: number;
  costSoFar: number;
}

export interface ChargingPresenceLinkPayload {
  deepLink?: string;
}

export interface ChargingPresenceEndPayload extends ChargingPresenceUpdatePayload {
  finalStatus: string;
}

export interface ChargingPresenceDriver {
  start: (payload: ChargingPresenceStartPayload & ChargingPresenceUpdatePayload & ChargingPresenceLinkPayload) => void;
  update: (payload: ChargingPresenceUpdatePayload) => void;
  end: (payload: ChargingPresenceEndPayload) => void;
}
