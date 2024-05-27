import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { getImage } from "../../helpers";

const MyCharacterListItem = ({ character }) => {
    const navigation = useNavigation();

    // Function to navigate to Chat screen
    const navigateToChat = () => {
        navigation.navigate("Chat", {
            character: character,
        });
    };

    return (
        <TouchableOpacity
            className="flex-row bg-[#1b1b1b] p-4 mx-4 my-2 rounded-3xl"
            onPress={navigateToChat}
        >
            <Image
                source={
                    character?.image_path?.startsWith('assets/')
                        ? getImage(character?.id)
                        : {
                            uri:
                                character?.image_path ??
                                "https://randomuser.me/api/portraits/med/men/1.jpg",
                        }
                }
                className="w-24 h-24 rounded-full "
            />
            <View className="flex-1 ml-4 flex-row items-center justify-between">
                <Text
                    className="text-white text-lg font-semibold mt-2"
                    numberOfLines={1}
                    ellipsizeMode="tail"
                >
                    {character?.name?.length > 18
                        ? character?.name.substring(0, 18) + "..."
                        : character?.name == ""
                        ? "Character"
                        : character?.name}
                </Text>
                <FontAwesome
                    name="commenting"
                    size={24}
                    color="gray"
                    style={{ marginTop: 4, marginRight: 8 }}
                />
            </View>
        </TouchableOpacity>
    );
};

export default MyCharacterListItem;
