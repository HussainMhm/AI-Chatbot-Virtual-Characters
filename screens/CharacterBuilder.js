import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    Platform,
    StatusBar,
    ScrollView,
    Image,
    Button,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";
import CountryFlag from "react-native-country-flag";

import MyHeader from "../components/MyHeader";
import countriesData from "../data/countries";
import categoriesData from "../data/categories";
import MyProgressIndicator from "../components/MyProgressIndicator";

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from "@react-navigation/native";

const CharacterBuilder = ({ navigation }) => {
    // Step state and handler
    const [step, setStep] = useState(1);
    const totalSteps = 7;

    const handleNextStep = () => {
        setStep((prevStep) => prevStep + 1);
    };

    const handleBackStep = () => {
        if (step > 1) {
            setStep((prevStep) => prevStep - 1);
        } else {
            navigation.navigate("CharacterList", { refreshCharacters: false });
        }
    };

    const [countries] = useState(countriesData.countries);
    const [categories] = useState(categoriesData.categories);

    // Character state and handlers
    const [characterName, setCharacterName] = useState("");
    const [characterDescription, setCharacterDescription] = useState("");
    const [characterPhoto, setCharacterPhoto] = useState(null);
    const [characterAge, setCharacterAge] = useState(18);
    const [characterGender, setCharacterGender] = useState("");
    const [characterHometown, setCharacterHometown] = useState("");
    const [characterInterests, setCharacterInterests] = useState([]);
    const [characterFirstMessage, setCharacterFirstMessage] = useState("");
    const [characterCategory, setCharacterCategory] = useState("");

    // List of interests and emojis
    const interestsList = [
        "Art",
        "Astrology",
        "Books",
        "Business",
        "Cars",
        "Crypto",
        "Dance",
        "Fitness",
        "Food",
        "Games",
        "History",
        "Languages",
        "Meditation",
        "Movies",
        "Music",
        "Nature",
        "Philosophy",
        "Photo and Video",
        "Relationship",
        "Science",
        "Sports",
        "Technology",
        "Travel",
        // Add more interests as needed
    ];
    const interestEmojis = {
        Art: "🎨",
        Astrology: "⭐",
        Books: "📚",
        Business: "💼",
        Cars: "🚗",
        Crypto: "💰",
        Dance: "💃",
        Fitness: "💪",
        Food: "🍔",
        Games: "🎮",
        History: "📜",
        Languages: "🗣️",
        Meditation: "🧘",
        Movies: "🎬",
        Music: "🎵",
        Nature: "🌳",
        Philosophy: "🤔",
        "Photo and Video": "📸",
        Relationship: "💑",
        Science: "🔬",
        Sports: "⚽",
        Technology: "💻",
        Travel: "✈️",
    };

    const handleCreateCharacter = async () => {
        // Logic to save the character
        const newCharacter = {
            name: characterName,
            description: characterDescription,
            photo: characterPhoto,
            age: characterAge,
            gender: characterGender,
            hometown: characterHometown,
            interests: characterInterests,
            firstMessage: characterFirstMessage,
            category: characterCategory,
        };
        await saveNewCharcter(newCharacter);
        
        // Navigate back or show a success message
        navigation.navigate("CharacterList", { refreshCharacters: true });
    };

    useFocusEffect(
        React.useCallback(() => {
            setStep(1)
        }, [])
    );
    

    const saveNewCharcter = async (newCharacter) => {
        try {
            const value = await AsyncStorage.getItem('new-characters');
    
            let newCharacters = [];
            
            if (value != null) {
                newCharacters = JSON.parse(value);
            }

            if (newCharacter) {
                newCharacters.push(newCharacter);
            }

            const jsonValue = JSON.stringify(newCharacters);
            await AsyncStorage.setItem('new-characters', jsonValue);
        } catch (e) {
            console.log(`Failed to save new character`);
        }
    };
    

    const renderTitleAndDescription = (title, description) => {
        return (
            <View className="mt-8">
                <Text className="text-white text-xl text-center font-semibold">{title}</Text>
                <Text className="text-gray-400 text-base text-center mt-2 mb-6">{description}</Text>
            </View>
        );
    };

    // Render different UI components based on the current step
    const renderStep = () => {
        switch (step) {
            // Render character name input
            case 1:
                return (
                    <View>
                        {renderTitleAndDescription(
                            "Your character's name",
                            "We use this information to create characters."
                        )}

                        <View className="flex-row m-4 p-4 rounded-3xl bg-[#1b1b1b] items-center">
                            <TextInput
                                value={characterName}
                                onChangeText={setCharacterName}
                                placeholder="Character Name"
                                placeholderTextColor="gray"
                                className={`flex-1 text-lg ${
                                    Platform.OS === "ios" ? "-mt-1" : ""
                                } text-white`}
                            />
                        </View>
                    </View>
                );

            // Render character photo picker
            case 2:
                const pickImage = async () => {
                    // No permissions request is necessary for launching the image library
                    let result = await ImagePicker.launchImageLibraryAsync({
                        mediaTypes: ImagePicker.MediaTypeOptions.All,
                        allowsEditing: true,
                        aspect: [4, 3],
                        quality: 1,
                    });

                    console.log(result);

                    if (!result.canceled) {
                        setCharacterPhoto(result.assets[0].uri);
                    }
                };

                return (
                    <View className="flex-1 items-center">
                        {/* Header text */}
                        {renderTitleAndDescription(
                            "Your character's photo",
                            "What would your character to look like?"
                        )}

                        {/* Photo picker and display */}
                        <View className="flex-1 mt-4 items-center">
                            {characterPhoto && (
                                <Image
                                    source={{ uri: characterPhoto }}
                                    className="w-64 h-64 rounded-xl mb-4"
                                />
                            )}
                            <TouchableOpacity
                                className="bg-[#1b1b1b] w-28 h-28 justify-center items-center mt-4 rounded-3xl"
                                onPress={pickImage}
                            >
                                <Ionicons name="images" size={40} color="white" />
                            </TouchableOpacity>
                        </View>
                    </View>
                );

            // Render character age and gender inputs
            case 3:
                const handleAgeChange = (itemValue) => {
                    setCharacterAge(itemValue);
                };

                return (
                    <View className="flex-1">
                        {/* Character age picker */}
                        <View className="flex-1 items-center">
                            {/* Title and Description */}
                            {renderTitleAndDescription(
                                "Your character's age",
                                "We use this information to create characters."
                            )}

                            {/* Age Picker */}
                            <View
                                className={`w-full items-center  ${
                                    Platform.OS === "android"
                                        ? "bg-[#1b1b1b] w-2/5 items-center rounded-3xl"
                                        : ""
                                }`}
                            >
                                <Picker
                                    dropdownIconColor={"white"}
                                    selectedValue={characterAge}
                                    onValueChange={(itemValue) => handleAgeChange(itemValue)}
                                    style={{
                                        height: "50",
                                        width: "75%",
                                        margin: 10,
                                    }}
                                >
                                    {Array.from({ length: 100 }, (_, index) => (
                                        <Picker.Item
                                            key={index}
                                            label={`${index + 1}`}
                                            value={index + 1}
                                            color="white"
                                            style={{
                                                backgroundColor: "#1b1b1b",
                                            }}
                                        />
                                    ))}
                                </Picker>
                            </View>
                        </View>

                        {/* Character gender selector */}
                        <View className="flex-1 mt-10">
                            {/* Title and Description */}
                            {renderTitleAndDescription(
                                "Your character's gender",
                                "We use this information to create characters."
                            )}

                            {/* Gender Selectors */}
                            <View className="flex-row justify-center space-x-3">
                                <TouchableOpacity
                                    onPress={() => setCharacterGender("Male")}
                                    className={`w-28 py-3 justify-center items-center rounded-2xl ${
                                        characterGender === "Male" ? "bg-white" : "bg-[#222222]"
                                    }`}
                                >
                                    <Text
                                        className={`text-base font-semibold ${
                                            characterGender === "Male" ? "text-black" : "text-white"
                                        }`}
                                    >
                                        Male
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => setCharacterGender("Female")}
                                    className={`w-28 py-3 justify-center items-center rounded-2xl ${
                                        characterGender === "Female" ? "bg-white" : "bg-[#222222]"
                                    }`}
                                >
                                    <Text
                                        className={`text-base font-semibold ${
                                            characterGender === "Female"
                                                ? "text-black"
                                                : "text-white"
                                        }`}
                                    >
                                        Female
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                );

            // Render character hometown input
            case 4:
                const handleCountryChange = (itemValue) => {
                    setCharacterHometown(itemValue);
                };

                return (
                    <View className="flex-1">
                        {/* Character age picker */}
                        <View className="flex-1 items-center">
                            {/* Title and Description */}
                            {renderTitleAndDescription(
                                "Your character's hometown",
                                "We use this information to create characters."
                            )}

                            {/* Display selected country flag */}
                            {characterHometown ? (
                                <View className="mt-4 mb-6">
                                    <CountryFlag isoCode={characterHometown} size={44} />
                                </View>
                            ) : null}

                            {/* Country Picker */}
                            <View
                                className={`w-full items-center  ${
                                    Platform.OS === "android"
                                        ? "bg-[#1b1b1b] w-4/5 items-center rounded-3xl"
                                        : ""
                                }`}
                            >
                                <Picker
                                    dropdownIconColor={"white"}
                                    selectedValue={characterHometown}
                                    onValueChange={(itemValue) => handleCountryChange(itemValue)}
                                    style={{ height: 50, width: "75%", margin: 10 }}
                                >
                                    {/* Render Picker Items with country names and flags */}
                                    {countries.map((country, index) => (
                                        <Picker.Item
                                            key={index}
                                            label={`${country.name} `}
                                            value={country.code}
                                            style={{
                                                flexDirection: "row",
                                                alignItems: "center",
                                                backgroundColor: "#1b1b1b",
                                            }}
                                            color="white"
                                        ></Picker.Item>
                                    ))}
                                </Picker>
                            </View>
                        </View>
                    </View>
                );

            // Render character interest selectors
            case 5:
                const toggleInterest = (interest) => {
                    if (characterInterests.includes(interest)) {
                        // Remove the interest if it's already selected
                        setCharacterInterests(
                            characterInterests.filter((item) => item !== interest)
                        );
                    } else {
                        // Add the interest if it's not already selected
                        setCharacterInterests([...characterInterests, interest]);
                    }
                };

                return (
                    <View className="flex-1">
                        {/* Render title and description */}
                        {renderTitleAndDescription(
                            "Your character's interests",
                            "Choose up to 3 interests for your character"
                        )}

                        {/* Interests list */}
                        <ScrollView
                            className="mt-4 mx-4"
                            contentContainerStyle={{
                                flexDirection: "row", // Added flexDirection to align items horizontally
                                flexWrap: "wrap",
                            }}
                        >
                            {interestsList.map((interest, index) => (
                                <TouchableOpacity
                                    key={index}
                                    className={`flex-row bg-[#1b1b1b] rounded-2xl py-4 px-5 m-2 items-center justify-center ${
                                        characterInterests.includes(interest) ? "bg-gray-500" : ""
                                    }`}
                                    onPress={() => toggleInterest(interest)}
                                >
                                    {/* Use the emoji corresponding to the interest */}
                                    <Text style={{ fontSize: 16, marginRight: 5 }}>
                                        {interestEmojis[interest]}
                                    </Text>
                                    <Text className="text-white text-base font-semibold">
                                        {interest}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                );

            // Render character first message input
            case 6:
                return (
                    <View>
                        {renderTitleAndDescription(
                            "Your character's first message",
                            "How would your character introduce themselves."
                        )}

                        <View className="flex-row m-4 p-4 rounded-3xl bg-[#1b1b1b] items-center">
                            <TextInput
                                value={characterFirstMessage}
                                onChangeText={setCharacterFirstMessage}
                                placeholder="Type here"
                                placeholderTextColor="gray"
                                className={`flex-1 text-lg ${
                                    Platform.OS === "ios" ? "-mt-1" : ""
                                } text-white`}
                            />
                        </View>
                    </View>
                );

            // Render character category and description input
            case 7:
                const handleCategoryChange = (itemValue) => {
                    setCharacterCategory(itemValue);
                };

                return (
                    <View className="flex-1">
                        {/* Character category picker */}
                        <View className="flex-1 items-center">
                            {/* Title and Description */}
                            {renderTitleAndDescription(
                                "Your character's category",
                                "We use this information to create characters."
                            )}

                            {/* Category Picker */}
                            <View
                                className={`w-full items-center  ${
                                    Platform.OS === "android"
                                        ? "bg-[#1b1b1b] w-3/5 items-center rounded-3xl"
                                        : ""
                                }`}
                            >
                                <Picker
                                    dropdownIconColor={"white"}
                                    selectedValue={characterCategory}
                                    onValueChange={(itemValue) => handleCategoryChange(itemValue)}
                                    style={{
                                        height: "50",
                                        width: "75%",
                                        margin: 10,
                                    }}
                                >
                                    {/* Render Picker Items with country names and flags */}
                                    {categories.map((category, index) => (
                                        <Picker.Item
                                            key={index}
                                            label={`${category.name} `}
                                            value={category.id}
                                            style={{
                                                flexDirection: "row",
                                                alignItems: "center",
                                                backgroundColor: "#1b1b1b",
                                            }}
                                            color="white"
                                        ></Picker.Item>
                                    ))}
                                </Picker>
                            </View>
                        </View>

                        {/* Character gender selector */}
                        <View className="flex-1 mt-10">
                            {/* Title and Description */}
                            {renderTitleAndDescription(
                                "Your character's description",
                                "We use this information to create characters."
                            )}

                            {/* Gender Selectors */}
                            <View className="flex-row my-4 mx-8 p-4 rounded-3xl bg-[#1b1b1b] items-center">
                                <TextInput
                                    value={characterDescription}
                                    onChangeText={setCharacterDescription}
                                    placeholder="Character Description"
                                    placeholderTextColor="gray"
                                    className={`flex-1 text-lg ${
                                        Platform.OS === "ios" ? "-mt-1" : ""
                                    } text-white`}
                                />
                            </View>
                        </View>
                    </View>
                );
            default:
                return null;
        }
    };

    return (
        <SafeAreaView
            className={`flex-1 bg-chatbot-dark`}
            style={{ paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0 }}
        >
            {/* Progress Indicator */}
            <MyProgressIndicator steps={totalSteps} currentStep={step} goBack={handleBackStep} />

            {/* Render the current step */}
            <View className="flex-1">
                <View style={{ flex: 1 }}>{renderStep()}</View>
            </View>

            {/* Button to navigate to the next step or create the character */}
            <TouchableOpacity
                className="bg-white m-4 p-4 rounded-2xl items-center justify-center"
                onPress={step < 7 ? handleNextStep : handleCreateCharacter}
            >
                <Text className="text-base font-semibold">
                    {step < 7 ? "Continue" : "Create Character"}
                </Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = {
    button: {
        backgroundColor: "orange",
        padding: 15,
        alignItems: "center",
    },
    buttonText: {
        color: "white",
        fontWeight: "bold",
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
    },
    halfInput: {
        flex: 1,
        marginRight: 10,
    },
    selectedButton: {
        backgroundColor: "blue",
    },
    imagePickerContainer: {
        marginBottom: 20,
    },
    imagePickerText: {
        marginBottom: 10,
        color: "blue",
    },
    characterImage: {
        width: 200,
        height: 200,
        resizeMode: "cover",
        marginBottom: 10,
    },
    interestsContainer: {
        marginBottom: 20,
    },
    interestButton: {
        backgroundColor: "lightgray",
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 10,
    },
};

export default CharacterBuilder;
