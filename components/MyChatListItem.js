import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";

const MyChatListItem = ({ character }) => {
    const navigation = useNavigation();
    console.log(character);
    // Function to navigate to Chat screen
    const navigateToChat = () => {
        // The name and image are hardcoded for now
        navigation.navigate("Chat", {
            character: convertCharacterToSystemFormat(character)
        });
    };

    const convertCharacterToSystemFormat = (character) => {

        const { age, hometown, interests, name, description, firstMessage, photo } = character;

        const systemContent = `${description} \n- Age: ${age} \n- Hometown: ${hometown} \n- Interests: ${interests.join(", ")}.`;
        
        return {
            id: -1,
            name: name,
            category_id: 0,
            system_content: systemContent,
            assistant_content: firstMessage,
            image_path: photo ?? "https://randomuser.me/api/portraits/med/men/1.jpg",
            recommendations: []
        };
    };

    return (
        <TouchableOpacity
            className="flex-row bg-[#1b1b1b] p-4 mx-4 my-2 rounded-3xl"
            onPress={navigateToChat}
        >
            <Image
                source={{ uri: character?.photo ?? "https://randomuser.me/api/portraits/med/men/1.jpg" }}
                className="w-24 h-24 rounded-full "
            />
            <View className="flex-1 ml-4">
                <Text className="text-white text-2xl font-semibold mt-2" numberOfLines={1} ellipsizeMode="tail">
                    {character?.name.length > 18 ? character?.name.substring(0, 18) + "..." : character?.name}
                </Text>
                <Text className="text-gray-400 mt-2">
                    {character?.description.length > 90 ? character?.description.substring(0, 90) + "..." : character?.description}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

export default MyChatListItem;
