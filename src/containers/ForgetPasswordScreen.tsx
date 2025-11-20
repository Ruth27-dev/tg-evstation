import React, { useEffect } from 'react';
import { Image, View , Text} from 'react-native';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import BaseComponent from '@/components/BaseComponent';
import { CustomFontConstant, FontSize, safePadding ,safePaddingAndroid} from '@/constants/GeneralConstants';
import CustomPhoneInput from '@/components/CustomPhoneInput';
import CustomButton from '@/components/CustomButton';
import { Colors } from '@/theme';
import { navigate } from '@/navigation/NavigationService';

interface ForgetFormData {
  phone: string;
}

const forgetSchema = yup.object().shape({
    phone: yup.string().required('Enter phone number')
});

const ForgetPasswordScreen = () => {
    const { control, handleSubmit,watch, formState: { errors } } = useForm<ForgetFormData>({
        resolver: yupResolver(forgetSchema),
    });

    const onSubmit: SubmitHandler<ForgetFormData> = data => {
        navigate('Verify');
    };

    return (
        <BaseComponent isBack={true} title="Forget Password">
            <View style={{flex: 1, paddingHorizontal:safePadding, width:'100%', alignItems:'center'}}>
                <Text style={{fontSize:FontSize.medium, fontFamily:CustomFontConstant.EnRegular, marginTop:20,marginBottom:safePaddingAndroid}}>Please enter your phone number to reset your password</Text>
                <CustomPhoneInput
                    control={control}
                    name="phone"
                    errors={errors}
                />
                <View style={{height:30}}/>
                <CustomButton
                    buttonTitle="Next"
                    onPress={handleSubmit(onSubmit)}
                    isLoading={false}
                    buttonColor={
                        !watch('phone') || watch('phone').length < 8
                        ? Colors.disableColor
                        : Colors.mainColor
                    }
                    disabled={!watch('phone') || watch('phone').length < 8}
                />
            </View>
        </BaseComponent>
    )
}

export default ForgetPasswordScreen;