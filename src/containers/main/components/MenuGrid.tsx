import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { Colors } from '@/theme';
import { FontSize, safePadding } from '@/constants/GeneralConstants';
import TextTranslation from '@/components/TextTranslation';

interface MenuItem {
    id: number;
    name: string;
    icon: string;
    iconLib?: 'ionicons' | 'fontawesome5';
    color?: string;
    onPress: () => void;
}

interface MenuGridProps {
    menuItems: MenuItem[];
}

const MenuGrid: React.FC<MenuGridProps> = ({ menuItems }) => {
    const rows: MenuItem[][] = [];
    for (let i = 0; i < menuItems.length; i += 3) {
        rows.push(menuItems.slice(i, i + 3));
    }

    const renderIcon = (item: MenuItem) => {
        const iconColor = item.color ?? Colors.mainColor;
        if (item.iconLib === 'fontawesome5') {
            return <FontAwesome5 name={item.icon as any} size={35} color={iconColor} />;
        }
        return <Ionicons name={item.icon as any} size={35} color={iconColor} />;
    };

    return (
        <View style={styles.menuContainer}>
            {rows.map((row, rowIndex) => (
                <View key={rowIndex} style={styles.row}>
                    {row.map((item) => (
                        <TouchableOpacity
                            key={item.id}
                            style={[
                                styles.menuItem,
                                row.length === 1 && styles.menuItemFull,
                            ]}
                            onPress={item.onPress}
                            activeOpacity={0.7}
                        >
                            {renderIcon(item)}
                            <View style={[styles.menuBottomBorder, { backgroundColor: item.color ?? Colors.secondaryColor }]} />
                            <View style={{ height: 5 }} />
                            <TextTranslation textKey={item.name} fontSize={FontSize.medium} color={item.color ?? Colors.mainColor} />
                        </TouchableOpacity>
                    ))}
                </View>
            ))}
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
    row: {
        flexDirection: 'row',
        gap: 12,
    },
    menuItem: {
        flex: 1,
        height: 90,
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
    menuItemFull: {
        flex: 1,
    },
    menuBottomBorder: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 3,
    },
});
