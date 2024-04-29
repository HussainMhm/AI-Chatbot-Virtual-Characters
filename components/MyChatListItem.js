import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";

const MyChatListItem = ({ name, message }) => {
    const navigation = useNavigation();

    // Function to navigate to Chat screen
    const navigateToChat = () => {
        // The name and image are hardcoded for now
        navigation.navigate("Chat", {
            name: "John Doe",
            image: "https://randomuser.me/api/portraits/med/men/1.jpg",
        });
    };

    return (
        <TouchableOpacity
            className="flex-row bg-[#1b1b1b] p-4 mx-4 my-2 rounded-3xl"
            onPress={navigateToChat}
        >
            <Image
                source={{ uri: "https://randomuser.me/api/portraits/med/men/1.jpg" }}
                className="w-24 h-24 rounded-full "
            />
            <View className="flex-1 ml-4">
                <Text className="text-white text-2xl font-semibold mt-2">{name}</Text>
                <Text className="text-gray-400 mt-2">{message}</Text>
            </View>
        </TouchableOpacity>
    );
};

export default MyChatListItem;
