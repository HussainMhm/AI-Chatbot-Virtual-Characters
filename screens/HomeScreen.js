import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    SafeAreaView,
    Platform,
    StatusBar,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Modal,
} from "react-native";

import MyHeader from "../components/MyHeader";
import MyCharactersList from "../components/MyCharactersList";
import MyVerticalCharactersList from "../components/MyVerticalCharactersList";

import categoriesData from "../data/categories.json";
import charactersData from "../data/characters.json";
import premiumCaractersData from "../data/premiumCharcters.json";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { FIREBASE_DB, FIREBASE_AUTH } from "../firebaseConfig";
import { useFocusEffect } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import MyCharacterSelectionList from "../components/MyCharacterSelectionList";
import { generateCharacterPrompt } from "../api/openAi";


const HomeScreen = ({ navigation }) => {
    const [categories] = useState(categoriesData.categories);
    const [characters] = useState(charactersData.characters);
    const [premuimCharacters] = useState(premiumCaractersData.characters);

    // State to manage active category
    const [activeCategory, setActiveCategory] = useState(-1);
    const [categoryWithCharacters, setCategoryWithCharacters] = useState([]);
    const [filteredCategoryWithCharacters, setFilteredCategoryWithCharacters] = useState([]);

    // State to manage favorites
    const [favorites, setFavorites] = useState([]);
    const [user, setUser] = useState(null);

    // State for search functionality
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearchVisible, setIsSearchVisible] = useState(false);

    // Premuim modal display
    const [isModalVisible, setIsModalVisible] = useState(false); // State for modal visibility

    // Listen to auth state changes
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

    // Load favorites when screen is focused
    useFocusEffect(
        React.useCallback(() => {
            if (user) {
                loadFavorites(user);
            } else {
                loadFavoritesFromLocal();
            }

        }, [user])
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

    // Handle category press
    const handleCategoryPress = (category) => {
        // Close search bar when category is pressed
        setIsSearchVisible(false);

        const categoryId = category ? category.id : -1;
        setActiveCategory(categoryId);

        const filtered = filterCharactersByCategoryId(categoryId);
        setFilteredCategoryWithCharacters(filtered);
    };

    // Handle heart press to add/remove favorites
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
                await AsyncStorage.setItem('user_favorites', JSON.stringify(updatedFavorites));
            }
        } catch (error) {
            console.error("Error updating favorites:", error);
        }
    };

    // Load favorites from Firebase or AsyncStorage
    const loadFavorites = async () => {
        try {
            if(user?.uid){
                const docRef = doc(FIREBASE_DB, "user_favorites", user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setFavorites(data.favorites || []);
                }
            }
        } catch (error) {
            console.error("Error loading favorites from home screen:", error);
        }
    };

    const loadFavoritesFromLocal = async () => {
        try {   
            const value = await AsyncStorage.getItem('user_favorites');
            let favoriteCharacters = value ? JSON.parse(value) : [];
            setFavorites(favoriteCharacters);
        } catch (error) {
            console.error("Error loading favorites from local home screen:", error);
        }
    };
 
    // Initialize characters with categories
    useEffect(() => {
        const initialCharacters = getCharactersWithCategories(characters, categories);
        setCategoryWithCharacters(initialCharacters);
        setFilteredCategoryWithCharacters(initialCharacters);
    }, [characters, categories]);

    // Filter characters by search query
    const filterCharactersBySearch = (query) => {
        if (query === "") {
            setFilteredCategoryWithCharacters(categoryWithCharacters);
        } else {
            const filtered = categoryWithCharacters.map((category) => ({
                ...category,
                characters: category.characters.filter((character) =>
                    character.name.toLowerCase().includes(query.toLowerCase())
                ),
            }));
            setFilteredCategoryWithCharacters(filtered);
        }
    };

    useEffect(() => {
        filterCharactersBySearch(searchQuery);
    }, [searchQuery, categoryWithCharacters]);

    // Handle search icon press
    const handleSearchIconPress = () => {
        setIsSearchVisible(!isSearchVisible);
        setSearchQuery(""); // Clear search query when closing search bar
    };

    const handleShowPremiumCharacters = () => {
        setIsModalVisible(true);
    };

    const handleCharacterSelect = (character) => {
        // Navigate to chat screen with selected character
        const characterSystemPrompt = generateCharacterPrompt(character);
        character['system_content'] = characterSystemPrompt;
        setIsModalVisible(false);
        navigation.navigate("Chat", { character });
    };

    return (
        <SafeAreaView
            className={`flex-1 bg-chatbot-dark`}
            style={{ paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0 }}
        >
            <MyHeader
                title="ChatBot AI"
                icon={isSearchVisible ? "close" : "search"}
                onIconPress={handleSearchIconPress}
                onPremuimPress={handleShowPremiumCharacters}
            />

            {isSearchVisible && (
                <View className="flex-row m-4 p-4 rounded-3xl bg-[#1b1b1b] items-center">
                    <FontAwesome
                        name="search"
                        size={24}
                        color="white"
                        style={{ paddingRight: 16 }}
                    />
                    <TextInput
                        placeholder="Search characters..."
                        placeholderTextColor="gray"
                        className={`flex-1 text-lg text-white ${
                            Platform.OS === "ios" ? "-mt-1" : ""
                        }`}
                        value={searchQuery}
                        onChangeText={(text) => setSearchQuery(text)}
                    />
                </View>
            )}

            <View className="flex-row py-2">
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
             {/* Modal for character selection */}
             <Modal
                animationType="slide"
                transparent={true}
                visible={isModalVisible}
                onRequestClose={() => setIsModalVisible(false)}
            >
                <SafeAreaView className="flex-1 bg-chatbot-dark">
                    <View className="p-6 flex-1">
                        <Text className="text-white text-lg text-center font-bold mb-4">
                            Choose a Character
                        </Text>

                        <View className="flex-1">
                            <MyCharacterSelectionList
                                characters={premuimCharacters}
                                onCharacterSelect={(character) => {
                                    handleCharacterSelect(character);
                                    setIsModalVisible(false);
                                }}
                            />
                        </View>

                        <TouchableOpacity
                            className="bg-white m-4 p-4 rounded-2xl items-center justify-center"
                            onPress={() => setIsModalVisible(false)}
                        >
                            <Text className="text-base font-semibold">Close</Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </Modal>
        </SafeAreaView>
    );
};

export default HomeScreen;
