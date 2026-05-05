import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import LinearGradient from 'react-native-linear-gradient';
import { Colors } from '@/theme';
import { CustomFontConstant, FontSize } from '@/constants/GeneralConstants';
import TextTranslation from '@/components/TextTranslation';

interface MenuItem {
    id: number;
    name: string;
    subtitle?: string;
    icon: string;
    iconLib?: 'ionicons' | 'fontawesome5';
    color?: string;
    onPress: () => void;
}

interface MenuGridProps {
    menuItems: MenuItem[];
}

const MenuGrid: React.FC<MenuGridProps> = ({ menuItems }) => {
    const [featured, ...rest] = menuItems;

    const renderIcon = (item: MenuItem, size: number, color: string) => {
        if (item.iconLib === 'fontawesome5') {
            return <FontAwesome5 name={item.icon as any} size={size} color={color} />;
        }
        return <Ionicons name={item.icon as any} size={size} color={color} />;
    };

    return (
        <View style={styles.container}>
            {/* Featured card */}
            {featured && (
                <TouchableOpacity activeOpacity={0.82} onPress={featured.onPress} style={styles.featuredWrapper}>
                    <LinearGradient
                        colors={[Colors.darkColor, Colors.mainColor]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.featuredCard}
                    >
                        <View style={styles.featuredDecCircle} />

                        <View style={styles.featuredIconCircle}>
                            {renderIcon(featured, 32, Colors.primaryColor)}
                        </View>

                        <View style={styles.featuredText}>
                            <TextTranslation
                                textKey={featured.name}
                                fontSize={FontSize.medium}
                                color={Colors.white}
                            />
                            {featured.subtitle && (
                                <TextTranslation
                                    textKey={featured.subtitle}
                                    fontSize={11}
                                    color="rgba(255,255,255,0.55)"
                                />
                            )}
                        </View>

                        <View style={styles.featuredArrow}>
                            <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.6)" />
                        </View>
                    </LinearGradient>
                </TouchableOpacity>
            )}

            {/* Secondary cards row */}
            {rest.length > 0 && (
                <View style={styles.row}>
                    {rest.map((item) => {
                        const color = item.color ?? Colors.mainColor;
                        return (
                            <TouchableOpacity
                                key={item.id}
                                style={styles.card}
                                onPress={item.onPress}
                                activeOpacity={0.75}
                            >
                                <View style={[styles.iconCircle, { backgroundColor: `${color}15` }]}>
                                    {renderIcon(item, 26, color)}
                                </View>
                                <TextTranslation
                                    textKey={item.name}
                                    fontSize={12}
                                    color={Colors.darkColor}
                                />
                                <View style={[styles.bottomStrip, { backgroundColor: color }]} />
                            </TouchableOpacity>
                        );
                    })}
                </View>
            )}
        </View>
    );
};

export default MenuGrid;

const styles = StyleSheet.create({
    container: {
        gap: 12,
    },
    featuredWrapper: {
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: Colors.darkColor,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 6,
    },
    featuredCard: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 20,
        paddingHorizontal: 18,
        gap: 14,
        overflow: 'hidden',
    },
    featuredDecCircle: {
        position: 'absolute',
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: 'rgba(255,255,255,0.05)',
        right: -30,
        top: -30,
    },
    featuredIconCircle: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1.5,
        borderColor: 'rgba(241,177,29,0.35)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    featuredText: {
        flex: 1,
        gap: 3,
    },
    featuredArrow: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    row: {
        flexDirection: 'row',
        gap: 12,
    },
    card: {
        flex: 1,
        height: 96,
        backgroundColor: Colors.white,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.07,
        shadowRadius: 6,
        elevation: 3,
    },
    iconCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bottomStrip: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 3,
    },
});
