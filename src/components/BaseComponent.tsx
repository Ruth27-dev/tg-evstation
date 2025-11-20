import { CustomFontConstant, Images } from "@/constants/GeneralConstants";
import { goBack } from "@/navigation/NavigationService";
import { Colors } from "@/theme";
import React, { useCallback } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  BackHandler
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import BackHeader from "./BackHeader";
import MainHeader from "./MainHeader";
interface BaseComponentProps {
    isBack: boolean;
    title?: string;
    children?: React.ReactNode;
}
const BaseComponent = ({isBack, title,children}: BaseComponentProps) => {
    return (
        <View style={{flex:1}}>
            {
                isBack ? <BackHeader textTitle={title}/> : <MainHeader />
            }
            {children}
        </View>
    );
}
export default React.memo(BaseComponent);
const styles = StyleSheet.create({
    headerContainer: {
        width: '100%',
        height: 64,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent:'space-between',
        paddingHorizontal: 20,
        backgroundColor: Colors.white,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    headerTitle:{
        fontSize: 20,
        color: Colors.mainColor,
        fontFamily: CustomFontConstant.EnBold,
        textAlign: 'center',
        fontWeight: '700',
        letterSpacing: -0.3,
    },
    logo:{
        width: 90,
        height: 50
    }
});