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
    onTopUp: () => void;
}

const BalanceSection: React.FC<BalanceSectionProps> = ({ balance, currency, onRefresh, onTopUp }) => {
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
                <View style={styles.balanceHeader}>
                    <Text style={styles.balanceAmount}>
                        $ {balance.toFixed(2)}
                    </Text>
                    <TouchableOpacity style={styles.topUpButton} onPress={onTopUp}>
                        <Ionicons name="add-circle-outline" size={18} color={Colors.secondaryColor} style={{paddingRight:5}}/>
                        <TextTranslation fontSize={FontSize.medium} color={Colors.mainColor} textKey="wallet.topUp" />
                    </TouchableOpacity>
                </View>
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
        marginBottom: 7,
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
    topUpButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.white,
        borderColor: Colors.secondaryColor,
        borderWidth: 1,
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 12,
        marginTop: 12,
        alignSelf: 'flex-start',
    },
    topUpText: {
        fontSize: FontSize.small,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.secondaryColor,
        marginLeft: 6,
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
