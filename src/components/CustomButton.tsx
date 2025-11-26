import React from 'react'
import { TouchableOpacity,Text,StyleSheet,ActivityIndicator } from "react-native";
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
    isLoading?:boolean
}

function CustomButton(props: CustomButtonProps) {
    const { onPress,buttonTitle,buttonColor,disabled,buttonWidth = '100%',textColor = Colors.white ,buttonHeight=55,isLoading=false } = props;

    return(
        <TouchableOpacity disabled={disabled} activeOpacity={0.7} onPress={onPress} style={[styles.buttonContainer,{backgroundColor:buttonColor,width:buttonWidth,height:buttonHeight}]}>
            {
                isLoading?<ActivityIndicator color={Colors.white} size={30}/>
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
    
});

export default CustomButton;