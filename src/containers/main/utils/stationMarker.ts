import { Connector, Content } from '@/types';

export const MarkerColors = {
    available: '#14B8A6',
    busy: '#F59E0B',
    offline: '#64748B',
} as const;

export const MARKER_ICON = 'flash';

const stationConnectors = (station: Content): Connector[] =>
    station.chargers?.flatMap((charger) => charger.connector || []) ?? [];

export const getStationMarkerColor = (station: Content): string => {
    const connectors = stationConnectors(station);
    if (connectors.some((c) => c.status === 'AVAILABLE' || c.status === 'PREPARING')) {
        return MarkerColors.available;
    }
    if (connectors.some((c) => c.status === 'CHARGING')) {
        return MarkerColors.busy;
    }
    return MarkerColors.offline;
};

// GB/T and CCS variants are DC fast-charging standards; everything else
// (Type2, J1772, ...) is treated as AC. There's no explicit AC/DC field on
// Connector, so this is inferred from the known standard names.
const DC_CONNECTOR_TYPES = new Set(['CCS2', 'CCS1', 'CCS', 'GBT', 'GB/T', 'CHADEMO']);

export const isDcConnectorType = (type?: string | null): boolean =>
    !!type && DC_CONNECTOR_TYPES.has(type.toUpperCase());

export const stationHasAvailableConnector = (station: Content): boolean =>
    stationConnectors(station).some((c) => c.status === 'AVAILABLE' || c.status === 'PREPARING');

export const stationHasDcFastConnector = (station: Content): boolean =>
    stationConnectors(station).some((c) => isDcConnectorType(c.type));

export const stationHasAcConnector = (station: Content): boolean =>
    stationConnectors(station).some((c) => !!c.type && !isDcConnectorType(c.type));

export const stationHasFreeParking = (station: Content): boolean => station.parking_fee === false;

// Chargers at the same station can be priced independently, so surface the
// cheapest rate on offer rather than assuming a single station-wide price.
export const getStationPrice = (station: Content): number | null => {
    const prices = (station.chargers ?? [])
        .map((charger) => charger.price_per_kwh)
        .filter((price): price is number => typeof price === 'number');
    if (!prices.length) return null;
    return Math.min(...prices);
};

export interface ConnectorBadge {
    label: 'DC' | 'AC';
    available: number;
    total: number;
}

// One badge per power type present at the station (e.g. "DC 2/2"), so a
// station with both a DC and an AC charger shows two badges.
export const getConnectorBadges = (station: Content): ConnectorBadge[] => {
    const connectors = stationConnectors(station);
    const dc = connectors.filter((c) => isDcConnectorType(c.type));
    const ac = connectors.filter((c) => c.type && !isDcConnectorType(c.type));

    const toBadge = (label: 'DC' | 'AC', list: Connector[]): ConnectorBadge | null => {
        if (!list.length) return null;
        const available = list.filter((c) => c.status === 'AVAILABLE' || c.status === 'PREPARING').length;
        return { label, available, total: list.length };
    };

    return [toBadge('DC', dc), toBadge('AC', ac)].filter((b): b is ConnectorBadge => b !== null);
};

const NEW_STATION_WINDOW_MS = 30 * 24 * 60 * 60 * 1000;

export const isNewStation = (station: Content): boolean => {
    if (!station.created_at) return false;
    const created = new Date(station.created_at).getTime();
    if (Number.isNaN(created)) return false;
    return Date.now() - created < NEW_STATION_WINDOW_MS;
};
