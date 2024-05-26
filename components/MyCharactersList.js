import React from "react";
import { Text, ScrollView, TouchableOpacity, View, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MyListImage from "./MyListImage";

const { width } = Dimensions.get("window");

const MyCharactersList = ({
    listType,
    categoryName,
    characters,
    favorites,
    onHeartPress,
    onAllCharactersPress,
}) => {
    let imageWidth, imageHeight;

    // Different aspect ratios for each list type
    switch (listType) {
        case "portrait":
            imageWidth = width * 0.5;
            imageHeight = imageWidth * 1.6;
            break;
        case "square":
            imageWidth = width * 0.4;
            imageHeight = imageWidth;
            break;
        case "mini":
            imageWidth = width * 0.3;
            imageHeight = imageWidth;
            break;
        default:
            imageWidth = width * 0.5;
            imageHeight = imageWidth * 1.6;
            break;
    }

    return (
        <View className="p-4 pb-2">
            {/* Category title */}
            <View className="flex-row justify-between mb-4">
                {/* Category title */}
                <Text className="text-white text-2xl font-bold">{categoryName}</Text>

                {/* See all */}
                <TouchableOpacity
                    className="flex-row items-center space-x-1"
                    onPress={onAllCharactersPress}
                >
                    <Text className="text-white text-lg font-bold">All</Text>
                    <Ionicons name="chevron-forward" size={20} color={"white"} />
                </TouchableOpacity>
            </View>

            {/* Characters List */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {characters.map((character, index) => (
                    <MyListImage
                        key={index}
                        character={character}
                        imageWidth={imageWidth}
                        imageHeight={imageHeight}
                        isFavorite={favorites.includes(character.id)}
                        onHeartPress={onHeartPress}
                    />
                ))}
            </ScrollView>
        </View>
    );
};

export default MyCharactersList;
