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
    onPress?: () => void;
    hideHeader?: boolean;
}
const BaseComponent = ({isBack, title,children, onPress, hideHeader}: BaseComponentProps) => {
    return (
        <View style={{flex:1}}>
            {
                !hideHeader && (isBack ? <BackHeader textTitle={title} onPress={onPress || goBack} /> : <MainHeader />)
            }
            {children}
        </View>
    );
}
export default React.memo(BaseComponent);
