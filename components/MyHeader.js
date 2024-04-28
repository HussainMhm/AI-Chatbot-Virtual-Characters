import { View, Text, TouchableOpacity } from "react-native";
import React from "react";

import { Ionicons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";

const MyHeader = ({ title, icon, goBack }) => {
    return (
        <>
            {
                goBack ? (
                    <View className="p-4 flex-row items-center border-b-gray-100 border-b" >
                        <TouchableOpacity className="mr-3" onPress={goBack}>
                            <FontAwesome5 name="chevron-left" size={24} color="black" />
                        </TouchableOpacity>
                        <Text className="text-3xl font-bold">{title}</Text>
                        {icon && (
                            <TouchableOpacity>
                                <Ionicons name={icon} size={24} color="black" />
                            </TouchableOpacity>
                        )}
                    </View >

                ) : (
                    <View className="p-4 flex-row justify-between items-center border-b-gray-100 border-b">
                        <Text className="text-3xl font-bold">{title}</Text>
                        {icon && (
                            <TouchableOpacity>
                                <Ionicons name={icon} size={24} color="black" />
                            </TouchableOpacity>
                        )}
                    </View>
                )}
        </>
    );
};

export default MyHeader;
