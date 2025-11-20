import React, { useState } from 'react';
import { FlatList, View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { Colors } from '@/theme';
import { LOTTO_MENUS } from '@/types/menuDrawer';
import { useMeStore } from '@/store/useMeStore';
import { safePadding, CustomFontConstant, FontSize, Images } from '@/constants/GeneralConstants';
import DrawerChildList from './DrawerChildList';
import { closeDrawer, navigate } from '@/navigation/NavigationService';
import { BASE_URL } from '@/services/useApi';
import { useAuth } from '@/hooks/useAuth';

const CustomDrawer = () => {
  const { userData } = useMeStore();
  const [expandedMenu, setExpandedMenu] = useState<number | null>(null);
  const { logout } = useAuth();

  const handlePress = (item: any) => {
    if (item.hasChild) {
      setExpandedMenu(expandedMenu === item.id ? null : item.id);
    } else {
      closeDrawer();
      if (item.isLogout) {
        logout(userData?.s_phone_login, userData?.s_id);
      }else{
        navigate(item.path,{ url: item.isUrl ? `${BASE_URL}${item.end_point}?s_id=${userData?.s_id}` : undefined ,title: item.title});
      }
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.white, borderBottomLeftRadius:15,borderTopLeftRadius:15 }}>
      {/* Header */}
      <View style={styles.header}>
        <Image source={Images.logo} style={styles.logo} />
        <View style={{ marginLeft: 10 }}>
          <Text style={[styles.headerText, { color: Colors.white, fontSize: FontSize.large }]}>
            {userData?.s_phone_login}
          </Text>
          <Text style={[styles.headerText, { color: Colors.white, fontSize: FontSize.large }]}>
            {userData?.s_name}
          </Text>
        </View>
      </View>

      {/* Menu List */}
      <FlatList
        data={LOTTO_MENUS}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <>
            <TouchableOpacity style={styles.menuRow} onPress={() => handlePress(item)}>
              <View style={styles.menuLeft}>
                <Image source={Images[item.icon as keyof typeof Images]} style={{ width: 20, height: 20 }} />
                <Text style={styles.menuText}>{item.title}</Text>
              </View>
              {item.hasChild && (
                <Icon
                  name={expandedMenu === item.id ? 'chevron-up' : 'chevron-right'}
                  size={18}
                  color={Colors.mainColor}
                />
              )}
            </TouchableOpacity>

            {expandedMenu === item.id && item.children && (
              <DrawerChildList
                childrenMenus={item.children}
                onSelect={(child:any) => navigate(child.path,{ url: child.isUrl ? `${BASE_URL}${child.end_point}?s_id=${userData?.s_id}` : undefined ,title: child.title})}
              />
            )}
          </>
        )}
      />
    </View>
  );
};

export default CustomDrawer;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 150,
    backgroundColor: Colors.mainColor,
    paddingHorizontal: safePadding,
    borderTopLeftRadius:15
  },
  logo: { width: 100, height: 100, resizeMode: 'cover' },
  headerText: { fontFamily: CustomFontConstant.KantumruyPro },
  menuRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuLeft: { flexDirection: 'row', alignItems: 'center' },
  menuText: {
    fontFamily: CustomFontConstant.Khmer,
    fontSize: FontSize.medium,
    color: Colors.mainColor,
    marginLeft: 10,
  },
});
