import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons, AntDesign, FontAwesome } from "@expo/vector-icons";

const MyHeader = ({ title, icon, onIconPress, onPremuimPress }) => {
    return (
        <View className="p-4 flex-row justify-between items-center border-b-gray-800 border-b">
            <Text className="text-white text-3xl font-bold">{title}</Text>
            <View className="flex-row gap-4 items-center">
                {onPremuimPress && (
                    <TouchableOpacity
                        className="flex-row py-2 px-4 items-center border-2 border-gray-500 rounded-xl"
                        onPress={onPremuimPress}
                    >
                        <Text className="text-white text-base font-bold mr-1 shadow shadow-white">
                            PRO
                        </Text>
                        <View className="shadow shadow-white">
                            <FontAwesome name="star" size={20} color="white" />
                        </View>
                    </TouchableOpacity>
                )}
                {icon && (
                    <TouchableOpacity onPress={onIconPress}>
                        <Ionicons name={icon} size={24} color="white" />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

export default MyHeader;
