import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Dimensions } from 'react-native';
import { Colors, Radius, Shadows } from '@/theme';
import { CustomFontConstant, FontSize } from '@/constants/GeneralConstants';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTranslation } from '@/hooks/useTranslation';

const { width } = Dimensions.get('window');

interface EnableLocationModalProps {
    visible: boolean;
    onCancel: () => void;
    onEnable: () => void;
}

const EnableLocationModal: React.FC<EnableLocationModalProps> = ({
    visible,
    onCancel,
    onEnable,
}) => {
    const { t } = useTranslation();

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onCancel}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <View style={styles.iconContainer}>
                        <View style={[styles.dot, styles.dotTopLeft]} />
                        <View style={[styles.dot, styles.dotTopRight]} />
                        <View style={[styles.dot, styles.dotBottomLeft]} />
                        <View style={styles.iconCircle}>
                            <MaterialCommunityIcons
                                name="map-marker-radius"
                                size={54}
                                color={Colors.secondaryColor}
                            />
                        </View>
                    </View>

                    <Text style={styles.title}>{t('location.enableLocationTitle')}</Text>

                    <Text style={styles.message}>
                        {t('location.enableLocationMessage')}
                    </Text>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={onCancel}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.cancelButtonText}>{t('common.cancel')}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.enableButton}
                            onPress={onEnable}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.enableButtonText}>{t('location.enable')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default EnableLocationModal;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    modalContainer: {
        width: width - 40,
        maxWidth: 400,
        backgroundColor: Colors.white,
        borderRadius: Radius.xxl,
        padding: 24,
        alignItems: 'center',
        ...Shadows.modal,
    },
    iconContainer: {
        position: 'relative',
        marginBottom: 20,
        width: 110,
        height: 110,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: Colors.backGroundColor,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: Colors.secondaryColor,
    },
    dot: {
        position: 'absolute',
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: Colors.secondaryColor,
    },
    dotTopLeft: {
        top: 4,
        left: 8,
        opacity: 0.5,
    },
    dotTopRight: {
        top: 14,
        right: 0,
        opacity: 0.8,
    },
    dotBottomLeft: {
        bottom: 8,
        left: 0,
        opacity: 0.35,
    },
    title: {
        fontSize: FontSize.large + 2,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.mainColor,
        marginBottom: 12,
        textAlign: 'center',
    },
    message: {
        fontSize: FontSize.medium,
        fontFamily: CustomFontConstant.EnRegular,
        color: Colors.mainColor,
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 24,
        opacity: 0.8,
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 12,
        width: '100%',
    },
    cancelButton: {
        flex: 1,
        backgroundColor: Colors.white,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1.5,
        borderColor: Colors.secondaryColor,
        height: 50,
    },
    cancelButtonText: {
        fontSize: FontSize.medium,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.secondaryColor,
    },
    enableButton: {
        flex: 1,
        backgroundColor: Colors.secondaryColor,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
    },
    enableButtonText: {
        fontSize: FontSize.medium,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.white,
    },
});
