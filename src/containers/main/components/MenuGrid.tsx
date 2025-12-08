import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import LinearGradient from 'react-native-linear-gradient';
import { Colors } from '@/theme';
import { CustomFontConstant, FontSize, safePadding } from '@/constants/GeneralConstants';

interface MenuItem {
    id: number;
    name: string;
    icon: string;
    color: string;
    onPress: () => void;
}

interface MenuGridProps {
    menuItems: MenuItem[];
}

const MenuGrid: React.FC<MenuGridProps> = ({ menuItems }) => {
    return (
        <View style={styles.menuContainer}>
            <View style={styles.menuTopRow}>
                {menuItems.slice(0, 2).map((item) => (
                    <TouchableOpacity
                        key={item.id}
                        style={styles.menuIconSmall}
                        onPress={item.onPress}
                        activeOpacity={0.7}
                    >
                       
                        <Ionicons name={item.icon as any} size={50} color={Colors.mainColor} />
                        <View style={styles.menuGoldBorder} />
                        <Text style={styles.menuText}>{item.name}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {menuItems.length > 2 && (
                <View style={styles.menuBottomRow}>
                    <TouchableOpacity
                        style={styles.menuIconLarge}
                        onPress={menuItems[2].onPress}
                        activeOpacity={0.7}
                    >
                        
                        <FontAwesome5 name={menuItems[2].icon as any} size={60} color={Colors.mainColor} />
                        <View style={styles.menuGoldBorder} />
                        <Text style={styles.menuTextLarge}>{menuItems[2].name}</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

export default MenuGrid;

const styles = StyleSheet.create({
    menuContainer: {
        marginTop: 10,
        gap: 12,
        marginBottom: safePadding,
    },
    menuTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
    },
    menuIconSmall: {
        width: '48%',
        height: 100,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#ffffff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
        borderWidth: 1,
        borderColor: Colors.secondaryColor,
    },
    menuBottomRow: {
        alignItems: 'center',
        marginTop: 5,
    },
    menuIconLarge: {
        width: '100%',
        height: 140,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#ffffff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
        borderWidth: 1,
        borderColor: Colors.secondaryColor,
    },
    menuGoldBorder: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 3,
        backgroundColor: Colors.secondaryColor,
    },
    menuText: {
        fontSize: FontSize.medium,
        fontFamily: CustomFontConstant.EnRegular,
        color: Colors.black,
        textAlign: 'center',
        paddingTop: 5,
    },
    menuTextLarge: {
        fontSize: FontSize.medium,
        fontFamily: CustomFontConstant.EnRegular,
        color: Colors.black,
        textAlign: 'center',
        paddingTop: 5,
    },
});
