import React, {memo, useCallback} from 'react';
import { View, StyleSheet, Image, Text, Platform, TouchableOpacity } from 'react-native';
import { CustomFontConstant, FontSize, Images, safePadding } from '@/constants/GeneralConstants';
import { Colors } from '@/theme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { goBack } from '@/navigation/NavigationService';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface BackHeaderProps{
    textTitle?:string
}
const BackHeader: React.FC<BackHeaderProps> = ({textTitle}) => {
    const insets = useSafeAreaInsets();
    
    return (
        <View style={[styles.headerContainer,{paddingTop: insets.top,height:55 + insets.top}]}>
            <TouchableOpacity activeOpacity={0.7} onPress={goBack}>
                <Ionicons name="arrow-back" size={25} color={Colors.mainColor} />
            </TouchableOpacity>
            <View style={{flex:1,flexDirection:'row',marginLeft:safePadding}}>
                <Text style={[styles.headerText,{color:Colors.mainColor,fontSize:FontSize.medium}]}>{textTitle}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    headerText: {
        fontFamily: CustomFontConstant.EnBold,
        fontSize: FontSize.medium,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: safePadding,
        alignItems: 'center',
        backgroundColor:Colors.white,
    }
});

export default memo(BackHeader);