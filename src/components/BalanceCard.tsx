import { FontSize, CustomFontConstant } from "@/constants/GeneralConstants";
import { Colors } from "@/theme";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { navigate } from "@/navigation/NavigationService";

interface BalanceCardProps{
    amount?:number;
}
const BalanceCard = ({amount}: BalanceCardProps) => {
    return (
        <View style={styles.balanceCard}>
            <View style={styles.balanceContent}>
                <View>
                    <Text style={styles.balanceLabel}>Current Balance</Text>
                    <Text style={styles.balanceAmount}>${amount?.toFixed(2)}</Text>
                </View>
                <TouchableOpacity 
                    style={styles.topUpButton} 
                    activeOpacity={0.8}
                    onPress={() => navigate('TopUp')}
                >
                    <Ionicons name="add-circle" size={24} color={Colors.white} />
                    <Text style={styles.topUpText}>Top Up</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}
export default BalanceCard;

const styles = StyleSheet.create({
    balanceCard: {
        backgroundColor: Colors.mainColor,
        marginHorizontal: 20,
        marginTop: 20,
        marginBottom: 24,
        padding: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 5,
    },
    balanceContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    balanceLabel: {
        fontSize: FontSize.small + 1,
        fontFamily: CustomFontConstant.EnRegular,
        color: 'rgba(255,255,255,0.85)',
        fontWeight: '500',
        marginBottom: 8,
    },
    balanceAmount: {
        fontSize: 25,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.white
    },
    topUpButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 10,
        gap: 8,
    },
    topUpText: {
        fontSize: FontSize.medium,
        fontFamily: CustomFontConstant.EnRegular,
        color: Colors.white,
        fontWeight: '700',
    },
})