import { View, Text, TouchableOpacity } from "react-native";
import React from "react";

import { Ionicons } from "@expo/vector-icons";

const MyHeader = ({ title, icon }) => {
    return (
        <View className="p-4 flex-row justify-between items-center border-b-gray-100 border-b">
            <Text className="text-3xl font-bold">{title}</Text>
            {icon && (
                <TouchableOpacity>
                    <Ionicons name={icon} size={24} color="black" />
                </TouchableOpacity>
            )}
        </View>
    );
};

export default MyHeader;
