import React, { useEffect, useState } from "react";
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, getDoc, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { FIREBASE_DB, FIREBASE_AUTH } from "../firebaseConfig";
import { useFocusEffect } from "@react-navigation/native";

const HomeScreen = ({ navigation }) => {
    const [categories] = useState(categoriesData.categories);
    const [characters] = useState(charactersData.characters);

    // Category state and handler
    const [activeCategory, setActiveCategory] = useState(-1);
    const [categoryWithCharacters, setCategoryWithCharacters] = useState([]);
    const [filterdCategoryWithCharacters, setFilterdCategoryWithCharacters] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (currentUser) => {
            if (currentUser){
                loadFavorites();
            }else {
                loadFavoritesFromLocal()
            }
            setUser(currentUser);
        });

        return () => unsubscribe();
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            loadFavorites();
        }, [user])
    );

    const listTypes = {
        0: "portrait",
        1: "square",
        2: "mini",
    };

    // Combine characters with categories
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

    // Filter characters by category ID
    const filterCharactersByCategoryId = (categoryId = -1) => {
        // If the category ID is -1 (representing 'All'), return all categories with their characters
        if (categoryId === -1) {
            return categoryWithCharacters;
        }

        // Return only the category that matches the given category ID
        return categoryWithCharacters.filter((cat) => cat.id === categoryId);
    };

    // Category press handler
    const handleCategoryPress = (category) => {
        const categoryId = category ? category.id : -1; // Handle cases where 'category' is undefined
        setActiveCategory(categoryId);

        const filtered = filterCharactersByCategoryId(categoryId);
        setFilterdCategoryWithCharacters(filtered);
    };

    const handleHeartPress = async (characterId) => {
        try {
            let updatedFavorites = [];
            if (favorites.includes(characterId)) {
                updatedFavorites = favorites.filter(fav => fav !== characterId);
            } else {
                updatedFavorites = [...favorites, characterId];
            }
            setFavorites(updatedFavorites);

            if (user) {
                const docRef = doc(FIREBASE_DB, "user_favorites", user.uid);
                await setDoc(docRef, { favorites: updatedFavorites });
            } else {
                await AsyncStorage.setItem('user_favorites', JSON.stringify(updatedFavorites));
            }
        } catch (error) {
            console.error("Error updating favorites:", error);
        }
    };

    const loadFavorites = async () => {
        try {
            const docRef = doc(FIREBASE_DB, "user_favorites", user.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                setFavorites(data.favorites || []);
            }
        } catch (error) {
            console.error("Error loading favorites:", error);
        }
    };

    const loadFavoritesFromLocal = async () => {
        try {   
            const value = await AsyncStorage.getItem('user_favorites');
            let favoriteCharacters = value ? JSON.parse(value) : [];
            setFavorites(favoriteCharacters);
        } catch (error) {
            console.error("Error loading favorites:", error);
        }
    };
    

    useEffect(() => {
        // Initialize the state with characters combined with categories
        const initialCharacters = getCharactersWithCategories(characters, categories);

        // Initialize the state with characters combined with categories
        setCategoryWithCharacters(initialCharacters);

        // Initialize the filtered state with all characters
        setFilterdCategoryWithCharacters(initialCharacters);
    }, [characters, categories]); // Dependency on characters and categories

    return (
        <SafeAreaView
            className={`flex-1 bg-chatbot-dark`}
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
                        className={`px-6 py-3 mx-2 rounded-2xl ${activeCategory === -1 ? "bg-white" : "bg-[#222222]"
                            }`}
                    >
                        <Text
                            className={`text-base font-semibold ${activeCategory === -1 ? "text-black" : "text-white"
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
                            className={`px-4 py-3 mx-2 rounded-2xl ${activeCategory === category.id ? "bg-white" : "bg-[#222222]"
                                }`}
                        >
                            <Text
                                className={`text-base font-semibold ${activeCategory === category.id ? "text-black" : "text-white"
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
                        favorites={favorites}
                        onHeartPress={handleHeartPress}
                        onAllCharactersPress={() => handleCategoryPress(category)}
                    />
                ))}
            </ScrollView>
        </SafeAreaView>
    );
};

export default HomeScreen;
