import { Colors } from "@/theme";
import React from "react";
import { ActivityIndicator, View } from "react-native";

const Loading = () => {
    return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <ActivityIndicator size="large" color={Colors.mainColor} />
        </View>
    )
}
export default Loading;