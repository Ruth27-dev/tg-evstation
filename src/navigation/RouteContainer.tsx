import React, { useEffect } from 'react';
import MainStackContainer from './MainStackContainer.tsx';
import { useAutoPrinterConnect } from '@/hooks/useAutoPrinterConnect.ts';

const RouteContainer = () => {
  useAutoPrinterConnect();

  return  <MainStackContainer />;
};

export default RouteContainer;
