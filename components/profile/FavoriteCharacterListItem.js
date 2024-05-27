import { useNavigation } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getImage } from "../../helpers";
import { doc, setDoc } from "firebase/firestore";
import { FIREBASE_DB } from "../../firebaseConfig";


const FavoriteCharacterListItem = ({ user, character, favorites, onToggleFavorite }) => {
    const navigation = useNavigation();
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(()=>{
        if(favorites.includes(character.id)){
            setIsFavorite(true);
        }
    }, [character])

    const toggleFavorite = async () => {
        try {
            let updatedFavorites = [];
            if (favorites.includes(character.id)) {
                updatedFavorites = favorites.filter(fav => fav !== character.id);
                setIsFavorite(false);
            } else {
                updatedFavorites = [...favorites, character.id];
                setIsFavorite(true);
            }

            if (user) {
                const docRef = doc(FIREBASE_DB, "user_favorites", user.uid);
                await setDoc(docRef, { favorites: updatedFavorites });
            } else {
                await AsyncStorage.setItem('user_favorites', JSON.stringify(updatedFavorites));
            }

            if (onToggleFavorite) {
                onToggleFavorite(character?.id); // Notify parent component to refresh the list
            }

        } catch (error) {
            console.error("Error updating favorites:", error);
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
