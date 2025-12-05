import Images from "@/assets/images";
import { CustomFontConstant, safePadding } from "@/constants/GeneralConstants";
import { Colors } from "@/theme";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

const NoData = () => {
    return (
        <View style={styles.container}>
            <Image source={Images.no_data} style={{width:80,height:80}}/>
            <Text style={{fontSize:16,color:Colors.black,marginTop:safePadding,fontFamily:CustomFontConstant.EnRegular}}>No Data Available</Text>
        </View>
    )
}
export default NoData;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
   
})