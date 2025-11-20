import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { Colors } from '@/theme';
import { CustomFontConstant, FontSize } from '@/constants/GeneralConstants';

export default function DrawerChildList({ childrenMenus, onSelect }: any) {
  return (
    <View style={styles.childContainer}>
      {childrenMenus.map((child: any) => (
        <TouchableOpacity key={child.id} style={styles.childRow} onPress={() => onSelect(child)}>
          <Icon name="circle" size={15} color={Colors.mainColor} />
          <Text style={styles.childText}>{child.title}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  childContainer: { paddingLeft: 40, backgroundColor: '#f9f9f9' },
  childRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  childText: {
    fontFamily: CustomFontConstant.Khmer,
    fontSize: FontSize.small,
    color: Colors.mainColor,
    marginLeft: 8,
  },
});
