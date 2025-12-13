import React from "react";
import { StyleSheet, Text } from "react-native";
import { useLanguageStore } from "@/store/useTranslateStore";
import { CustomFontConstant } from "@/constants/GeneralConstants";
import { useTranslation } from "@/hooks/useTranslation";

interface TextTranslationProps {
    textKey: string;
    fontSize?: number;
    color?: string;
    isBold?: boolean;
}
const TextTranslation = ({ textKey, fontSize, color, isBold }: TextTranslationProps) => {
    const { t,currentLanguage } = useTranslation();
    const styles = useStyles(fontSize, color, isBold);
    return(
        <Text style={styles.textNormal}>{t(textKey)}</Text>
    );
};


const useStyles = (fontSize?: number, color?: string, isBold?: boolean) =>{
    const { currentLanguage } = useTranslation();
    return  StyleSheet.create({
        textNormal: {
            fontSize: fontSize || 14,
            color: color || '#000',
            fontFamily:currentLanguage === 'kh'? isBold ? CustomFontConstant.KantumruyPro : CustomFontConstant.Khmer : isBold ? CustomFontConstant.EnBold : CustomFontConstant.EnRegular,
        },
     })
}


export default React.memo(TextTranslation);