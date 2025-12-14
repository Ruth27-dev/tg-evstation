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
    isPaddingBottom?: boolean;
}
const TextTranslation = ({ textKey, fontSize, color, isBold, isPaddingBottom }: TextTranslationProps) => {
    const { t } = useTranslation();
    const styles = useStyles(fontSize, color, isBold,isPaddingBottom);
    return(
        <Text style={styles.textNormal}>{t(textKey)}</Text>
    );
};


const useStyles = (fontSize?: number, color?: string, isBold?: boolean,isPaddingBottom?: boolean) =>{
    const { currentLanguage } = useTranslation();
    return  StyleSheet.create({
        textNormal: {
            fontSize: fontSize || 14,
            color: color || '#000',
            fontFamily:currentLanguage === 'kh'? isBold ? CustomFontConstant.Khmer : CustomFontConstant.KantumruyPro : isBold ? CustomFontConstant.EnBold : CustomFontConstant.EnRegular,
            paddingBottom:isPaddingBottom ? 5 : 0,
        },
     })
}


export default React.memo(TextTranslation);