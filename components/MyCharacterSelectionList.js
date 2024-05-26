import React from "react";
import { View, Text, Image, TouchableOpacity, FlatList } from "react-native";
import { getImage } from "../helpers";

const MyCharacterSelectionList = ({ characters, onCharacterSelect }) => {
    const renderCharacter = ({ item: character }) => {
        return (
            <TouchableOpacity
                className="bg-[#1F1F1F] mb-4 p-4 rounded-3xl"
                activeOpacity={0.8}
                onPress={() => onCharacterSelect(character)}
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
                            {character.assistant_content.length > 60
                                ? `${character.assistant_content.slice(0, 70)}...`
                                : character.assistant_content}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <FlatList
            data={characters}
            renderItem={renderCharacter}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
        />
    );
};

export default MyCharacterSelectionList;
