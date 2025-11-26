import BaseComponent from "@/components/BaseComponent";
import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Image } from "react-native";
import { Colors } from "@/theme";
import { CustomFontConstant, FontSize, safePadding } from "@/constants/GeneralConstants";
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Images } from "@/assets/images";

const AboutUsScreen = () => {
    const handleWebsite = () => {
        Linking.openURL('https://www.tgevstation.com');
    };

    const handleTerms = () => {
        console.log('Open Terms of Service');
    };

    const handleLicenses = () => {
        console.log('Open Open Source Licenses');
    };

    const handleSocial = (platform: string) => {
        const urls: { [key: string]: string } = {
            facebook: 'https://facebook.com/tgevstation',
            twitter: 'https://twitter.com/tgevstation',
            instagram: 'https://instagram.com/tgevstation',
            linkedin: 'https://linkedin.com/company/tgevstation',
        };
        Linking.openURL(urls[platform]);
    };

    return (
        <BaseComponent isBack={true} title="About Us">
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                {/* Header with Logo */}
                <View style={styles.header}>
                    <Image source={Images.logo} style={styles.logo} />
                    <Text style={styles.appName}>TGEV Station</Text>
                    <Text style={styles.tagline}>Powering Your Electric Journey</Text>
                </View>

                {/* About Section */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Ionicons name="information-circle" size={24} color={Colors.mainColor} />
                        <Text style={styles.cardTitle}>About TGEV Station</Text>
                    </View>
                    <Text style={styles.aboutText}>
                        TGEV Station is Cambodia's leading electric vehicle charging network, dedicated to accelerating the transition to sustainable transportation. We provide reliable, fast, and accessible charging solutions for EV owners across the country.
                    </Text>
                    <Text style={styles.aboutText}>
                        Our mission is to make electric vehicle charging as convenient as possible, supporting a cleaner and greener future for Cambodia and the region.
                    </Text>
                </View>

                {/* Key Features */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Ionicons name="star" size={24} color={Colors.mainColor} />
                        <Text style={styles.cardTitle}>Key Features</Text>
                    </View>
                    
                    <View style={styles.featureItem}>
                        <View style={[styles.featureIcon, { backgroundColor: '#DBEAFE' }]}>
                            <Ionicons name="flash" size={20} color="#3B82F6" />
                        </View>
                        <View style={styles.featureContent}>
                            <Text style={styles.featureTitle}>Fast Charging Network</Text>
                            <Text style={styles.featureDescription}>
                                Access to high-speed charging stations across Cambodia
                            </Text>
                        </View>
                    </View>

                    <View style={styles.featureItem}>
                        <View style={[styles.featureIcon, { backgroundColor: '#D1FAE5' }]}>
                            <Ionicons name="qr-code" size={20} color="#10B981" />
                        </View>
                        <View style={styles.featureContent}>
                            <Text style={styles.featureTitle}>Easy QR Scanning</Text>
                            <Text style={styles.featureDescription}>
                                Simply scan and start charging in seconds
                            </Text>
                        </View>
                    </View>

                    <View style={styles.featureItem}>
                        <View style={[styles.featureIcon, { backgroundColor: '#FEE2E2' }]}>
                            <Ionicons name="card" size={20} color="#EF4444" />
                        </View>
                        <View style={styles.featureContent}>
                            <Text style={styles.featureTitle}>Secure Payments</Text>
                            <Text style={styles.featureDescription}>
                                Multiple payment options with secure transactions
                            </Text>
                        </View>
                    </View>

                    <View style={styles.featureItem}>
                        <View style={[styles.featureIcon, { backgroundColor: '#FEF3C7' }]}>
                            <Ionicons name="location" size={20} color="#F59E0B" />
                        </View>
                        <View style={styles.featureContent}>
                            <Text style={styles.featureTitle}>Station Finder</Text>
                            <Text style={styles.featureDescription}>
                                Find nearby charging stations with real-time availability
                            </Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </BaseComponent>
    );
}

export default AboutUsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    header: {
        backgroundColor: Colors.white,
        alignItems: 'center',
        paddingHorizontal: safePadding,
        marginBottom: 16,
    },
    logo: {
        width: 100,
        height: 100,
        marginBottom: 16,
    },
    appName: {
        fontSize: FontSize.large + 4,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.mainColor,
        marginBottom: 8,
    },
    tagline: {
        fontSize: FontSize.medium,
        fontFamily: CustomFontConstant.EnRegular,
        color: '#6B7280',
        marginBottom: 16,
        textAlign: 'center',
    },
    versionBadge: {
        backgroundColor: `${Colors.mainColor}15`,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    versionText: {
        fontSize: FontSize.small,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.mainColor,
    },
    card: {
        backgroundColor: Colors.white,
        marginHorizontal: 16,
        marginBottom: 16,
        padding: 20,
        borderRadius: 16
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 16,
    },
    cardTitle: {
        fontSize: FontSize.large,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.mainColor,
    },
    aboutText: {
        fontSize: FontSize.small + 1,
        fontFamily: CustomFontConstant.EnRegular,
        color: '#6B7280',
        lineHeight: 22,
        marginBottom: 12,
        textAlign: 'justify',
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
        marginBottom: 16,
    },
    featureIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    featureContent: {
        flex: 1,
    },
    featureTitle: {
        fontSize: FontSize.medium,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.mainColor,
        marginBottom: 4,
    },
    featureDescription: {
        fontSize: FontSize.small,
        fontFamily: CustomFontConstant.EnRegular,
        color: '#6B7280',
        lineHeight: 18,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    infoLabel: {
        fontSize: FontSize.small + 1,
        fontFamily: CustomFontConstant.EnRegular,
        color: '#6B7280',
    },
    infoValue: {
        fontSize: FontSize.small + 1,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.mainColor,
    },
    socialContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    socialButton: {
        flex: 1,
        minWidth: '47%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 12,
        borderRadius: 12,
    },
    socialText: {
        fontSize: FontSize.small + 1,
        fontFamily: CustomFontConstant.EnBold,
        color: '#FFFFFF',
    },
    linkItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    linkText: {
        flex: 1,
        fontSize: FontSize.medium,
        fontFamily: CustomFontConstant.EnRegular,
        color: Colors.mainColor,
    },
    footer: {
        alignItems: 'center',
        paddingVertical: 32,
        paddingHorizontal: 20,
    },
    footerText: {
        fontSize: FontSize.small,
        fontFamily: CustomFontConstant.EnRegular,
        color: '#9CA3AF',
        textAlign: 'center',
    },
    footerSubtext: {
        fontSize: FontSize.small,
        fontFamily: CustomFontConstant.EnRegular,
        color: '#D1D5DB',
        marginTop: 8,
    },
});
