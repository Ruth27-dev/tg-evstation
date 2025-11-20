import React, { useCallback } from 'react';
import { Alert, Image, Keyboard, Text, TouchableOpacity, View } from 'react-native';
import Images from '../assets/images';
import { Colors } from '../theme';
import { CustomFontConstant, FontSize, safePadding } from '@/constants/GeneralConstants';
import CustomButton from '@/components/CustomButton';
import * as yup from 'yup';
import { SubmitHandler, useForm } from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import CustomInputText from '@/components/CustomInputText';
import { reset } from '@/navigation/NavigationService';
import * as Keychain from 'react-native-keychain';
import { useAuthStore } from '@/store/useAuthStore';
interface AnotherFormData {
  phoneNumber: string;
}
const schema = yup.object().shape({
    phoneNumber: yup.string().required('ត្រូវការលេខទូរស័ព្ទ'),
});
  
const ConfirmScreen = (props:any) => {
    const { loginPhone, loginResponse } = props?.route?.params;
    const {
        control,
        handleSubmit,
        formState: {errors},
        watch,
    } = useForm<AnotherFormData>({
        resolver: yupResolver(schema),
        defaultValues: {
        phoneNumber: '',
        },
    });
    const { setIsUserLogin,setLoginAt } = useAuthStore();

    const storeSecureData = useCallback(async () => {
        try {
            const sId = loginResponse?.s_id;
            await Keychain.setGenericPassword('s_id', String(sId));
        } catch (error) {
            console.error('Error storing s_id:', error);
        }
    }, [loginResponse]);

    const onSubmit: SubmitHandler<AnotherFormData> = data => {
        Keyboard.dismiss();
        if(loginPhone === data.phoneNumber){
            setIsUserLogin(true);
            setLoginAt(loginResponse?.login_at);
            storeSecureData();
            reset('Main');
        } else {
            Alert.alert("Phone number does not match. Please try again.");
        }
    };
    return (
        <View style={{ flex: 1, alignItems: 'center',backgroundColor:Colors.mainColor,padding:safePadding }}>
            <Image source={Images.confirm} style={{ width: 200, height: 200 }} />
            <View style={{marginTop:safePadding,width:'100%',gap:20}}>
                <Text style={{ color: Colors.white,fontSize:FontSize.huge,fontFamily:CustomFontConstant.Khmer,textAlign:'center' }}>បញ្ចូលលេខទូរស័ព្ទរបស់អ្នកដើម្បីពិនិត្យសុវត្ថិភាព</Text>
                <CustomInputText
                    placeHolderText="បញ្ចូលឈ្មោះពាក្យ ឬ ទូរស័ព្ទ"
                    labelText={'បញ្ចូលឈ្មោះពាក្យ ឬ ទូរស័ព្ទ'}
                    control={control}
                    name="phoneNumber"
                    keyboardType='phone-pad'
                    errors={errors}
                    isLeftIcon
                    renderLeftIcon={<Image source={Images.password} style={{width:35,height:35,tintColor:Colors.mainColor}} />}
                />
                <CustomButton
                    buttonTitle="ចូលគណនី"
                    buttonColor={Colors.primaryColor}
                    onPress={handleSubmit(onSubmit)}
                />
                <Text style={{ color: Colors.white,fontSize:FontSize.small,fontFamily:CustomFontConstant.Khmer,fontStyle:'italic' }}>*សូមបញ្ចូលលេខទូរស័ព្ទរបស់អ្នកសម្រាប់ចូលគណនី</Text>
            </View>
        </View>
    )
}

export default ConfirmScreen;