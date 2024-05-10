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

import MyChatTopBar from "../components/MyChatTopBar";
import MyChatInputBar from "../components/MyChatInputBar";

import { apiCall } from "../api/openAi";
import { getImage } from "../helpers/index";
import AsyncStorage from '@react-native-async-storage/async-storage';

const ChatScreen = ({ navigation, route }) => {
    const { character } = route.params;

    const [messages, setMessages] = useState([
        { role: "system", content: character.system_content },
        { role: "assistant", content: character.assistant_content },
    ]);
    const [messageText, setMessageText] = useState("");
    const [loading, setLoading] = useState(false);
    const [recommendationsVisible, setRecommendationsVisible] = useState(true);
    const [saveChat, setSaveChat] = useState(false);
    const ScrollViewRef = useRef();

    useEffect(()=>{
        if (character?.messages){
            setMessages(character?.messages)
        }
    }, [])

    useEffect(() => {
        const saveChatMessages = async () => {
            try {
                const value = await AsyncStorage.getItem('chats-history');
                let chatsHistory = value ? JSON.parse(value) : [];
                
                // Find index of the existing character chat, if it exists
                const index = chatsHistory.findIndex(chat => chat?.chat?.id === character.id);


                if (index !== -1) {
                    // Replace existing chat messages for this character
                    chatsHistory[index].chat.messages = messages;
                } else {
                    // Push new chat entry if character not found
                    chatsHistory.push({
                        chat: {
                            ...character,
                            messages: messages
                        },
                    });
                }
                await AsyncStorage.setItem('chats-history', JSON.stringify(chatsHistory));
            } catch (error) {
                console.error('Error saving chats history:', error);
            }
        };

        return () => {
            saveChatMessages();
        };
    }, [messages]);

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
            } else {
                return (
                    <View
                        key={index}
                        className="bg-[#1b1b1b] py-4 px-6 rounded-3xl mb-3 mr-10 self-start"
                    >
                        <Text className="text-white text-base">{message.content}</Text>
                    </View>
                );
            }
        }
    };

    const renderRecommendations = () => {
        if (!recommendationsVisible) {
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
            source={character.id === -1 ? { uri: character?.image_path } : getImage(character.id)}
            className="flex-1" resizeMode="cover">
            <SafeAreaView
                style={{
                    flex: 1,
                    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
                }}
            >
                <MyChatTopBar />

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
