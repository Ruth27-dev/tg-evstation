import BaseComponent from "@/components/BaseComponent";
import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Colors } from "@/theme";
import { CustomFontConstant, FontSize } from "@/constants/GeneralConstants";
import Ionicons from 'react-native-vector-icons/Ionicons';

const PrivacyScreen = () => {
    const Section = ({ icon, title, content }: { icon: string, title: string, content: string }) => (
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <View style={styles.sectionIconContainer}>
                    <Ionicons name={icon as any} size={24} color={Colors.mainColor} />
                </View>
                <Text style={styles.sectionTitle}>{title}</Text>
            </View>
            <Text style={styles.sectionContent}>{content}</Text>
        </View>
    );

    return (
        <BaseComponent isBack={true} title="Privacy Policy">
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.iconContainer}>
                        <Ionicons name="shield-checkmark" size={32} color={Colors.mainColor} />
                    </View>
                    <Text style={styles.title}>Privacy Policy</Text>
                </View>

                {/* Introduction */}
                <View style={styles.card}>
                    <Text style={styles.introText}>
                        At TGEV Station, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you use our EV charging services and mobile application.
                    </Text>
                </View>

                {/* Sections */}
                <View style={styles.card}>
                    <Section
                        icon="information-circle"
                        title="Information We Collect"
                        content="We collect information that you provide directly to us, including your name, email address, phone number, payment information, and vehicle details. We also collect usage data such as charging session history, location data, and app usage patterns to improve our services and provide you with a better experience."
                    />

                    <Section
                        icon="finger-print"
                        title="How We Use Your Information"
                        content="Your information is used to provide and improve our charging services, process payments, send notifications about charging sessions, provide customer support, and communicate important updates. We may also use aggregated, anonymized data for research and analytics purposes."
                    />

                    <Section
                        icon="lock-closed"
                        title="Data Security"
                        content="We implement industry-standard security measures to protect your personal information from unauthorized access, disclosure, alteration, or destruction. This includes encryption of sensitive data, secure payment processing, regular security audits, and strict access controls for our systems."
                    />

                    <Section
                        icon="share-social"
                        title="Information Sharing"
                        content="We do not sell, rent, or trade your personal information to third parties. We may share your information with trusted service providers who assist us in operating our services, such as payment processors and cloud service providers, under strict confidentiality agreements."
                    />

                    <Section
                        icon="location"
                        title="Location Data"
                        content="With your permission, we collect location data to help you find nearby charging stations and track charging sessions. You can control location permissions through your device settings. Location data is stored securely and only used for providing our services."
                    />

                    <Section
                        icon="card"
                        title="Payment Information"
                        content="Payment information is processed through secure, PCI-compliant payment processors. We do not store your complete credit card details on our servers. We only retain limited payment information necessary for billing and customer support purposes."
                    />

                    <Section
                        icon="notifications"
                        title="Communications"
                        content="We may send you service-related emails and push notifications about your charging sessions, account activity, and important updates. You can manage your notification preferences in the app settings, though some service-related communications are necessary."
                    />

                    <Section
                        icon="people"
                        title="Your Rights"
                        content="You have the right to access, update, or delete your personal information at any time. You can request a copy of your data, correct inaccuracies, or close your account. Contact our support team to exercise these rights or if you have any privacy concerns."
                    />

                    <Section
                        icon="time"
                        title="Data Retention"
                        content="We retain your personal information for as long as necessary to provide our services and comply with legal obligations. Charging session data is retained for billing and support purposes. You can request deletion of your data, subject to legal retention requirements."
                    />

                    <Section
                        icon="analytics"
                        title="Analytics and Cookies"
                        content="We use analytics tools to understand how users interact with our app and services. This helps us improve functionality and user experience. We may use cookies and similar technologies to collect usage information. You can manage cookie preferences through your device settings."
                    />

                    <Section
                        icon="shield"
                        title="Children's Privacy"
                        content="Our services are not intended for children under 18 years of age. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately so we can take appropriate action."
                    />

                    <Section
                        icon="refresh"
                        title="Policy Updates"
                        content="We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of significant changes through the app or via email. Continued use of our services after changes constitutes acceptance of the updated policy."
                    />
                </View>
            </ScrollView>
        </BaseComponent>
    );
}

export default PrivacyScreen;

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
    lastUpdated: {
        fontSize: FontSize.small,
        fontFamily: CustomFontConstant.EnRegular,
        color: '#9CA3AF',
    },
    card: {
        backgroundColor: Colors.white,
        marginHorizontal: 16,
        marginBottom: 16,
        padding: 20,
        borderRadius: 16
    },
    introText: {
        fontSize: FontSize.medium,
        fontFamily: CustomFontConstant.EnRegular,
        color: '#374151',
        lineHeight: 24,
        textAlign: 'justify',
    },
    section: {
        marginBottom: 28,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        gap: 12,
    },
    sectionIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: `${Colors.mainColor}15`,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sectionTitle: {
        flex: 1,
        fontSize: FontSize.medium + 1,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.mainColor,
    },
    sectionContent: {
        fontSize: FontSize.small + 1,
        fontFamily: CustomFontConstant.EnRegular,
        color: '#6B7280',
        lineHeight: 22,
        textAlign: 'justify',
        paddingLeft: 52,
    },
    contactCard: {
        backgroundColor: `${Colors.mainColor}08`,
        marginHorizontal: 16,
        marginBottom: 24,
        padding: 20,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: `${Colors.mainColor}20`,
    },
    contactHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 12,
    },
    contactTitle: {
        fontSize: FontSize.large,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.mainColor,
    },
    contactText: {
        fontSize: FontSize.small + 1,
        fontFamily: CustomFontConstant.EnRegular,
        color: Colors.mainColor,
        lineHeight: 22,
        marginBottom: 16,
    },
    contactDetails: {
        gap: 12,
    },
    contactRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    contactDetailText: {
        fontSize: FontSize.small + 1,
        fontFamily: CustomFontConstant.EnRegular,
        color: Colors.mainColor,
    },
});
