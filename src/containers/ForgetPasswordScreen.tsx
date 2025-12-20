import React, { useMemo } from 'react';
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
import { useTranslation } from '@/hooks/useTranslation';

interface ForgetFormData {
  phone: string;
}

const ForgetPasswordScreen = () => {
    const { t } = useTranslation();
    const forgetSchema = useMemo(() => yup.object().shape({
        phone: yup.string().required(t('auth.enterPhoneNumber'))
    }), [t]);

    const { control, handleSubmit,watch, formState: { errors } } = useForm<ForgetFormData>({
        resolver: yupResolver(forgetSchema),
    });
    

    const onSubmit: SubmitHandler<ForgetFormData> = data => {
        navigate('Verify');
    };

	return (
		<BaseComponent isBack={true} title="auth.forgotPassword">
			<View style={{flex: 1, paddingHorizontal:safePadding, width:'100%', alignItems:'center'}}>
				<Text style={{fontSize:FontSize.medium, fontFamily:CustomFontConstant.EnRegular, marginTop:20,marginBottom:safePaddingAndroid}}>{t('auth.forgotPasswordSubtitle')}</Text>
				<CustomPhoneInput
					control={control}
                    name="phone"
                    errors={errors}
                />
                <View style={{height:30}}/>
				<CustomButton
					buttonTitle={t('common.next')}
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
