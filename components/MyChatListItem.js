import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { getImage } from "../helpers";

const MyChatListItem = ({ character }) => {
    const navigation = useNavigation();

    // Function to navigate to Chat screen
    const navigateToChat = () => {
        // The name and image are hardcoded for now
        navigation.navigate("Chat", {
            character: character
        });
    };

    return (
        <TouchableOpacity
            className="flex-row bg-[#1b1b1b] p-4 mx-4 my-2 rounded-3xl"
            onPress={navigateToChat}
        >
            <Image
                source={character?.image_path ? getImage(character?.id) : { uri: character?.photo ?? "https://randomuser.me/api/portraits/med/men/1.jpg" }}
                className="w-24 h-24 rounded-full "
            />
            <View className="flex-1 ml-4">
                <Text className="text-white text-2xl font-semibold mt-2" numberOfLines={1} ellipsizeMode="tail">
                    {character?.name?.length > 18 ? character?.name.substring(0, 18) + "..." : (character?.name == '' ? 'Character' : character?.name)}
                </Text>
                <Text className="text-gray-400 mt-2">
                    {character?.description ?
                        (character.description.length > 90 ? character.description.substring(0, 90) + "..." : character.description) :
                        (character.messages && character.messages.length > 0 && character.messages[character.messages.length - 1].content ?
                            (character.messages[character.messages.length - 1].content.length > 90 ?
                                character.messages[character.messages.length - 1].content.substring(0, 90) + "..." :
                                character.messages[character.messages.length - 1].content) :
                            'No Messages')
                    }
                </Text>

            </View>
        </TouchableOpacity>
    );
};

export default MyChatListItem;
