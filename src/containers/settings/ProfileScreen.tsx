import BaseComponent from "@/components/BaseComponent";
import React, { useState } from "react";
import { View, Text, StyleSheet,  ScrollView } from "react-native";
import { Colors } from "@/theme";
import { CustomFontConstant, FontSize, safePadding } from "@/constants/GeneralConstants";
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomButton from "@/components/CustomButton";
import CustomInputText from "@/components/CustomInputText";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useMeStore } from "@/store/useMeStore";
import { useAuth } from "@/hooks/useAuth";
import Loading from "@/components/Loading";

interface ProfileFormData {
    name: string;
    phone: string;
}

const profileSchema = yup.object().shape({
    name: yup.string().required('Full name is required'),
    phone: yup.string().required('Phone number is required'),
});

const ProfileScreen = () => {
    const [isEditing, setIsEditing] = useState(false);
    const { userData } = useMeStore();
    const { updateProfile,isRequesting } = useAuth();
    
    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<ProfileFormData>({
        resolver: yupResolver(profileSchema),
        defaultValues: {
            name: userData?.user_name || '',
            phone: userData?.phone_number || ''
        }
    });

    const handleSave = (data: ProfileFormData) => {
        const { phone, name } = data;
        updateProfile({ phone_number: phone, user_name: name });
        setIsEditing(false);
    };
    if(isRequesting) return <Loading />

    return (
        <BaseComponent isBack={true} title="Profile">
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                <View style={styles.card}>
                    <View>
                        <Text style={styles.cardTitle}>Full Name</Text>
                        <CustomInputText
                            labelText="Full Name"
                            placeHolderText="Enter your full name"
                            control={control}
                            name="name"
                            errors={errors}
                            isLeftIcon
                            renderLeftIcon={
                                <Ionicons name="person-outline" size={20} color={Colors.mainColor} />
                            }
                        />
                    </View>
                  
                    <View style={{ marginTop: safePadding }}>
                        <Text style={styles.cardTitle}>Phone Number</Text>
                        <CustomInputText
                            labelText="Phone Number"
                            placeHolderText="Enter your phone"
                            control={control}
                            name="phone"
                            errors={errors}
                            isLeftIcon
                            editable={isEditing}
                            keyboardType="phone-pad"
                            renderLeftIcon={
                                <Ionicons name="call-outline" size={20} color={Colors.mainColor} />
                            }
                        />
                    </View>

                    <View style={styles.buttonContainer}>
                        <CustomButton
                            buttonTitle="Edit Profile"
                            onPress={handleSubmit(handleSave)}
                            buttonColor={Colors.mainColor}
                        />
                    </View>
                </View>
            </ScrollView>
        </BaseComponent>
    );
}

export default ProfileScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    card: {
        padding: safePadding
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    cardTitle: {
        fontSize: FontSize.small,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.mainColor,
        paddingBottom: 8
    },
    editButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    editButtonText: {
        fontSize: FontSize.small + 1,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.mainColor,
    },
    buttonContainer: {
        marginTop: 30,
    }
});
