import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { Modal, View, StyleSheet, TouchableWithoutFeedback } from 'react-native';

interface CustomModalRef {
    showModal: () => void;
    hideModal: () => void;
}

interface CustomModalProps {
    animationType?: 'none' | 'slide' | 'fade' | undefined;
    children?: React.ReactNode;
}

const CustomModal = forwardRef<CustomModalRef, CustomModalProps>(({ animationType, children }, ref) => {
    const [visible, setVisible] = useState(false);

    useImperativeHandle(ref, () => ({
        showModal() {
            setVisible(true);
        },
        hideModal() {
            setVisible(false);
        },
    }));

    const handlePress = () => {
        setVisible(false);
    };

    return (
        <Modal
            supportedOrientations={['portrait', 'landscape', 'landscape-left', 'landscape-right']}
            transparent={true}
            visible={visible}
            onRequestClose={() => setVisible(false)}
            animationType={animationType}
        >
            {children}
        </Modal>
    );
});

export default CustomModal;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
    },
    modalContent: {
        width: '100%', // Adjust width
        height: 200,
        backgroundColor: 'red',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    }
});