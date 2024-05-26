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
import MyVerticalCharactersList from "../components/MyVerticalCharactersList";

import categoriesData from "../data/categories.json";
import charactersData from "../data/characters.json";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
    const [filteredCategoryWithCharacters, setFilteredCategoryWithCharacters] = useState([]);

    const [favorites, setFavorites] = useState([]);

    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (currentUser) => {
            setUser(currentUser);
            loadFavorites();
        });

        return () => unsubscribe();
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            loadFavorites();
        }, [])
    );

    const listTypes = {
        0: "portrait",
        1: "square",
        2: "mini",
    };

    // Combine characters with categories
    const getCharactersWithCategories = (characters, categories) => {
        const combinedCategories = categories.map((category) => ({
            ...category,
            characters: [],
        }));

        characters.forEach((character) => {
            combinedCategories[character.category_id].characters.push(character);
        });

        return combinedCategories;
    };

    // Filter characters by category ID
    const filterCharactersByCategoryId = (categoryId = -1) => {
        if (categoryId === -1) {
            return categoryWithCharacters;
        }

        return categoryWithCharacters.filter((cat) => cat.id === categoryId);
    };

    // Category press handler
    const handleCategoryPress = (category) => {
        const categoryId = category ? category.id : -1;
        setActiveCategory(categoryId);

        const filtered = filterCharactersByCategoryId(categoryId);
        setFilteredCategoryWithCharacters(filtered);
    };

    const handleHeartPress = async (characterId) => {
        try {
            let updatedFavorites = [];
            if (favorites.includes(characterId)) {
                updatedFavorites = favorites.filter((fav) => fav !== characterId);
            } else {
                updatedFavorites = [...favorites, characterId];
            }
            setFavorites(updatedFavorites);

            if (user) {
                const docRef = doc(FIREBASE_DB, "user_favorites", user.uid);
                await setDoc(docRef, { favorites: updatedFavorites });
            } else {
                await AsyncStorage.setItem("favorites", JSON.stringify(updatedFavorites));
            }
        } catch (error) {
            console.error("Error updating favorites:", error);
        }
    };

    const loadFavorites = async () => {
        try {
            if (user) {
                const docRef = doc(FIREBASE_DB, "user_favorites", user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setFavorites(data.favorites || []);
                }
            } else {
                const value = await AsyncStorage.getItem("favorites");
                let favoriteCharacters = value ? JSON.parse(value) : [];
                setFavorites(favoriteCharacters);
            }
        } catch (error) {
            console.error("Error loading favorites:", error);
        }
    };

    useEffect(() => {
        const initialCharacters = getCharactersWithCategories(characters, categories);
        setCategoryWithCharacters(initialCharacters);
        setFilteredCategoryWithCharacters(initialCharacters);
    }, [characters, categories]);

    return (
        <SafeAreaView
            className={`flex-1 bg-chatbot-dark`}
            style={{ paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0 }}
        >
            <MyHeader title="ChatBot AI" icon="search" />

            <View className="flex-row pr-4 py-2">
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="p-2">
                    <TouchableOpacity
                        onPress={() => handleCategoryPress(null)}
                        className={`px-6 py-3 mx-2 rounded-2xl ${
                            activeCategory === -1 ? "bg-white" : "bg-[#222222]"
                        }`}
                    >
                        <Text
                            className={`text-base font-semibold ${
                                activeCategory === -1 ? "text-black" : "text-white"
                            }`}
                        >
                            All
                        </Text>
                    </TouchableOpacity>

                    {categories.map((category, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={() => handleCategoryPress(category)}
                            className={`px-4 py-3 mx-2 rounded-2xl ${
                                activeCategory === category.id ? "bg-white" : "bg-[#222222]"
                            }`}
                        >
                            <Text
                                className={`text-base font-semibold ${
                                    activeCategory === category.id ? "text-black" : "text-white"
                                }`}
                            >
                                {category.name}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {activeCategory !== -1 ? (
                <MyVerticalCharactersList
                    characters={filteredCategoryWithCharacters[0]?.characters || []}
                    favorites={favorites}
                    onHeartPress={handleHeartPress}
                />
            ) : (
                <ScrollView showsVertical ScrollIndicator={false}>
                    {filteredCategoryWithCharacters.map((category, i) => (
                        <MyCharactersList
                            key={i}
                            listType={listTypes[i % 3]}
                            categoryName={category.name}
                            characters={category.characters}
                            favorites={favorites}
                            onHeartPress={handleHeartPress}
                            onAllCharactersPress={() => handleCategoryPress(category)}
                        />
                    ))}
                </ScrollView>
            )}
        </SafeAreaView>
    );
};

export default HomeScreen;
