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
    Switch,
    Linking,
} from "react-native";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LottieView from "lottie-react-native";

import MyChatTopBar from "../components/MyChatTopBar";
import MyChatInputBar from "../components/MyChatInputBar";
import { FIREBASE_DB, FIREBASE_AUTH } from "../firebaseConfig";
import { apiCall } from "../api/openAi";
import { getImage } from "../helpers/index";

import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";
import * as Speech from "expo-speech";

const ChatScreen = ({ navigation, route }) => {
    const { character } = route.params;
    const [messages, setMessages] = useState([
        { role: "system", content: character?.system_content },
        { role: "assistant", content: character?.assistant_content },
    ]);
    const [messageText, setMessageText] = useState("");
    const [loading, setLoading] = useState(false);
    const [recommendationsVisible, setRecommendationsVisible] = useState(true);
    const [user, setUser] = useState(null);
    const [favorites, setFavorites] = useState([]);
    const [latestMessage, setLatestMessage] = useState("");
    const [audioDuration, setAudioDuration] = useState(100);

    // Add a state variable to track voice rendering
    const [voiceEnabled, setVoiceEnabled] = useState(false);
    const [isExpoVoice, setExpoVoice] = useState(true);
    const [visionImageUrl, setVisionImageUrl] = useState("");

    const voiceIds = {'male': 'BkdVzTJlDSOP1TQToIvr', 'female': '9DMefmt9qE4f4VhXKMJM'};
    const [voiceId] = useState(character?.gender  === 'male' ? voiceIds?.male : voiceIds?.female);

    const ScrollViewRef = useRef();

    useEffect(() => {
        loadVoiceEnabled();

        const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (currentUser) => {
            setUser(currentUser);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        loadChatHistory();
        loadFavorites();
    }, [character.id, user]);

    useEffect(() => {
        if (messages.length > 0) {
            const lastMessage = messages[messages.length - 1];
            if (lastMessage.role === "assistant" && lastMessage.content.length > 0) {
                displayMessageGradually(lastMessage.content, audioDuration);
            }
        }

        // Check if there are any user messages and hide recommendations if there are
        const userMessagesExist = messages.some((message) => message.role === "user");
        setRecommendationsVisible(!userMessagesExist);
    }, [messages, audioDuration]);

    const loadVoiceEnabled = async () => {
        try {
            const voiceEnabledValue = await AsyncStorage.getItem("voiceEnabled");
            if (voiceEnabledValue !== null) {
                setVoiceEnabled(JSON.parse(voiceEnabledValue));
            } else {
                setVoiceEnabled(false);
            }
        } catch (error) {
            console.error("Error loading voiceEnabled from AsyncStorage:", error);
        }
    };

    useEffect(() => {
        if (!voiceEnabled) {
            Speech.stop();
            setAudioDuration(100);
        }
    }, [voiceEnabled]);

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
            console.error("Error loading favorites from chat screen:", error);
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
                console.log("user_chat_history: ", value);
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

    const speakText = (text) => {
        if (text) {
            Speech.speak(text, {
                language: "en",
                pitch: 1.0,
                rate: 1.0,
            });
        }
    };

    // Helper function to convert blob to base64
    const blobToBase64 = (blob) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result.split(",")[1]);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    };

    const speakTextApi = async (text, messages) => {
        // Regex to identify URLs
        const urlRegex = /https?:\/\/[^\s]+/g;

        // Replace URLs with an empty string
        text = text.replace(urlRegex, "");

        if (isExpoVoice) {
            setLoading(false);
            speakText(text);
        } else if (text) {
            try {
                const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;
                const headers = {
                    Accept: "audio/mpeg",
                    "Content-Type": "application/json",
                    "xi-api-key": "4eff54e546cb590b6eabca7c1e1a4d83",
                };
                const data = {
                    text: text,
                    model_id: "eleven_monolingual_v1",
                    voice_settings: {
                        stability: 0.5,
                        similarity_boost: 0.5,
                    },
                };

                const response = await fetch(url, {
                    method: "POST",
                    headers: headers,
                    body: JSON.stringify(data),
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch audio");
                }

                const audioContent = await response.blob();
                const base64Audio = await blobToBase64(audioContent);
                const uri = FileSystem.cacheDirectory + "audio.mp3";

                // Save the base64 audio content to a file
                await FileSystem.writeAsStringAsync(uri, base64Audio, {
                    encoding: FileSystem.EncodingType.Base64,
                });

                // Load and play the audio
                const { sound, status } = await Audio.Sound.createAsync(
                    { uri: uri },
                    { shouldPlay: true }
                );

                // Set isLoading to false after starting the audio
                setLoading(false);

                await sound.playAsync();

                // Calculate audio duration
                const audioDuration = status.durationMillis;
                setAudioDuration(audioDuration);
            } catch (error) {
                console.log("Error in speakText:", error);
                // Fallback to expo-speach if API fails
                speakText(text);
                // Set isLoading to false if there's an error
                setLoading(false);
            }
        }
        // Set messages after handling the audio and loading state
        setMessages(messages);
    };

    const toggleVoice = async () => {
        const newVoiceEnabled = !voiceEnabled;
        setVoiceEnabled(newVoiceEnabled);
        try {
            await AsyncStorage.setItem("voiceEnabled", JSON.stringify(newVoiceEnabled));
        } catch (error) {
            console.error("Error saving voiceEnabled to AsyncStorage:", error);
        }
    };

    const sendMessage = () => {
        Speech.stop();
        if (messageText.trim().length > 0) {
            let newMessages = [...messages];
            newMessages.push({
                role: "user",
                content: messageText.trim(),
                imageUrl: visionImageUrl !== "" ? visionImageUrl : null,
            });
            setMessages([...newMessages]);
            updateScrollView();
            setLoading(true);
            apiCall(messageText.trim(), newMessages, visionImageUrl).then((res) => {
                if (res?.success) {
                    // Conditionally render messages with or without voice
                    if (voiceEnabled) {
                        // Render messages with voice
                        speakTextApi(res.data[res.data.length - 1].content, [...res.data]);
                    } else {
                        // Render messages without voice
                        setLoading(false);
                        setMessages([...res.data]);
                    }
                    updateScrollView();
                } else {
                    Alert.alert("Error", res.msg);
                }
            });
            setMessageText("");
            setVisionImageUrl("");
            setRecommendationsVisible(false);
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
                // Conditionally render messages with or without voice
                if (voiceEnabled) {
                    // Render messages with voice
                    speakTextApi(res.data[res.data.length - 1].content, [...res.data]);
                } else {
                    // Render messages without voice
                    setLoading(false);
                    setMessages([...res.data]);
                }
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

    const displayMessageGradually = async (content, audioDuration) => {
        const words = content.split(/\s+/); // Split by whitespace
        let displayedContent = "";

        for (let i = 0; i < words.length; i++) {
            displayedContent += (i > 0 ? " " : "") + words[i];
            setLatestMessage(displayedContent);

            // Adjust timing based on word length
            const wordDuration = (audioDuration / content.length) * words[i].length;
            await new Promise((resolve) => setTimeout(resolve, wordDuration));
        }
    };

    const parseMarkdown = (text) => {
        const regex = /(\*\*|__)(.*?)\1|(\*|_)(.*?)\3|(!?\[([^\]]+)\]\(([^\)]+)\))/g;
        let segments = [];
        let lastIndex = 0;

        text.replace(regex, (match, p1, p2, p3, p4, p5, altText, linkUrl, offset) => {
            if (lastIndex < offset) {
                segments.push({
                    text: text.substring(lastIndex, offset),
                    style: {},
                });
            }

            if (p2) {
                segments.push({
                    text: "\n\n" + p2,
                    style: { fontWeight: "bold" },
                });
            } else if (p4) {
                segments.push({
                    text: p4,
                    style: { fontStyle: "italic" },
                });
            } else if (linkUrl) {
                segments.push({
                    text: altText,
                    style: { color: "blue", textDecorationLine: "underline" },
                    type: "link",
                    url: linkUrl,
                });
            }

            lastIndex = offset + match.length;
        });

        if (lastIndex < text.length) {
            segments.push({
                text: text.substring(lastIndex),
                style: {},
            });
        }
        return segments;
    };

    const renderMessage = (message, index) => {
        if (message.role === "user") {
            if (message?.imageUrl) {
                return (
                    <View
                        key={index}
                        className="bg-orange-300 py-6 px-4 rounded-2xl mb-3 ml-10 self-end w-[250]"
                    >
                        <View className="items-center">
                            <Image
                                source={{ uri: message?.imageUrl }}
                                className="w-full h-40 rounded-2xl"
                                style={{ width: 200, height: 200, borderRadius: 20 }}
                            />
                        </View>
                        <Text className="text-base ml-2 mt-2">{message.content}</Text>
                    </View>
                );
            } else {
                return (
                    <View
                        key={index}
                        className="bg-orange-300 py-3 px-4 rounded-2xl mb-3 ml-10 self-end"
                    >
                        <Text className="text-base">{message.content}</Text>
                    </View>
                );
            }
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
                const displayedContent =
                    index === messages.length - 1 ? latestMessage : message.content;

                const segments = parseMarkdown(displayedContent);

                return (
                    <View
                        key={index}
                        className="bg-[#1b1b1b] py-4 px-6 rounded-3xl mb-3 mr-10 self-start"
                    >
                        <Text className="text-white text-base">
                            {segments.map((segment, i) => {
                                if (segment.type === "link") {
                                    return (
                                        <TouchableOpacity
                                            key={i}
                                            onPress={() => Linking.openURL(segment.url)}
                                        >
                                            <Text style={segment.style}>{segment.text}</Text>
                                        </TouchableOpacity>
                                    );
                                }
                                return (
                                    <Text key={i} style={segment.style}>
                                        {segment.text}
                                    </Text>
                                );
                            })}
                        </Text>
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
                            className="mr-3 p-4 rounded-xl"
                            style={{
                                backgroundColor: "rgba(0, 0, 0, 0.5)",
                                width: 150,
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
                    voiceEnabled={voiceEnabled}
                    toggleVoice={toggleVoice}
                    isExpoVoice={isExpoVoice}
                    setExpoVoice={setExpoVoice}
                />

                <ScrollView ref={ScrollViewRef} className="flex-1 px-5 py-3">
                    {messages.map((message, i) => (
                        <View key={i}>{renderMessage(message, i)}</View>
                    ))}

                    {loading && (
                        <View className="bg-[#1b1b1b] p-1 px-2 rounded-2xl mb-2 self-start">
                            <LottieView
                                source={require("../assets/animations/typingIndicator.json")}
                                autoPlay
                                loop
                                style={{ width: 50, height: 50 }}
                            />
                        </View>
                    )}
                </ScrollView>

                {renderRecommendations()}

                <MyChatInputBar
                    messageText={messageText}
                    setMessageText={setMessageText}
                    sendMessage={sendMessage}
                    visionImageUrl={visionImageUrl}
                    setVisionImageUrl={setVisionImageUrl}
                />
            </SafeAreaView>
        </ImageBackground>
    );
};

export default ChatScreen;
