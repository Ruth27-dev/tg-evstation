import React, { useEffect } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import MainHeader from '@/components/MainHeader';
import { safePadding } from '@/constants/GeneralConstants';
import { useAuth } from '@/hooks/useAuth';
import { navigate } from '@/navigation/NavigationService';
import { BASE_URL } from '@/services/useApi';
import { useMeStore } from '@/store/useMeStore';
import FastImage from 'react-native-fast-image';

const HomeScreen = () => {
  const { fetchUser } = useAuth();
  const { userData } = useMeStore();
  useEffect(() => {
    fetchUser();
  }, []);

  
  const handlePress = (menuId:string,title:string) =>{
    navigate('BettingScreen', { url:`${BASE_URL}sale/${menuId}?s_id=${userData?.s_id}`, title });
  }
  return (
    <>
      <MainHeader />
      <ScrollView contentContainerStyle={styles.container}>
      </ScrollView>
    </>
  );
}

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: safePadding,
  },
  featuredCard: {
    width: '100%',
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  card: {
    flex: 1,
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 10,
  },
  bottomRow: {
    flexDirection: 'row',
    gap: 15,
  },
});