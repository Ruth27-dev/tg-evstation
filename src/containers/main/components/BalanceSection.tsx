import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Colors } from '@/theme';
import { CustomFontConstant, FontSize } from '@/constants/GeneralConstants';
import TextTranslation from '@/components/TextTranslation';
import { useMeStore } from '@/store/useMeStore';

interface BalanceSectionProps {
    balance: number;
    currency: string;
    onRefresh: () => void;
    onTopUp: () => void;
}

const BalanceSection: React.FC<BalanceSectionProps> = ({ balance, currency, onRefresh, onTopUp }) => {
    const { userData } = useMeStore();

    return (
        <LinearGradient
            colors={[Colors.darkColor, '#0d4f72']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.card}
        >
            <View style={styles.decCircle} />

            <View style={styles.topRow}>
                <Text style={styles.userName}>{userData?.user_name ?? 'User'}</Text>
                <TouchableOpacity onPress={onRefresh} style={styles.refreshBtn} activeOpacity={0.7}>
                    <Ionicons name="refresh" size={15} color={Colors.white} />
                </TouchableOpacity>
            </View>

            <View style={styles.bottomRow}>
                <View>
                    <Text style={styles.balanceLabel}>WALLET BALANCE</Text>
                    <Text style={styles.balanceAmount}>{currency} {balance.toFixed(2)}</Text>
                </View>
                <View style={styles.rightActions}>
                    <View style={styles.flashCircle}>
                        <Ionicons name="flash" size={22} color={Colors.primaryColor} />
                    </View>
                    <TouchableOpacity style={styles.topUpButton} onPress={onTopUp} activeOpacity={0.85}>
                        <Ionicons name="add" size={13} color={Colors.darkColor} />
                        <TextTranslation fontSize={11} color={Colors.darkColor} textKey="wallet.topUp" />
                    </TouchableOpacity>
                </View>
            </View>
        </LinearGradient>
    );
};

export default BalanceSection;

const styles = StyleSheet.create({
    card: {
        borderRadius: 16,
        paddingVertical: 14,
        paddingHorizontal: 16,
        marginBottom: 20,
        overflow: 'hidden',
        shadowColor: Colors.darkColor,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 8,
    },
    decCircle: {
        position: 'absolute',
        width: 160,
        height: 160,
        borderRadius: 80,
        backgroundColor: 'rgba(255,255,255,0.05)',
        top: -60,
        right: -40,
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    userName: {
        fontSize: 13,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.white,
        textTransform: 'uppercase',
    },
    refreshBtn: {
        padding: 5,
        backgroundColor: 'rgba(255,255,255,0.12)',
        borderRadius: 16,
    },
    bottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    balanceLabel: {
        fontSize: 9,
        fontFamily: CustomFontConstant.EnRegular,
        color: 'rgba(255,255,255,0.55)',
        letterSpacing: 0.8,
        marginBottom: 2,
    },
    balanceAmount: {
        fontSize: 26,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.white,
    },
    rightActions: {
        alignItems: 'flex-end',
        gap: 6,
    },
    flashCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        borderColor: 'rgba(241,177,29,0.35)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    topUpButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: Colors.primaryColor,
        borderRadius: 20,
        paddingVertical: 6,
        paddingHorizontal: 12,
    },
});
