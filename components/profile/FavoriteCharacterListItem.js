import { useNavigation } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getImage } from "../../helpers";

const FavoriteCharacterListItem = ({ character, onToggleFavorite }) => {
    const navigation = useNavigation();
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        checkIfFavorite();
    }, []);

    const checkIfFavorite = async () => {
        try {
            const value = await AsyncStorage.getItem("favorite-characters");
            const favoriteCharacters = JSON.parse(value);
            if (Array.isArray(favoriteCharacters)) {
                setIsFavorite(favoriteCharacters.some((c) => c.id === character.id));
            }
        } catch (e) {
            console.log(`Failed to check favorite characters:`, e);
        }
    };

    const toggleFavorite = async () => {
        try {
            const value = await AsyncStorage.getItem("favorite-characters");
            let favoriteCharacters = value ? JSON.parse(value) : [];
            favoriteCharacters = Array.isArray(favoriteCharacters) ? favoriteCharacters : [];

            const index = favoriteCharacters.findIndex((c) => c?.id === character.id);
            if (index !== -1) {
                favoriteCharacters.splice(index, 1);
                setIsFavorite(false);
            } else {
                favoriteCharacters.push(character);
                setIsFavorite(true);
            }

            const jsonValue = JSON.stringify(favoriteCharacters);
            await AsyncStorage.setItem("favorite-characters", jsonValue);
            if (onToggleFavorite) {
                onToggleFavorite(); // Notify parent component to refresh the list
            }
        } catch (e) {
            console.log(`Failed to save favorite characters. ${e}`);
        }
    };

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
                    character?.image_path
                        ? getImage(character?.id)
                        : {
                              uri:
                                  character?.photo ??
                                  "https://randomuser.me/api/portraits/med/men/1.jpg",
                          }
                }
                className="w-24 h-24 rounded-full "
            />
            <View className="flex-1 flex-row ml-4 justify-between items-center">
                <Text
                    className="text-white text-lg font-semibold ml-2"
                    numberOfLines={1}
                    ellipsizeMode="tail"
                >
                    {character?.name?.length > 18
                        ? character?.name.substring(0, 18) + "..."
                        : character?.name === ""
                        ? "Character"
                        : character?.name}
                </Text>
                <TouchableOpacity onPress={toggleFavorite} className="mr-2">
                    {isFavorite ? (
                        <MaterialCommunityIcons name="heart" size={24} color="white" />
                    ) : (
                        <MaterialCommunityIcons name="heart-outline" size={24} color="white" />
                    )}
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
};

export default FavoriteCharacterListItem;
