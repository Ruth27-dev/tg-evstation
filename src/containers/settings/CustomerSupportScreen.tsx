import BaseComponent from "@/components/BaseComponent";
import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Linking, TextInput, Alert } from "react-native";
import { Colors } from "@/theme";
import { CustomFontConstant, FontSize } from "@/constants/GeneralConstants";
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import CustomButton from "@/components/CustomButton";

interface FAQ {
    question: string;
    answer: string;
}

const faqs: FAQ[] = [
    {
        question: 'How do I start charging?',
        answer: 'Simply scan the QR code at the charging station, select your preferred charging options, and tap Start Charging.'
    },
    {
        question: 'What payment methods are accepted?',
        answer: 'We accept all major credit/debit cards, mobile payments, and digital wallets.'
    },
    {
        question: 'How long does charging take?',
        answer: 'Charging time varies based on your vehicle and charging speed. Fast chargers can provide 80% charge in 30-45 minutes.'
    },
    {
        question: 'Can I schedule charging sessions?',
        answer: 'Yes, you can schedule charging sessions in advance through the app for your convenience.'
    },
];

const CustomerSupportScreen = () => {
    const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
    const [message, setMessage] = useState('');

    const handleCall = () => {
        Linking.openURL('tel:+85512345678');
    };

    const handleEmail = () => {
        Linking.openURL('mailto:support@tgevstation.com');
    };

    const handleWhatsApp = () => {
        Linking.openURL('whatsapp://send?phone=85512345678');
    };

    const handleWebsite = () => {
        Linking.openURL('https://www.tgevstation.com/support');
    };

    const handleSendMessage = () => {
        if (!message.trim()) {
            Alert.alert('Error', 'Please enter a message');
            return;
        }
        console.log('Send message:', message);
        Alert.alert('Success', 'Your message has been sent. We will get back to you soon!');
        setMessage('');
    };

    const toggleFAQ = (index: number) => {
        setExpandedFAQ(expandedFAQ === index ? null : index);
    };

    return (
        <BaseComponent isBack={true} title="Customer Support">
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.iconContainer}>
                        <Ionicons name="headset" size={32} color={Colors.mainColor} />
                    </View>
                    <Text style={styles.title}>We're Here to Help</Text>
                    <Text style={styles.subtitle}>
                        Get in touch with our support team anytime
                    </Text>
                </View>

                {/* Contact Methods */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Contact Us</Text>
                    
                    <TouchableOpacity style={styles.contactCard} onPress={handleCall} activeOpacity={0.7}>
                        <View style={styles.contactIcon}>
                            <Ionicons name="call" size={35} color="#3B82F6" />
                        </View>
                        <View style={styles.contactInfo}>
                            <Text style={styles.contactTitle}>Phone</Text>
                            <Text style={styles.contactDetail}>+855 12 345 678</Text>
                            <Text style={styles.contactTime}>Available 24/7</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.contactCard} onPress={handleWhatsApp} activeOpacity={0.7}>
                        <View style={styles.contactIcon}>
                            <FontAwesome name="telegram" size={35} color="#24A1DE" />
                        </View>
                        <View style={styles.contactInfo}>
                            <Text style={styles.contactTitle}>Telegram</Text>
                            <Text style={styles.contactDetail}>+855 12 345 678</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                    </TouchableOpacity>
                </View>
                {/* FAQ Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
                    {faqs.map((faq, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.faqCard}
                            onPress={() => toggleFAQ(index)}
                            activeOpacity={0.7}
                        >
                            <View style={styles.faqHeader}>
                                <Text style={styles.faqQuestion}>{faq.question}</Text>
                                <Ionicons
                                    name={expandedFAQ === index ? "chevron-up" : "chevron-down"}
                                    size={20}
                                    color={Colors.mainColor}
                                />
                            </View>
                            {expandedFAQ === index && (
                                <Text style={styles.faqAnswer}>{faq.answer}</Text>
                            )}
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </BaseComponent>
    );
}

export default CustomerSupportScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    header: {
        backgroundColor: Colors.white,
        alignItems: 'center',
        paddingVertical: 32,
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    iconContainer: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: `${Colors.mainColor}15`,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: FontSize.large,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.mainColor,
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: FontSize.small + 1,
        fontFamily: CustomFontConstant.EnRegular,
        color: '#6B7280',
        textAlign: 'center',
    },
    section: {
        paddingHorizontal: 16,
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: FontSize.large,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.mainColor,
        marginBottom: 16,
    },
    contactCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.white,
        padding: 10,
        borderRadius: 12,
        marginBottom: 12
    },
    contactIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    contactInfo: {
        flex: 1,
    },
    contactTitle: {
        fontSize: FontSize.medium,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.mainColor,
        marginBottom: 4,
    },
    contactDetail: {
        fontSize: FontSize.small + 1,
        fontFamily: CustomFontConstant.EnRegular,
        color: '#374151',
        marginBottom: 2,
    },
    contactTime: {
        fontSize: FontSize.small,
        fontFamily: CustomFontConstant.EnRegular,
        color: '#9CA3AF',
    },
    messageCard: {
        backgroundColor: Colors.white,
        padding: 20,
        borderRadius: 12
    },
    messageInput: {
        backgroundColor: '#F9FAFB',
        borderRadius: 8,
        padding: 12,
        fontSize: FontSize.medium,
        fontFamily: CustomFontConstant.EnRegular,
        color: Colors.mainColor,
        textAlignVertical: 'top',
        minHeight: 100,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    faqCard: {
        backgroundColor: Colors.white,
        padding: 16,
        borderRadius: 12,
        marginBottom: 12
    },
    faqHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    faqQuestion: {
        flex: 1,
        fontSize: FontSize.medium,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.mainColor,
        marginRight: 12,
    },
    faqAnswer: {
        fontSize: FontSize.small + 1,
        fontFamily: CustomFontConstant.EnRegular,
        color: '#6B7280',
        marginTop: 12,
        lineHeight: 20,
    },
    hoursCard: {
        backgroundColor: Colors.white,
        padding: 20,
        borderRadius: 12
    },
    hourRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    dayText: {
        fontSize: FontSize.small + 1,
        fontFamily: CustomFontConstant.EnRegular,
        color: '#374151',
    },
    timeText: {
        fontSize: FontSize.small + 1,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.mainColor,
    },
    emergencyNote: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 16,
        padding: 12,
        backgroundColor: `${Colors.mainColor}08`,
        borderRadius: 8,
    },
    emergencyText: {
        flex: 1,
        fontSize: FontSize.small,
        fontFamily: CustomFontConstant.EnRegular,
        color: Colors.mainColor,
    },
});
