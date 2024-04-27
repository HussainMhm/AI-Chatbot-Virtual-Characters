import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";

const MyChatListItem = () => {
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
            className="flex-row bg-slate-200 items-center p-4 mx-4 my-2 rounded-2xl"
            onPress={navigateToChat}
        >
            <Image
                source={{ uri: "https://randomuser.me/api/portraits/med/men/1.jpg" }}
                className="w-14 h-14 rounded-full "
            />
            <View className="ml-4">
                <Text className="font-bold">John Doe</Text>
                <Text className="text-gray-500">Hello, how are you?</Text>
            </View>
        </TouchableOpacity>
    );
};

export default MyChatListItem;
