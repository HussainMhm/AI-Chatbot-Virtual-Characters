import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    SafeAreaView,
    Platform,
    StatusBar,
    Image,
    TouchableOpacity,
    ScrollView,
} from "react-native";
import MyHeader from "../components/MyHeader";
import { useFocusEffect } from "@react-navigation/native";
import MyChatListItem from "../components/MyChatListItem";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MyProfileHeader from "../components/MyProfileHeader";

const ProfileScreen = () => {
    const [activeTab, setActiveTab] = useState("savedChats");
    const [favoriteCharacters, setFavoriteCharacters] = useState([]);
    const [chatsHistory, setChatsHistory] = useState([]);
    const [newCharacters, setNewCharacters] = useState([]);

    // Tabs data
    const tabs = [
        { label: "Saved Chats", value: "savedChats" },
        { label: "My Characters", value: "myCharacters" },
        { label: "Favorites", value: "favorites" },
    ];

    useEffect(() => {
        getFavoriteCharacters();
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            getChatsHistory();
            getNewCharacters();
            getFavoriteCharacters();
        }, [])
    );

    const getChatsHistory = async () => {
        try {
            const value = await AsyncStorage.getItem("chats-history");
            console.log(value);
            const history = value ? JSON.parse(value) : [];
            setChatsHistory(Array.isArray(history) ? history : []);
        } catch (e) {
            console.log(`Failed to get chat history:`, e);
        }
    };

    const getNewCharacters = async () => {
        try {
            const value = await AsyncStorage.getItem("new-characters");
            const characters = value ? JSON.parse(value) : [];
            setNewCharacters(Array.isArray(characters) ? characters : []);
        } catch (e) {
            console.log(`failed to get new characters ${e}`);
        }
    };

    const getFavoriteCharacters = async () => {
        try {
            const value = await AsyncStorage.getItem("favorite-characters");
            const characters = JSON.parse(value);
            console.log("favorites: ", characters);
            setFavoriteCharacters(Array.isArray(characters) ? characters : []);
        } catch (e) {
            console.log(`Failed to get favorite characters:`, e);
        }
    };

    // Function to render content based on active tab
    const renderContent = () => {
        switch (activeTab) {
            case "savedChats":
                return (
                    <ScrollView
                        className="flex-1 mt-4"
                        keyboardDismissMode="on-drag"
                        contentContainerStyle={{ flexGrow: 1 }}
                    >
                        {chatsHistory.length > 0 ? (
                            chatsHistory.map((chatHistory, index) => (
                                <MyChatListItem key={index} character={chatHistory?.chat} />
                            ))
                        ) : (
                            <View className="flex-1 items-center justify-center">
                                <Text className="text-gray-400 text-lg">No archived chat yet!</Text>
                            </View>
                        )}
                    </ScrollView>
                );
            case "myCharacters":
                return (
                    <ScrollView
                        className="flex-1 mt-4"
                        keyboardDismissMode="on-drag"
                        contentContainerStyle={{ flexGrow: 1 }}
                    >
                        {newCharacters.length > 0 ? (
                            newCharacters.map((character, index) => (
                                <MyChatListItem key={index} character={character} />
                            ))
                        ) : (
                            <View className="flex-1 items-center justify-center">
                                <Text className="text-gray-400 text-lg">
                                    No characters created yet!
                                </Text>
                            </View>
                        )}
                    </ScrollView>
                );
            case "favorites":
                return (
                    <ScrollView
                        className="flex-1 mt-4"
                        keyboardDismissMode="on-drag"
                        contentContainerStyle={{ flexGrow: 1 }}
                    >
                        {favoriteCharacters.length > 0 ? (
                            favoriteCharacters.map((character, index) => (
                                <MyChatListItem key={index} character={character} />
                            ))
                        ) : (
                            <View className="flex-1 items-center justify-center">
                                <Text className="text-gray-400 text-lg">
                                    No favorited characters yet!
                                </Text>
                            </View>
                        )}
                    </ScrollView>
                );
            default:
                return null;
        }
    };

    return (
        <SafeAreaView
            style={{
                flex: 1,
                paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
            }}
            className="bg-chatbot-dark"
        >
            <MyProfileHeader title="Profile" icon={"person"} />

            {/* Profile information */}
            <View className="p-4 flex-row items-center">
                <Image
                    source={{ uri: "https://randomuser.me/api/portraits/med/men/1.jpg" }}
                    className="w-24 h-24 rounded-full mr-6"
                />
                <View>
                    <Text className="text-white text-xl font-bold">John Doe</Text>
                    <Text className="text-gray-500">@johndoe</Text>
                </View>
            </View>

            {/* Tabs */}
            <View style={{ flexDirection: "row", justifyContent: "space-around", marginTop: 16 }}>
                {tabs.map((tab) => (
                    <TouchableOpacity key={tab.value} onPress={() => setActiveTab(tab.value)}>
                        <Text
                            style={{
                                color: activeTab === tab.value ? "white" : "gray",
                            }}
                            className="text-base"
                        >
                            {tab.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {renderContent()}
        </SafeAreaView>
    );
};

export default ProfileScreen;
