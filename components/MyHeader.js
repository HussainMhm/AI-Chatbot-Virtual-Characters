// MyHeader.js
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

const MyHeader = ({ title, icon, onIconPress, onPremuimPress }) => {
    return (
        <View className="p-4 flex-row justify-between items-center border-b-gray-800 border-b">
            <Text className="text-white text-3xl font-bold">{title}</Text>
            <View className="flex-row gap-4">
                {icon && (
                    <TouchableOpacity onPress={onIconPress}>
                        <Ionicons name={icon} size={24} color="white" />
                    </TouchableOpacity>
                )}
                {onPremuimPress && (
                    <TouchableOpacity onPress={onPremuimPress}>
                        <MaterialCommunityIcons name={"star-circle"} size={24} color="gold" />
                    </TouchableOpacity>
                )
                }
            </View>
        </View>
    );
};

export default MyHeader;
