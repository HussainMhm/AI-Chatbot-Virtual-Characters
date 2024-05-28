import React, { useEffect, useRef, useState } from "react";
import {
    View,
    Text,
    SafeAreaView,
    Platform,
    StatusBar,
    ImageBackground,
    ScrollView,
    Alert,
    TouchableOpacity,
    Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

import MyChatTopBar from "../components/MyChatTopBar";
import MyChatInputBar from "../components/MyChatInputBar";
import { FIREBASE_DB, FIREBASE_AUTH } from "../firebaseConfig";
import { apiCall } from "../api/openAi";
import { getImage } from "../helpers/index";

const ChatScreen = ({ navigation, route }) => {
    const { character } = route.params;
    const [messages, setMessages] = useState([
        { role: "system", content: character.system_content },
        { role: "assistant", content: character.assistant_content },
    ]);
    const [messageText, setMessageText] = useState("");
    const [loading, setLoading] = useState(false);
    const [recommendationsVisible, setRecommendationsVisible] = useState(true);
    const [user, setUser] = useState(null);
    const [favorites, setFavorites] = useState([]);

    const ScrollViewRef = useRef();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (currentUser) => {
            setUser(currentUser);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        loadChatHistory();
        loadFavorites();
    }, [character.id, user]);

    const loadChatHistory = async () => {
        try {
            let chatExists = false;
            let existingMessages = [];
    
            if (user) {
                // Firebase logic
                const docRef = doc(FIREBASE_DB, "user_chat_history", user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    if (data[character.id]) {
                        existingMessages = data[character.id].messages;
                        chatExists = true;
                    }
                }
            } else {
                // Local storage logic
                const value = await AsyncStorage.getItem("user_chat_history");
                let chatsHistory = value ? JSON.parse(value) : {};
                if (chatsHistory[character.id]) {
                    existingMessages = chatsHistory[character.id].messages;
                    chatExists = true;
                }
            }
    
            if (chatExists) {
                Alert.alert(
                    "Chat History Found",
                    "Do you want to continue the previous chat or start a new one?",
                    [
                        {
                            text: "New Chat",
                            onPress: async () => {
                                // Reset messages to default for a new chat
                                setMessages([
                                    { role: "system", content: character.system_content },
                                    { role: "assistant", content: character.assistant_content },
                                ]);
                                // Delete the existing chat history
                                await deleteChatHistory();
                            },
                        },
                        {
                            text: "Continue",
                            onPress: () => {
                                setMessages(existingMessages);
                            },
                        },
                    ],
                    { cancelable: false }
                );
            }
        } catch (error) {
            console.error("Error loading chat history:", error);
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
                const value = await AsyncStorage.getItem("user_favorites");
                let favoriteCharacters = value ? JSON.parse(value) : [];
                setFavorites(favoriteCharacters);
            }
        } catch (error) {
            console.error("Error loading favorites:", error);
        }
    };

    const deleteChatHistory = async () => {
        try {
            if (user) {
                // Firebase delete logic
                const docRef = doc(FIREBASE_DB, "user_chat_history", user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    if (data[character.id]) {
                        delete data[character.id];
                        await setDoc(docRef, data);
                    }
                }
            } else {
                // Local storage delete logic
                const value = await AsyncStorage.getItem("user_chat_history");
                let chatsHistory = value ? JSON.parse(value) : {};
                if (chatsHistory[character.id]) {
                    delete chatsHistory[character.id];
                }
                await AsyncStorage.setItem("user_chat_history", JSON.stringify(chatsHistory));
            }
            restartChat();
        } catch (error) {
            console.error("Error deleting chat history:", error);
        }
    };
    

    const restartChat = () => {
        setMessages([
            { role: "system", content: character.system_content },
            { role: "assistant", content: character.assistant_content },
        ]);

        setRecommendationsVisible(true);
    };

    const saveChatMessages = async () => {
        // Check if there are any user messages
        const userMessagesExist = messages.some((message) => message.role === "user");
        if (!userMessagesExist) return; // If no user messages, do not save
    
        try {
            if (user) {
                // Firebase save logic
                const docRef = doc(FIREBASE_DB, "user_chat_history", user.uid);
                const docSnap = await getDoc(docRef);
                const existingData = docSnap.exists() ? docSnap.data() : {};
                const updatedData = {
                    ...existingData,
                    [character.id]: {
                        ...character,
                        messages: messages,
                    },
                };
                await setDoc(docRef, updatedData);
            } else {
                // Local storage save logic
                const value = await AsyncStorage.getItem("user_chat_history");
                let chatsHistory = value ? JSON.parse(value) : {};
    
                chatsHistory[character.id] = {
                    ...character,
                    messages: messages,
                };
    
                await AsyncStorage.setItem("user_chat_history", JSON.stringify(chatsHistory));
            }
        } catch (error) {
            console.error("Error saving chats history:", error);
        }
    };
    

    const toggleFavorite = async () => {
        try {
            let updatedFavorites = [];
            if (favorites.includes(character.id)) {
                updatedFavorites = favorites.filter((fav) => fav !== character.id);
            } else {
                updatedFavorites = [...favorites, character.id];
            }
            setFavorites(updatedFavorites);

            if (user) {
                const docRef = doc(FIREBASE_DB, "user_favorites", user.uid);
                await setDoc(docRef, { favorites: updatedFavorites });
            } else {
                await AsyncStorage.setItem("user_favorites", JSON.stringify(updatedFavorites));
            }
        } catch (error) {
            console.error("Error updating favorites:", error);
        }
    };

    const sendMessage = () => {
        if (messageText.trim().length > 0) {
            let newMessages = [...messages];
            newMessages.push({
                role: "user",
                content: messageText.trim(),
            });
            setMessages([...newMessages]);
            updateScrollView();
            setLoading(true);
            apiCall(messageText.trim(), newMessages).then((res) => {
                if (res?.success) {
                    setLoading(false);
                    setMessages([...res.data]);
                    updateScrollView();
                } else {
                    Alert.alert("Error", res.msg);
                }
            });
            setMessageText("");
        }
    };

    const sendRecommendation = (recommendation) => {
        let newMessages = [...messages];
        newMessages.push({
            role: "user",
            content: recommendation,
        });
        setMessages([...newMessages]);
        updateScrollView();
        setLoading(true);
        apiCall(recommendation, newMessages).then((res) => {
            if (res?.success) {
                setLoading(false);
                setMessages([...res.data]);
                updateScrollView();
            } else {
                Alert.alert("Error", res.msg);
            }
        });
        setRecommendationsVisible(false);
    };

    const updateScrollView = () => {
        setTimeout(() => {
            ScrollViewRef?.current?.scrollToEnd({ animated: true });
        });
    };

    const renderMessage = (message, index) => {
        if (message.role === "user") {
            return (
                <View
                    key={index}
                    className="bg-orange-300 py-3 px-4 rounded-2xl mb-3 ml-10 self-end"
                >
                    <Text className="text-base">{message.content}</Text>
                </View>
            );
        } else if (message.role === "assistant") {
            if (message.content.startsWith("https://")) {
                return (
                    <View
                        key={index}
                        className="bg-[#1b1b1b] py-3 px-4 rounded-2xl mb-3 mr-10 self-start"
                    >
                        <Image
                            source={{ uri: message.content }}
                            className="w-full h-40 rounded-2xl"
                            style={{ width: 200, height: 200, borderRadius: 20 }}
                        />
                    </View>
                );
            } else if (message.content.length > 0) {
                return (
                    <View
                        key={index}
                        className="bg-[#1b1b1b] py-4 px-6 rounded-3xl mb-3 mr-10 self-start"
                    >
                        <Text className="text-white text-base">{message.content}</Text>
                    </View>
                );
            } else {
                return null;
            }
        }
    };

    const renderRecommendations = () => {
        if (
            !recommendationsVisible ||
            !character.recommendations ||
            character.recommendations?.length <= 0
        ) {
            return null;
        }

        return (
            <View className="p-4 mb-4">
                <Text className="text-white text-2xl font-bold mb-2">You can ask:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {character.recommendations.map((recommendation, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={() => sendRecommendation(recommendation)}
                            className="p-4 w-36 mr-3 rounded-xl"
                            style={{
                                backgroundColor: "rgba(0, 0, 0, 0.5)",
                            }}
                        >
                            <Text className="text-white">{recommendation}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
        );
    };

    return (
        <ImageBackground
            source={
                character?.image_path?.startsWith("assets/")
                    ? getImage(character?.id)
                    : {
                          uri:
                              character?.image_path ??
                              "https://randomuser.me/api/portraits/med/men/1.jpg",
                      }
            }
            className="flex-1"
            resizeMode="cover"
        >
            <SafeAreaView
                style={{
                    flex: 1,
                    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
                }}
            >
                <MyChatTopBar
                    messages={messages}
                    favorites={favorites}
                    character={character}
                    saveChatMessages={saveChatMessages}
                    deleteChatHistory={deleteChatHistory}
                    restartChat={restartChat}
                    toggleFavorite={toggleFavorite}
                />

                <ScrollView ref={ScrollViewRef} className="flex-1 px-5 py-3">
                    {messages.map((message, i) => (
                        <View key={i}>{renderMessage(message, i)}</View>
                    ))}

                    {loading && (
                        <View className="bg-gray-800 py-3 px-4 rounded-2xl mb-2 self-start">
                            <Ionicons name="ellipsis-horizontal" size={24} color="white" />
                        </View>
                    )}
                </ScrollView>

                {renderRecommendations()}

                <MyChatInputBar
                    messageText={messageText}
                    setMessageText={setMessageText}
                    sendMessage={sendMessage}
                />
            </SafeAreaView>
        </ImageBackground>
    );
};

export default ChatScreen;
