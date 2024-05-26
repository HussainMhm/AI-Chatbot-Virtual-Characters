// VerticalCharactersList.js
import React from "react";
import { View, Text, Image, TouchableOpacity, FlatList } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { getImage } from "../helpers";

const MyVerticalCharactersList = ({ characters, favorites, onHeartPress }) => {
    const navigation = useNavigation();

    const renderCharacter = ({ item: character }) => {
        const handleCharacterPress = () => {
            // Navigate to ChatScreen when character is pressed
            navigation.navigate("Chat", { character });
        };

        return (
            <TouchableOpacity
                className="bg-[#1F1F1F] mb-4 p-4 rounded-3xl"
                activeOpacity={0.8}
                onPress={handleCharacterPress}
            >
                {/* Image */}
                <View className="flex-row">
                    <Image
                        source={getImage(character.id)}
                        style={{ width: 100, height: 100 }}
                        className={`rounded-full`}
                    />

                    {/* Character details */}
                    <View className="ml-4 flex-1">
                        <Text className="text-white text-xl font-bold mb-1">{character.name}</Text>
                        <Text className="text-gray-400">
                            {character.assistant_content.length > 80
                                ? `${character.assistant_content.slice(0, 80)}...`
                                : character.assistant_content}
                        </Text>
                    </View>

                    {/* Heart icon */}
                    <TouchableOpacity
                        className="ml-4 justify-center"
                        onPress={() => {
                            onHeartPress(character?.id);
                        }}
                    >
                        <MaterialCommunityIcons
                            name={favorites.includes(character.id) ? "heart" : "heart-outline"}
                            size={28}
                            color="white"
                        />
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <FlatList
            data={characters}
            renderItem={renderCharacter}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ padding: 16 }}
        />
    );
};

export default MyVerticalCharactersList;
