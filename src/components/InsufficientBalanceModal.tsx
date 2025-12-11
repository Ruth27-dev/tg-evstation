import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Dimensions } from 'react-native';
import { Colors } from '@/theme';
import { CustomFontConstant, FontSize } from '@/constants/GeneralConstants';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');

interface InsufficientBalanceModalProps {
    visible: boolean;
    currentBalance: string;
    currency: string;
    onClose: () => void;
    onTopUp: () => void;
}

const InsufficientBalanceModal: React.FC<InsufficientBalanceModalProps> = ({
    visible,
    currentBalance,
    currency,
    onClose,
    onTopUp,
}) => {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    {/* Icon Section */}
                    <View style={styles.iconContainer}>
                        <View style={styles.iconCircle}>
                            <MaterialCommunityIcons 
                                name="wallet-outline" 
                                size={50} 
                                color={Colors.secondaryColor} 
                            />
                        </View>
                        <View style={styles.warningBadge}>
                            <Ionicons name="warning" size={20} color="#fff" />
                        </View>
                    </View>

                    {/* Title */}
                    <Text style={styles.title}>Insufficient Balance</Text>

                    {/* Message */}
                    <Text style={styles.message}>
                        Your current balance is too low to start a charging session.
                    </Text>

                    {/* Balance Display */}
                    <View style={styles.balanceCard}>
                        <Text style={styles.balanceLabel}>Current Balance</Text>
                        <View style={styles.balanceRow}>
                            <Text style={styles.balanceAmount}>{currency} {currentBalance}</Text>
                            <View style={styles.lowBadge}>
                                <Text style={styles.lowBadgeText}>Low</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.infoBox}>
                        <Ionicons name="information-circle" size={18} color={Colors.secondaryColor} />
                        <Text style={styles.infoText}>
                            Please top up your wallet to continue
                        </Text>
                    </View>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity 
                            style={styles.cancelButton}
                            onPress={onClose}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={styles.topUpButton}
                            onPress={onTopUp}
                            activeOpacity={0.8}
                        >
                            <Ionicons name="add-circle" size={20} color="#fff" />
                            <Text style={styles.topUpButtonText}>Top Up</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default InsufficientBalanceModal;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    modalContainer: {
        width: width - 40,
        maxWidth: 400,
        backgroundColor: Colors.white,
        borderRadius: 24,
        padding: 24,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    iconContainer: {
        position: 'relative',
        marginBottom: 20,
    },
    iconCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: Colors.backGroundColor,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: Colors.secondaryColor,
    },
    warningBadge: {
        position: 'absolute',
        top: -5,
        right: -5,
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#EF4444',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: Colors.white,
    },
    title: {
        fontSize: FontSize.large + 2,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.mainColor,
        marginBottom: 12,
        textAlign: 'center',
    },
    message: {
        fontSize: FontSize.medium,
        fontFamily: CustomFontConstant.EnRegular,
        color: Colors.mainColor,
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 20,
        opacity: 0.8,
    },
    balanceCard: {
        width: '100%',
        backgroundColor: Colors.backGroundColor,
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: Colors.secondaryColor,
    },
    balanceLabel: {
        fontSize: FontSize.small,
        fontFamily: CustomFontConstant.EnRegular,
        color: Colors.mainColor,
        marginBottom: 8,
        opacity: 0.7,
    },
    balanceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    balanceAmount: {
        fontSize: FontSize.large + 4,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.mainColor,
    },
    lowBadge: {
        backgroundColor: '#FEE2E2',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#EF4444',
    },
    lowBadgeText: {
        fontSize: FontSize.small - 1,
        fontFamily: CustomFontConstant.EnBold,
        color: '#EF4444',
    },
    infoBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.backGroundColor,
        padding: 12,
        borderRadius: 12,
        marginBottom: 24,
        gap: 8,
        borderWidth: 1,
        borderColor: Colors.secondaryColor,
    },
    infoText: {
        flex: 1,
        fontSize: FontSize.small,
        fontFamily: CustomFontConstant.EnRegular,
        color: Colors.mainColor,
        lineHeight: 18,
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 12,
        width: '100%',
    },
    cancelButton: {
        flex: 1,
        backgroundColor: Colors.backGroundColor,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: Colors.secondaryColor,
        height:50
    },
    cancelButtonText: {
        fontSize: FontSize.medium,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.mainColor,
    },
    topUpButton: {
        flex: 1,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: Colors.mainColor,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    topUpGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        gap: 8,
    },
    topUpButtonText: {
        fontSize: FontSize.medium,
        fontFamily: CustomFontConstant.EnRegular,
        color: '#fff',
        paddingLeft: 5
    },
});
