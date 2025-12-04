import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Colors } from '@/theme';
import { CustomFontConstant, FontSize } from '@/constants/GeneralConstants';

interface PaymentTermsModalProps {
    visible: boolean;
    onClose: () => void;
    onAccept: () => void;
}

const PaymentTermsModal: React.FC<PaymentTermsModalProps> = ({
    visible,
    onClose,
    onAccept,
}) => {
    return (
        <Modal
            visible={visible}
            animationType="fade"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>Payment Terms & Conditions</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Ionicons name="close" size={28} color={Colors.gray} />
                        </TouchableOpacity>
                    </View>

                    {/* Content */}
                    <ScrollView 
                        style={styles.content}
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>1. Payment Processing</Text>
                            <Text style={styles.paragraph}>
                                All payments are processed securely through our payment gateway partners. 
                                By proceeding with this payment, you authorize us to charge the specified 
                                amount to your selected payment method.
                            </Text>
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>2. Payment Confirmation</Text>
                            <Text style={styles.paragraph}>
                                Once payment is successful, you will receive a confirmation notification 
                                and the amount will be credited to your wallet immediately. Please retain 
                                your payment receipt for your records.
                            </Text>
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>3. Non-Refundable</Text>
                            <Text style={styles.paragraph}>
                                All top-up payments are final and non-refundable. Please ensure you have 
                                entered the correct amount before proceeding with the payment. The credited 
                                amount can only be used for EV charging services within our platform.
                            </Text>
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>4. Payment Security</Text>
                            <Text style={styles.paragraph}>
                                We use industry-standard encryption to protect your payment information. 
                                Your card details are never stored on our servers and are processed 
                                securely by our certified payment partners.
                            </Text>
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>5. Transaction Fees</Text>
                            <Text style={styles.paragraph}>
                                Transaction fees, if applicable, will be clearly displayed before payment 
                                confirmation. The total amount charged will include any applicable fees 
                                as shown on the payment screen.
                            </Text>
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>6. Failed Transactions</Text>
                            <Text style={styles.paragraph}>
                                If a payment fails, no amount will be deducted from your account. 
                                In case of any discrepancy where payment was deducted but not credited 
                                to your wallet, please contact our customer support within 24 hours 
                                with your transaction reference.
                            </Text>
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>7. Wallet Balance Usage</Text>
                            <Text style={styles.paragraph}>
                                The wallet balance can be used exclusively for charging your electric 
                                vehicle at any of our partner charging stations. The balance does not 
                                expire but cannot be transferred to other users or withdrawn as cash.
                            </Text>
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>8. Dispute Resolution</Text>
                            <Text style={styles.paragraph}>
                                Any disputes regarding payments should be reported to our customer 
                                support team within 30 days of the transaction date. We will investigate 
                                and resolve the issue in accordance with our dispute resolution policy.
                            </Text>
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>9. Terms Modification</Text>
                            <Text style={styles.paragraph}>
                                We reserve the right to modify these terms at any time. Continued use 
                                of our payment services constitutes acceptance of any modifications to 
                                these terms and conditions.
                            </Text>
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

export default PaymentTermsModal;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
    },
    modalContainer: {
        backgroundColor: Colors.white,
        paddingTop: 20,
        height: '80%',
        margin:20,
        borderRadius: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    title: {
        fontSize: FontSize.large,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.mainColor,
        fontWeight: '700',
        flex: 1,
    },
    closeButton: {
        padding: 4,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: FontSize.medium + 1,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.mainColor,
        fontWeight: '700',
        marginBottom: 8,
    },
    paragraph: {
        fontSize: FontSize.small + 1,
        fontFamily: CustomFontConstant.EnRegular,
        color: '#6B7280',
        lineHeight: 22,
        textAlign: 'justify',
    },
    agreementBox: {
        flexDirection: 'row',
        backgroundColor: '#EFF6FF',
        borderRadius: 12,
        padding: 16,
        marginTop: 8,
        marginBottom: 20,
        gap: 12,
        borderLeftWidth: 4,
        borderLeftColor: Colors.mainColor,
    },
    agreementText: {
        flex: 1,
        fontSize: FontSize.small,
        fontFamily: CustomFontConstant.EnRegular,
        color: Colors.mainColor,
        lineHeight: 20,
    },
    footer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 16,
        paddingBottom: 32,
        gap: 12,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        backgroundColor: Colors.white,
    },
    declineButton: {
        flex: 1,
        paddingVertical: 16,
        borderRadius: 12,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    declineButtonText: {
        fontSize: FontSize.medium,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.gray,
        fontWeight: '700',
    },
    acceptButton: {
        flex: 1.5,
        flexDirection: 'row',
        paddingVertical: 16,
        borderRadius: 12,
        backgroundColor: Colors.mainColor,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        shadowColor: Colors.mainColor,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    acceptButtonText: {
        fontSize: FontSize.medium,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.white,
        fontWeight: '700',
    },
});
