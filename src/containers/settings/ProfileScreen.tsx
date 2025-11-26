import BaseComponent from "@/components/BaseComponent";
import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from "react-native";
import { Colors } from "@/theme";
import { CustomFontConstant, FontSize, safePadding } from "@/constants/GeneralConstants";
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomButton from "@/components/CustomButton";
import { Images } from "@/assets/images";
import CustomInputText from "@/components/CustomInputText";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

interface ProfileFormData {
    name: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    address: string;
}

const profileSchema = yup.object().shape({
    name: yup.string().required('Full name is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    phone: yup.string().required('Phone number is required'),
    dateOfBirth: yup.string().required('Date of birth is required'),
    address: yup.string().required('Address is required'),
});

const ProfileScreen = () => {
    const [isEditing, setIsEditing] = useState(false);

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<ProfileFormData>({
        resolver: yupResolver(profileSchema),
        defaultValues: {
            name: 'John Doe',
            email: 'john.doe@example.com',
            phone: '+855 12 345 678'
        }
    });

    const handleSave = (data: ProfileFormData) => {
        setIsEditing(false);
        console.log('Profile updated:', data);
    };

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
                  
                    {/* Phone */}
                    <View style={{ marginTop: safePadding }}>
                        <Text style={styles.cardTitle}>Phone Number</Text>
                        <CustomInputText
                            labelText="Phone Number"
                            placeHolderText="Enter your phone"
                            control={control}
                            name="phone"
                            errors={errors}
                            isLeftIcon
                            keyboardType="phone-pad"
                            renderLeftIcon={
                                <Ionicons name="call-outline" size={20} color={Colors.mainColor} />
                            }
                        />
                    </View>

                    <View style={{ marginTop: safePadding }}>
                        <Text style={styles.cardTitle}>Email</Text>
                        <CustomInputText
                            labelText="Email"
                            placeHolderText="Enter your email"
                            control={control}
                            name="email"
                            errors={errors}
                            isLeftIcon
                            keyboardType="email-address"
                            renderLeftIcon={
                                <Ionicons name="mail-outline" size={20} color={Colors.mainColor} />
                            }
                        />
                    </View>

                    {/* Save Button */}
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
