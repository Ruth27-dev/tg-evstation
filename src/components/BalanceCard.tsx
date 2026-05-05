import { FontSize, CustomFontConstant } from "@/constants/GeneralConstants";
import { Colors } from "@/theme";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { navigate } from "@/navigation/NavigationService";
import TextTranslation from "./TextTranslation";

interface BalanceCardProps{
    amount?:number;
    currency?:string;
}
const BalanceCard = ({amount, currency = '$'}: BalanceCardProps) => {
    return (
        <View style={styles.balanceCard}>
            {/* Decorative circles */}
            <View style={styles.circle1} />
            <View style={styles.circle2} />

            {/* Header */}
            <View style={styles.cardHeader}>
                <View style={styles.walletIconWrapper}>
                    <Ionicons name="wallet-outline" size={18} color={Colors.white} />
                </View>
                <TextTranslation textKey="wallet.totalBalance" fontSize={FontSize.small} color="rgba(255,255,255,0.75)" />
            </View>

            {/* Balance amount */}
            <Text style={styles.balanceAmount}>
                {currency} {amount?.toFixed(2)}
            </Text>

            {/* Top Up button */}
            <TouchableOpacity
                style={styles.topUpButton}
                activeOpacity={0.85}
                onPress={() => navigate('TopUp')}
            >
                <Ionicons name="add-circle-outline" size={20} color={Colors.mainColor} />
                <TextTranslation textKey="wallet.topUp" fontSize={FontSize.medium} color={Colors.mainColor} isBold />
            </TouchableOpacity>
        </View>
    )
}
export default BalanceCard;

const styles = StyleSheet.create({
    balanceCard: {
        backgroundColor: Colors.mainColor,
        marginHorizontal: 20,
        marginTop: 10,
        marginBottom: 20,
        padding: 24,
        borderRadius: 20,
        overflow: 'hidden',
        elevation: 6,
        shadowColor: Colors.mainColor,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
    },
    circle1: {
        position: 'absolute',
        width: 160,
        height: 160,
        borderRadius: 80,
        backgroundColor: 'rgba(255,255,255,0.06)',
        top: -40,
        right: -30,
    },
    circle2: {
        position: 'absolute',
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(255,255,255,0.06)',
        bottom: -20,
        right: 60,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 16,
    },
    walletIconWrapper: {
        width: 32,
        height: 32,
        borderRadius: 10,
        backgroundColor: 'rgba(255,255,255,0.15)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    balanceAmount: {
        fontSize: 32,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.white,
        marginBottom: 24,
        letterSpacing: 0.5,
    },
    topUpButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.white,
        paddingVertical: 12,
        borderRadius: 12,
        gap: 8,
    },
});
