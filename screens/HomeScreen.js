import { useState } from "react";
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

const HomeScreen = ({ navigation }) => {
    // Dummy data
    const categories = ["All", "New", "Fun", "Experts", "Sports", "History"];
    const characters = [
        { name: "Character 1", image: require("../assets/images/character1.jpeg") },
        { name: "Character 2", image: require("../assets/images/character2.jpeg") },
        { name: "Character 3", image: require("../assets/images/character3.jpeg") },
        { name: "Character 5", image: require("../assets/images/character5.jpeg") },
        { name: "Character 6", image: require("../assets/images/character7.jpeg") },
        { name: "Character 7", image: require("../assets/images/character8.jpeg") },
        // Add more characters as needed
    ];

    // Category state and handler
    const [activeCategory, setActiveCategory] = useState("All");

    const handleCategoryPress = (category) => {
        setActiveCategory(category);
    };

    // Heart icon press handler
    const handleHeartPress = (character) => {
        // Handle heart icon press
    };

    return (
        <SafeAreaView
            className={`flex-1 bg-white`}
            style={{ paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0 }}
        >
            {/* Header component */}
            <MyHeader title="ChatBot AI" icon={"search"} />

            {/* Categories */}
            <View className="flex-row pr-4 py-2">
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="p-2">
                    {categories.map((category, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={() => handleCategoryPress(category)}
                            className={`px-4 py-2 mx-2 rounded-lg
                            ${activeCategory === category ? "bg-blue-500" : "bg-gray-300"}`}
                        >
                            <Text
                                className={`text-base font-medium ${
                                    activeCategory === category ? "text-white" : "text-gray-600"
                                }`}
                            >
                                {category}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Characters List */}
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Portrait Mode*/}
                <MyCharactersList
                    listType={"portrait"}
                    categoryName={"Sports"}
                    characters={characters}
                    onHeartPress={handleHeartPress}
                />

                {/* Square Mode*/}
                <MyCharactersList
                    listType={"square"}
                    categoryName={"Fun"}
                    characters={characters}
                    onHeartPress={handleHeartPress}
                />

                {/* Mini Mode*/}
                <MyCharactersList
                    listType={"mini"}
                    categoryName={"Experts"}
                    characters={characters}
                    onHeartPress={handleHeartPress}
                />
            </ScrollView>
        </SafeAreaView>
    );
};

export default HomeScreen;
