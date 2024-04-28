import { useEffect, useState } from "react";
import {
    View,
    Text,
    SafeAreaView,
    Platform,
    StatusBar,
    ScrollView,
    TouchableOpacity,
} from "react-native";

import MyHeader from "../components/MyHeader";
import MyCharactersList from "../components/MyCharactersList";

import categoriesData from "../data/categories.json";
import charactersData from "../data/characters.json";

const HomeScreen = ({ navigation }) => {
    const [categories] = useState(categoriesData.categories);
    const [characters] = useState(charactersData.characters);

    // Category state and handler
    const [activeCategory, setActiveCategory] = useState(-1);
    const [categoryWithCharacters, setCategoryWithCharacters] = useState([]);
    const [filterdCategoryWithCharacters, setFilterdCategoryWithCharacters] = useState([]);

    const listTypes = {
        0: "portrait",
        1: "square",
        2: "mini",
    };

    const getCharactersWithCategories = (characters, categories) => {
        // Create a copy of the categories array to avoid mutating the original data
        const combinedCategories = categories.map((category) => ({
            ...category,
            characters: [], // Initialize an empty characters array
        }));

        // Map characters to the appropriate category
        characters.forEach((character) => {
            combinedCategories[character.category_id].characters.push(character);
        });

        return combinedCategories; // Return the combined list of categories with characters
    };

    const filterCharactersByCategoryId = (categoryId = -1) => {
        // If the category ID is -1 (representing 'All'), return all categories with their characters
        if (categoryId === -1) {
            return categoryWithCharacters;
        }

        // Return only the category that matches the given category ID
        return categoryWithCharacters.filter(
            (cat) => cat.id === categoryId
        );
    };

    const handleCategoryPress = (category) => {
        const categoryId = category ? category.id : -1; // Handle cases where 'category' is undefined
        setActiveCategory(categoryId);

        const filtered = filterCharactersByCategoryId(categoryId);
        setFilterdCategoryWithCharacters(filtered);
    };

    // Heart icon press handler
    const handleHeartPress = (character) => {
        // Handle heart icon press
    };

    useEffect(() => {
        const initialCharacters = getCharactersWithCategories(characters, categories);
        console.log(initialCharacters);
        setCategoryWithCharacters(initialCharacters); // Initialize the state with characters combined with categories
        setFilterdCategoryWithCharacters(initialCharacters)
    }, [characters, categories]); // Dependency on characters and categories

    return (
        <SafeAreaView
            className={`flex-1 bg-white`}
            style={{ paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0 }}
        >
            {/* Header component */}
            <MyHeader title="ChatBot AI" icon="search" />

            {/* Categories */}
            <View className="flex-row pr-4 py-2">
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="p-2">
                    {/* 'All' Category */}
                    <TouchableOpacity
                        onPress={() => handleCategoryPress(null)} // Handle 'All' category press
                        className={`px-4 py-2 mx-2 rounded-lg ${activeCategory === -1 ? "bg-blue-500" : "bg-gray-300"
                            }`}
                    >
                        <Text
                            className={`text-base font-medium ${activeCategory === -1 ? "text-white" : "text-gray-600"
                                }`}
                        >
                            All
                        </Text>
                    </TouchableOpacity>

                    {/* Other Categories */}
                    {categories.map((category, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={() => handleCategoryPress(category)}
                            className={`px-4 py-2 mx-2 rounded-lg ${activeCategory === category.id ? "bg-blue-500" : "bg-gray-300"
                                }`}
                        >
                            <Text
                                className={`text-base font-medium ${activeCategory === category.id ? "text-white" : "text-gray-600"
                                    }`}
                            >
                                {category.name}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Characters List */}
            <ScrollView showsVertical ScrollIndicator={false}>
                {filterdCategoryWithCharacters.map((category, i) => (
                    <MyCharactersList
                        key={i}
                        listType={listTypes[i % 3]} // Cycle through list types
                        categoryName={category.name}
                        characters={category.characters}
                        onHeartPress={handleHeartPress}
                    />
                ))}
            </ScrollView>
        </SafeAreaView>
    );
};

export default HomeScreen;
