import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const NoInternet = () => {
    const insets = useSafeAreaInsets();

    return  <View style={{
        position: 'absolute',
        width: '100%',
        backgroundColor: '#b52424',
        paddingTop: insets.top,
        }}>
        <View style={styles.offlineContainer}>
            <Text style={styles.offlineText}>No Connection Internet</Text>
        </View>
    </View>
};

const styles = StyleSheet.create({
    offlineContainer: {
      backgroundColor: '#b52424',
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      width: '100%',
    },
    offlineText: {
      color: '#fff'
    },
});

export default React.memo(NoInternet);