import { Dimensions } from "react-native"
import Images from '../assets/images';

export const StorageKey = {
    userInfo: "user-storage",
    appLanguage: "app-language",
    saleClock: "sale-clock",
    notificationPermission: "notification-permission",
    printer: "printer-storage",
}

export const screenSizes = {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
}

export const CustomFontConstant = {
    KantumruyPro:  "KantumruyPro-SemiBold",
    Khmer: "Khmer OS Kangrey",
    EnRegular: "Lato-Regular",
    EnBold: "Lato-Bold",
}
export const safePadding = '4%';
export const safePaddingAndroid = '8%';

export const mainRadius = 16;

export const FontSize = {
    small: 14,
    medium: 16,
    large: 18,
    extraLarge: 20,
    huge: 28,
}

export { Images };