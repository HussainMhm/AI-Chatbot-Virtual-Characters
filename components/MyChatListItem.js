import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { View, Text, Image, TouchableOpacity, Alert } from "react-native";
import { getImage } from "../helpers";

const MyChatListItem = ({ character, onDelete }) => {
    const navigation = useNavigation();

    // Function to navigate to Chat screen
    const navigateToChat = () => {
        // The name and image are hardcoded for now
        navigation.navigate("Chat", {
            character: character,
        });
    };

    // Function to handle delete with confirmation
    const handleDelete = () => {
        Alert.alert("Confirm Delete", `Are you sure you want to delete this character?`, [
            {
                text: "Cancel",
                style: "cancel",
            },
            {
                text: "Delete",
                onPress: onDelete,
                style: "destructive",
            },
        ]);
    };

    return (
        <TouchableOpacity
            className="flex-row bg-[#1b1b1b] p-4 mx-4 my-2 rounded-3xl"
            onPress={navigateToChat}
        >
            <Image
                source={
                    character?.image_path?.startsWith("assets/")
                        ? getImage(character?.id)
                        : {
                              uri:
                                  character?.image_path ??
                                  "https://randomuser.me/api/portraits/med/men/1.jpg",
                          }
                }
                className="w-24 h-24 rounded-full "
            />
            <View className="flex-1 ml-4">
                <Text
                    className="text-white text-2xl font-semibold"
                    numberOfLines={1}
                    ellipsizeMode="tail"
                >
                    {character?.name?.length > 18
                        ? character?.name.substring(0, 18) + "..."
                        : character?.name == ""
                        ? "Character"
                        : character?.name}
                </Text>
                <Text className="text-gray-400 mt-2">
                    {character?.messages &&
                    character?.messages?.length > 0 &&
                    character?.messages[character?.messages?.length - 1].content
                        ? character?.messages[character.messages.length - 1].content?.length > 90
                            ? character?.messages[
                                  character?.messages?.length - 1
                              ]?.content.substring(0, 90) + "..."
                            : character?.messages[character?.messages?.length - 1].content
                        : character?.assistant_content
                        ? character?.assistant_content?.length > 90
                            ? character?.assistant_content.substring(0, 90) + "..."
                            : character?.assistant_content
                        : "No Messages"}
                </Text>
            </View>
            {onDelete && (
                <TouchableOpacity onPress={handleDelete} className="justify-center">
                    <Ionicons name="trash" size={24} color="white" />
                </TouchableOpacity>
            )}
        </TouchableOpacity>
    );
};

export default MyChatListItem;
