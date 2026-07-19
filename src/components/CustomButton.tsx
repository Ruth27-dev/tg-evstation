import React, { ReactNode } from 'react'
import { TouchableOpacity,Text,View,StyleSheet,ActivityIndicator } from "react-native";
import { CustomFontConstant, FontSize } from '@/constants/GeneralConstants';
import { Colors } from '@/theme';

type CustomButtonProps = {
    onPress?: () => void;
    buttonTitle:string,
    buttonColor?:string | '#0042F0',
    disabled?:boolean,
    buttonWidth?:number,
    textColor?:string,
    buttonHeight?:number,
    isLoading?:boolean,
    borderWidth?:number,
    borderColor?:string,
    icon?: ReactNode,
}

function CustomButton(props: CustomButtonProps) {
    const { onPress,buttonTitle,buttonColor,disabled,buttonWidth = '100%',textColor = Colors.white ,buttonHeight=55,isLoading=false,borderWidth = 0,borderColor = Colors.mainColor,icon } = props;

    return(
        <TouchableOpacity disabled={disabled} activeOpacity={0.7} onPress={onPress} style={[styles.buttonContainer,{backgroundColor:buttonColor,width:buttonWidth,height:buttonHeight,borderWidth:borderWidth,borderColor:borderColor}]}>
            {
                isLoading?<ActivityIndicator color={Colors.white} size={30}/>
                : icon ? (
                    <View style={styles.contentRow}>
                        {icon}
                        <Text style={{color:textColor,fontSize:FontSize.medium,fontFamily:CustomFontConstant.EnRegular,textAlign:'center'}}>{buttonTitle}</Text>
                    </View>
                )
                :
                <Text style={{color:textColor,fontSize:FontSize.medium,fontFamily:CustomFontConstant.EnRegular,textAlign:'center'}}>{buttonTitle}</Text>
            }
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    buttonContainer: {
        height:55,
        width:'100%',
        justifyContent: 'center',
        alignItems:'center',
        borderRadius:50
    },
    contentRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },

});

export default CustomButton;