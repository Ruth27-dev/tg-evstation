import { useCallback, useRef } from 'react';
import MapView from 'react-native-maps';

export const MIN_ZOOM = 3;
export const MAX_ZOOM = 19;
export const DEFAULT_ZOOM = 15;
const CAMERA_ANIMATION_MS = 700;
const ZOOM_ANIMATION_MS = 300;

/**
 * Camera helpers shared by MapScreen and StationMap.
 * Keeps camera moves on the native animateCamera API (no map remount) and
 * makes sure we only auto-center on the user once per screen visit — after
 * that the user can freely pan/zoom without the camera fighting them back.
 */
export const useMapCamera = (mapRef: React.RefObject<MapView | null>) => {
    const hasCenteredRef = useRef(false);
    const isZoomingRef = useRef(false);

    const animateToCoordinate = useCallback((latitude: number, longitude: number, zoom: number = DEFAULT_ZOOM) => {
        mapRef.current?.animateCamera(
            { center: { latitude, longitude }, zoom },
            { duration: CAMERA_ANIMATION_MS }
        );
    }, [mapRef]);

    const centerOnUserOnce = useCallback((latitude: number, longitude: number) => {
        if (hasCenteredRef.current) return;
        hasCenteredRef.current = true;
        animateToCoordinate(latitude, longitude, DEFAULT_ZOOM);
    }, [animateToCoordinate]);

    const zoomBy = useCallback(async (delta: number) => {
        if (!mapRef.current || isZoomingRef.current) return;
        isZoomingRef.current = true;
        try {
            const camera = await mapRef.current.getCamera();
            const currentZoom = camera.zoom ?? DEFAULT_ZOOM;
            const nextZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, currentZoom + delta));
            mapRef.current.animateCamera({ ...camera, zoom: nextZoom }, { duration: ZOOM_ANIMATION_MS });
        } finally {
            setTimeout(() => { isZoomingRef.current = false; }, ZOOM_ANIMATION_MS);
        }
    }, [mapRef]);

    const zoomIn = useCallback(() => zoomBy(1), [zoomBy]);
    const zoomOut = useCallback(() => zoomBy(-1), [zoomBy]);

    return { hasCenteredRef, animateToCoordinate, centerOnUserOnce, zoomIn, zoomOut };
};
