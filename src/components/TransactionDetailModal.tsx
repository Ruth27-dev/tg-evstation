import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Colors } from '@/theme';
import { CustomFontConstant, FontSize } from '@/constants/GeneralConstants';
import { Transaction } from '@/types';
import moment from 'moment';

interface TransactionDetailModalProps {
    visible: boolean;
    transaction: Transaction | null;
    onClose: () => void;
}

const TransactionDetailModal: React.FC<TransactionDetailModalProps> = ({
    visible,
    transaction,
    onClose,
}) => {
    const getTransactionIcon = (type: string) => {
        switch (type) {
            case 'TOPUP':
                return 'arrow-down-circle';
            case 'CHARGE':
                return 'arrow-up-circle';
            default:
                return 'arrow-down-circle';
        }
    };

    const getTransactionColor = (type: string) => {
        switch (type) {
            case 'TOPUP':
                return Colors.secondaryColor;
            case 'CHARGE':
                return '#EF4444';
            default:
                return Colors.mainColor;
        }
    };

     const getSymbolForTransaction = (type: string) => {
        switch (type) {
            case 'TOPUP':
                return '+';
            case 'CHARGE':
                return '-';
            default:
                return '';
        }
    };

    const itemStatus = (status:string) =>{
         switch (status) {
            case 'PENDING':
                return '#FEF3C7';
            case 'COMPLETED':
                return Colors.secondaryColor;
            default:
                return '#EF4444';
        }
    }
    if (!transaction) return null;

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {/* Header */}
                        <View style={styles.modalHeader}>
                            {/* <Text style={styles.modalTitle}>Transaction Details</Text> */}
                            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                                <Ionicons name="close" size={24} color={Colors.mainColor} />
                            </TouchableOpacity>
                        </View>

                        {/* Icon and Amount */}
                        <View style={styles.modalIconContainer}>
                            <View style={[
                                styles.modalTransactionIcon,
                                { backgroundColor: `${getTransactionColor(transaction.type)}15` }
                            ]}>
                                <Ionicons
                                    name={getTransactionIcon(transaction.type)}
                                    size={48}
                                    color={getTransactionColor(transaction.type)}
                                />
                            </View>
                            <Text style={[
                                styles.modalAmount,
                                { color: getTransactionColor(transaction.type) }
                            ]}>
                                {`${getSymbolForTransaction(transaction.type)}${transaction.amount.toFixed(2)} $`}
                            </Text>
                            <View style={[
                                styles.modalStatusBadge,
                                { backgroundColor: itemStatus(transaction.status) }
                            ]}>
                                <Text style={[
                                    styles.modalStatusText,
                                    { color: transaction.status === 'PENDING' ? '#F59E0B' : Colors.white }
                                ]}>
                                    {transaction.status}
                                </Text>
                            </View>
                        </View>

                        {/* Details */}
                        <View style={styles.detailsContainer}>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Transaction ID</Text>
                                <Text style={styles.detailValue}>{transaction.id}</Text>
                            </View>

                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Type</Text>
                                <Text style={styles.detailValue}>{transaction.type}</Text>
                            </View>
                            {/* <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>External Reference</Text>
                                <Text style={styles.detailValue}>{transaction.external_ref}</Text>
                            </View> */}
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Date & Time</Text>
                                <Text style={styles.detailValue}>
                                    {transaction.created_at 
                                        ? moment.utc(transaction.created_at).local().format('MMM DD, YYYY hh:mm A')
                                        : ''}
                                </Text>
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

export default TransactionDetailModal;

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: Colors.white,
        borderRadius: 20,
        padding: 24,
        width: '100%',
        maxHeight: '80%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 5,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    modalTitle: {
        fontSize: FontSize.large,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.mainColor,
    },
    closeButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalIconContainer: {
        alignItems: 'center',
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        marginBottom: 24,
    },
    modalTransactionIcon: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    modalAmount: {
        fontSize: 32,
        fontFamily: CustomFontConstant.EnBold,
        marginBottom: 12,
    },
    modalStatusBadge: {
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 12,
    },
    modalStatusText: {
        fontSize: FontSize.small,
        fontFamily: CustomFontConstant.EnBold,
        textTransform: 'uppercase',
    },
    detailsContainer: {
        gap: 16,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    detailLabel: {
        fontSize: FontSize.small,
        fontFamily: CustomFontConstant.EnRegular,
        color: '#6B7280',
        flex: 1,
    },
    detailValue: {
        fontSize: FontSize.small,
        fontFamily: CustomFontConstant.EnRegular,
        color: Colors.mainColor,
        textAlign: 'right',
    },
    detailValueBold: {
        fontFamily: CustomFontConstant.EnBold,
    },
});
