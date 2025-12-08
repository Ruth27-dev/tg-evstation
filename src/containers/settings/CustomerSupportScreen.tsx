import BaseComponent from "@/components/BaseComponent";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Linking } from "react-native";
import { Colors } from "@/theme";
import { CustomFontConstant, FontSize } from "@/constants/GeneralConstants";
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useContact } from "@/hooks/useContact";
import Loading from "@/components/Loading";
import { useFAQ } from "@/hooks/useFQA";

const CustomerSupportScreen = () => {
    const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
    const { getContact , contactData, isLoading } = useContact();
    const { getFAQ, faqData } = useFAQ();

    useEffect(() => {
        getContact();
        getFAQ();
    }, []);

    const handleCall = () => {
        Linking.openURL(`tel:${contactData?.phone}`);
    };

    const handleEmail = () => {
        Linking.openURL(`mailto:${contactData?.email}`);
    };

    const handleWhatsApp = () => {
        const telegramUsername = contactData?.telegram?.replace('@', '');
        Linking.openURL(`tg://resolve?domain=${telegramUsername}`);
    };

    const toggleFAQ = (index: number) => {
        setExpandedFAQ(expandedFAQ === index ? null : index);
    };

    if(isLoading) return <Loading/>

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

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Contact Us</Text>
                    
                    <TouchableOpacity style={styles.contactCard} onPress={handleCall} activeOpacity={0.7}>
                        <View style={styles.contactIcon}>
                            <Ionicons name="call" size={35} color="#3B82F6" />
                        </View>
                        <View style={styles.contactInfo}>
                            <Text style={styles.contactTitle}>Phone</Text>
                            <Text style={styles.contactDetail}>{contactData?.phone}</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.contactCard} onPress={handleWhatsApp} activeOpacity={0.7}>
                        <View style={styles.contactIcon}>
                            <FontAwesome name="telegram" size={35} color="#24A1DE" />
                        </View>
                        <View style={styles.contactInfo}>
                            <Text style={styles.contactTitle}>Telegram</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                    </TouchableOpacity>
                </View>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
                    {faqData?.map((faq, index) => (
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
