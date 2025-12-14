import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Colors } from '@/theme';
import { CustomFontConstant, FontSize } from '@/constants/GeneralConstants';
import TextTranslation from '@/components/TextTranslation';
import { useMeStore } from '@/store/useMeStore';

interface BalanceSectionProps {
    balance: number;
    currency: string;
    onRefresh: () => void;
}

const BalanceSection: React.FC<BalanceSectionProps> = ({ balance, currency, onRefresh }) => {
    const { userData } = useMeStore();

    return (
        <View style={styles.balanceContainer}>
            <View style={styles.balanceCard}>
                <View style={styles.balanceHeader}>
                    <Text style={styles.balanceLabel}>{userData?.user_name}</Text>
                    <TouchableOpacity onPress={onRefresh}>
                        <Ionicons name="refresh" size={20} color={Colors.secondaryColor} />
                    </TouchableOpacity>
                </View>
                <Text style={styles.balanceAmount}>
                    $ {balance.toFixed(2)}
                </Text>
                <View style={styles.goldBorder} />
            </View>
        </View>
    );
};

export default BalanceSection;

const styles = StyleSheet.create({
    balanceContainer: {
        marginBottom: 20,
    },
    balanceCard: {
        backgroundColor: '#ffffff',
        borderRadius: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: Colors.secondaryColor,
        position: 'relative',
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    balanceHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    balanceLabel: {
        fontSize: FontSize.medium,
        fontFamily: CustomFontConstant.EnRegular,
        color: Colors.mainColor,
        textTransform: 'uppercase',
    },
    balanceAmount: {
        fontSize: 25,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.mainColor,
    },
    goldBorder: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 3,
        backgroundColor: Colors.secondaryColor,
    },
});
