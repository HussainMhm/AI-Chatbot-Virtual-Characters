import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet, Text, TouchableOpacity } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

const MyProgressIndicator = ({ steps, currentStep, goBack }) => {
    return (
        <View className="items-center mt-4">
            <TouchableOpacity onPress={goBack} className="absolute top-4 left-4">
                <FontAwesome5 name="chevron-left" size={24} color="white" />
            </TouchableOpacity>

            <Text className="text-white mb-3">
                {currentStep} of {steps}
            </Text>

            <View className="flex-row justify-center">
                {Array.from({ length: steps }, (_, i) => (
                    <View
                        key={i}
                        className={`w-4 h-4 rounded-md mx-2 ${
                            i <= currentStep - 1 ? "bg-white" : "bg-gray-500"
                        }`}
                    />
                ))}
            </View>
        </View>
    );
};

export default MyProgressIndicator;
