import React from 'react';
import MainStackContainer from './MainStackContainer.tsx';
import useLocationPermission from '@/hooks/useLocationPermission.ts';

const RouteContainer = () => {
  // Priming call: the hook itself owns the full permission + location flow
  // (including retries on app resume), so it only needs to be mounted once here.
  useLocationPermission();

  return <MainStackContainer />;
};

export default RouteContainer;
