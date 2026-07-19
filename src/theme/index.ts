import { Platform } from 'react-native';

export const Colors = {
    white: "#FFFFFF",
    gray: "#6D6D6D",
    black: "#000000",
    mainColor: "#0B3D57",
    secondaryColor: "#3A7D44",
    backGroundColor: "#f2f2f2",
    primaryColor:'#f1b11d',
    dividerColor: '#B0B0B0',
    red: '#FF0000',
    disableColor:'#D1D1D1',
    darkColor:'#081B37',

    // Semantic aliases consolidating raw hex values previously duplicated
    // across TopUpScreen, PaymentMethodScreen, PaymentSuccessScreen,
    // ChargingDetailScreen and ConnectorScreen.
    textMuted: '#6B7280',
    textFaint: '#9CA3AF',
    placeholderColor: '#C4C9D4',
    surfaceMuted: '#F7F8FA',
    borderMuted: '#EAECF0',
    surfaceTint: '#EEF6FF',
    borderTint: '#BFDBFE',
    dangerColor: '#EF4444',
    scanAccent: '#3B82F6',
    trackColor: '#e0e0e0',
    clearButtonBg: '#E5E7EB',
}

export const Spacing = {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
};

export const Radius = {
    sm: 10,
    md: 14,
    lg: 16,
    xl: 20,
    xxl: 24,
    pill: 50,
};

export const Shadows = {
    card: Platform.select({
        ios: { shadowColor: '#000', shadowOpacity: 0.07, shadowRadius: 14, shadowOffset: { width: 0, height: 4 } },
        android: { elevation: 2 },
        default: {},
    }),
    elevated: Platform.select({
        ios: { shadowColor: Colors.mainColor, shadowOpacity: 0.3, shadowRadius: 12, shadowOffset: { width: 0, height: 6 } },
        android: { elevation: 6 },
        default: {},
    }),
    modal: Platform.select({
        ios: { shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 8, shadowOffset: { width: 0, height: 4 } },
        android: { elevation: 8 },
        default: {},
    }),
    barTop: Platform.select({
        ios: { shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 12, shadowOffset: { width: 0, height: -4 } },
        android: { elevation: 8 },
        default: {},
    }),
};

