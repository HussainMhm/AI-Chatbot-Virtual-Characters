// ChatListScreen.js
import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    SafeAreaView,
    Platform,
    StatusBar,
    TextInput,
    ScrollView,
    TouchableOpacity,
    Modal,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";

import MyHeader from "../components/MyHeader";
import MyChatListItem from "../components/MyChatListItem";
import MyCharacterSelectionList from "../components/MyCharacterSelectionList";

import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { FIREBASE_DB, FIREBASE_AUTH } from "../firebaseConfig";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import charactersData from "../data/characters.json";

const ChatListScreen = ({ navigation }) => {
    const [chatsHistory, setChatsHistory] = useState([]);
    const [user, setUser] = useState(null);
    const [searchQuery, setSearchQuery] = useState(""); // State for search query
    const [filteredChats, setFilteredChats] = useState([]); // State for filtered chat history
    const [isModalVisible, setIsModalVisible] = useState(false); // State for modal visibility

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (currentUser) => {
            if (currentUser) {
                getChatsHistory();
            }else {
                getChatsHistoryFromLocal();
            }
            setUser(currentUser);
        });

        return () => unsubscribe();
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            getChatsHistory();
        }, [user])
    );

    const getChatsHistory = async () => {
        try {
            const docRef = doc(FIREBASE_DB, "user_chat_history", user.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                const history = Object.values(data);
                setChatsHistory(Array.isArray(history) ? history : []);
                setFilteredChats(Array.isArray(history) ? history : []);
            } else {
                setChatsHistory([]);
                setFilteredChats([]);
            }
        } catch (e) {
            console.log(`Failed to get chat history:`, e);
        }
    };

    const getChatsHistoryFromLocal = async () => {
        try {
            const value = await AsyncStorage.getItem('user_chat_history');
            const history = JSON.parse(value);
            setChatsHistory(Array.isArray(history) ? history : []);
            setFilteredChats(Array.isArray(history) ? history : []);
        } catch (e) {
            console.log(`Failed to get chat history from local storage:`, e);
        }
    }

    const handleSearch = (query) => {
        setSearchQuery(query);
        if (query === "") {
            setFilteredChats(chatsHistory);
        } else {
            const filtered = chatsHistory.filter((chat) =>
                chat.name.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredChats(filtered);
        }
    };

    const handleStartNewChat = () => {
        setIsModalVisible(true);
    };

    const handleCharacterSelect = (character) => {
        // Navigate to chat screen with selected character
        setIsModalVisible(false);
        navigation.navigate("Chat", { character });
    };
    }


    return (
        <SafeAreaView
            className="flex-1 bg-chatbot-dark"
            style={{ paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0 }}
        >
            {/* Header */}
            <MyHeader title="Chats" icon={"chatbubbles"} />

            {/* Search bar */}
            <View className="flex-row m-4 p-4 rounded-3xl bg-[#1b1b1b] items-center">
                <FontAwesome name="search" size={24} color="white" style={{ paddingRight: 16 }} />
                <TextInput
                    placeholder="Search"
                    placeholderTextColor="gray"
                    className={`flex-1 text-lg text-white ${Platform.OS === "ios" ? "-mt-1" : ""}`}
                    value={searchQuery}
                    onChangeText={handleSearch}
                />
            </View>

            {/* Chat list */}
            <ScrollView
                className="flex-1"
                keyboardDismissMode="on-drag"
                contentContainerStyle={{ flexGrow: 1 }}
            >
                {filteredChats.length > 0 ? (
                    filteredChats.map((chatHistory, index) => (
                        <MyChatListItem key={index} character={chatHistory} />
                    ))
                ) : (
                    <View className="flex-1 items-center justify-center">
                        <Text className="text-white">
                            You haven't chatted with any character yet!
                        </Text>
                    </View>
                )}
            </ScrollView>

            {/* Start New Chat button */}
            <TouchableOpacity
                className="bg-white m-4 p-4 rounded-2xl items-center justify-center"
                onPress={handleStartNewChat}
            >
                <Text className="text-base font-semibold">Start New Chat</Text>
            </TouchableOpacity>

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
                                characters={charactersData.characters}
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

export default ChatListScreen;
