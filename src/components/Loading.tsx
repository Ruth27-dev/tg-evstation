import { Colors } from "@/theme";
import React from "react";
import { View } from "react-native";
import Lottie from "lottie-react-native";

const Loading = () => {
    return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor:Colors.backGroundColor}}>
            <Lottie
                source={require('@/assets/lotties/charging.json')}
                autoPlay
                loop
                style={{ width: 200, height: 200 }}
            />
        </View>
    )
}
export default Loading;