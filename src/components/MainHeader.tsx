import React, {memo} from 'react';
import { View, StyleSheet,Text, TouchableOpacity } from 'react-native';
import { CustomFontConstant, FontSize, safePadding } from '@/constants/GeneralConstants';
import { Colors } from '@/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import HeaderLogo from '@/assets/icon/header_logo.svg';
import { navigate } from '@/navigation/NavigationService';


const MainHeader: React.FC = () => {
    const insets = useSafeAreaInsets();

    const handleCustomerSupport = () => {
        navigate('CustomerSupportScreen');
    };

    const handleNotifications = () => {
        navigate('Notification');
    };
        
    return (
        <View style={[styles.headerContainer,{paddingTop: insets.top,height:55 + insets.top}]}>
            <View style={{flex:1,flexDirection:'row',alignItems:'center'}}>
                <HeaderLogo width={55} height={55} />
                <View>
                    <Text style={[styles.headerText,{color:Colors.mainColor,fontSize:FontSize.medium}]}>TG EV</Text>
                    <Text style={[styles.headerText,{color:Colors.secondaryColor,fontSize:FontSize.small}]}>STATION</Text>
                </View>
            </View>
            <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                <TouchableOpacity onPress={handleCustomerSupport}>
                    <MaterialIcons name="support-agent" size={28} color={Colors.secondaryColor} style={{marginRight:15}} />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleNotifications}>
                    <Ionicons name="notifications" size={28} color={Colors.secondaryColor} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    headerText: {
        fontFamily: CustomFontConstant.EnBold,
        fontSize: FontSize.medium,
        textAlign: 'center',
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: safePadding,
        alignItems: 'center',
        backgroundColor:Colors.white,
    },
});

export default memo(MainHeader);