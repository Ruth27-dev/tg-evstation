import React, { useEffect } from 'react';
import MainStackContainer from './MainStackContainer.tsx';
import { useAutoPrinterConnect } from '@/hooks/useAutoPrinterConnect.ts';
import useLocationPermission from '@/hooks/useLocationPermission.ts';
import { isEmpty } from 'lodash';

const RouteContainer = () => {
  const { permissionStatus, requestPermission ,getCurrentLocation } = useLocationPermission();
  useAutoPrinterConnect();
  useEffect(() => {
    const handlePermissionFlow = async () => {
      if (isEmpty(permissionStatus)) {
        await requestPermission();
      }
  
      await getCurrentLocation(); 
    };
  
    handlePermissionFlow();
}, []);


  return  <MainStackContainer />;
};

export default RouteContainer;
