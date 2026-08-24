import { useEffect, useRef } from 'react';
import { isEmpty } from 'lodash';
import { useEVStore } from '@/store/useEVStore';
import { useSessionDetailStore } from '@/store/useSessionDetailStore';
import { useStationStore } from '@/store/useStationStore';
import { SessionDetail } from '@/types';
import chargingPresence from './index';
import { ChargingPresenceUpdatePayload } from './types';

const DEFAULT_CHARGER_NAME = 'TAN EV Charger';

const toUpdatePayload = (sessionDetail: SessionDetail): ChargingPresenceUpdatePayload => ({
  status: sessionDetail.status ?? 'Charging',
  batteryPercent: sessionDetail.current_soc ?? 0,
  currentPowerKw: sessionDetail.current_power_kw ?? 0,
  averagePowerKw: sessionDetail.average_power_kw ?? 0,
  energyKwh: sessionDetail.energy_kwh ?? 0,
  chargingMinutes: sessionDetail.charging_minutes ?? 0,
  costSoFar: sessionDetail.price_so_far ?? 0,
});

const zeroedPayload: ChargingPresenceUpdatePayload = {
  status: 'Charging',
  batteryPercent: 0,
  currentPowerKw: 0,
  averagePowerKw: 0,
  energyKwh: 0,
  chargingMinutes: 0,
  costSoFar: 0,
};

const buildChargingDetailLink = (sessionId: string) =>
  `tanevcharger://charging-detail?sessionId=${encodeURIComponent(sessionId)}`;

/**
 * Mirrors the active charging session onto the iOS Lock Screen / Dynamic Island
 * (Live Activity) and the Android persistent notification (Foreground Service).
 * Reads directly from the ev/session zustand stores so it never touches the
 * existing WebSocket/session-detail logic.
 */
export const ChargingPresenceManager = () => {
  const evConnect = useEVStore((s) => s.evConnect);
  const sessionDetail = useSessionDetailStore((s) => s.sessionDetail);
  const isActiveRef = useRef(false);
  const lastDetailRef = useRef<SessionDetail | null>(null);

  useEffect(() => {
    if (sessionDetail) {
      lastDetailRef.current = sessionDetail;
    }
  }, [sessionDetail]);

  useEffect(() => {
    const hasSession = !isEmpty(evConnect) && Boolean(evConnect?.session_id);

    if (hasSession && !isActiveRef.current) {
      isActiveRef.current = true;
      const chargerName = useStationStore.getState().selectedStation?.name ?? DEFAULT_CHARGER_NAME;
      chargingPresence.start({
        sessionId: String(evConnect.session_id),
        deepLink: buildChargingDetailLink(String(evConnect.session_id)),
        chargerName,
        ...zeroedPayload,
      });
      return;
    }

    if (!hasSession && isActiveRef.current) {
      isActiveRef.current = false;
      const finalDetail = lastDetailRef.current;
      chargingPresence.end({
        ...(finalDetail ? toUpdatePayload(finalDetail) : zeroedPayload),
        finalStatus: 'Charging Complete',
      });
      lastDetailRef.current = null;
    }
  }, [evConnect]);

  useEffect(() => {
    if (!isActiveRef.current || !sessionDetail) return;
    chargingPresence.update(toUpdatePayload(sessionDetail));
  }, [sessionDetail]);

  return null;
};
