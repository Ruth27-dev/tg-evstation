import React, {memo, useCallback, useRef} from 'react';
import { View, StyleSheet,Text, TouchableOpacity } from 'react-native';
import { CustomFontConstant, FontSize, safePadding } from '@/constants/GeneralConstants';
import { Colors } from '@/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import HeaderLogo from '@/assets/icon/header_logo.svg';
import { navigate } from '@/navigation/NavigationService';
import KhmerIcon from '@/assets/icon/kh.svg';
import EnglishIcon from '@/assets/icon/en.svg';
import ChinaIcon from '@/assets/icon/china.svg';
import { useTranslation } from '@/hooks/useTranslation';
import { useLanguageStore } from '@/store/useTranslateStore';
import LanguageSelectionModal from './LanguageSelectionModal';

const MainHeader: React.FC = () => {
    const insets = useSafeAreaInsets();

    const languageModalRef = useRef<{
        showModal: () => void;
        hideModal: () => void;
    } | null>(null);
    const { currentLanguage } = useTranslation();

    const handleCustomerSupport = () => {
        navigate('CustomerSupportScreen');
    };

    const handleNotifications = () => {
        navigate('Notification');
    };

    const renderTranslateIcon = useCallback(() => {
        return (
        <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => languageModalRef?.current?.showModal()}
            style={styles.languageButton}
        >
            {getLanguageIcon()}
            <Ionicons name="chevron-down" size={20} color={Colors.mainColor} />
        </TouchableOpacity>
        );
    }, [currentLanguage]);

	const getLanguageIcon = () => {
		switch (currentLanguage) {
			case 'kh':
				return <KhmerIcon width={30} height={30} />;
			case 'zh':
				return <ChinaIcon width={30} height={30} />;
			default:
				return <EnglishIcon width={30} height={30} />;
		}
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
                {renderTranslateIcon()}
                <TouchableOpacity onPress={handleCustomerSupport}>
                    <MaterialIcons name="support-agent" size={28} color={Colors.secondaryColor} style={{marginRight:15}} />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleNotifications}>
                    <Ionicons name="notifications" size={28} color={Colors.secondaryColor} />
                </TouchableOpacity>
            </View>
			<LanguageSelectionModal ref={languageModalRef} />
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
    languageButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 5,
        paddingHorizontal: 10,
        backgroundColor: Colors.backGroundColor,
        borderRadius: 20,
        marginRight:10,
        gap: 6,
    },
});

export default memo(MainHeader);