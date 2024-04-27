import React, { useState } from "react";
import {
    View,
    Text,
    SafeAreaView,
    Platform,
    StatusBar,
    ImageBackground,
    ScrollView,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
} from "react-native";

import MyChatTopBar from "../components/MyChatTopBar";
import MyChatInputBar from "../components/MyChatInputBar";

const ChatScreen = ({ navigation, route }) => {
    const { name, image } = route.params;

    const [messages, setMessages] = useState([
        { id: 1, sender: "me", message: "Hello!" },
        { id: 2, sender: "other", message: "Hi there!" },
        { id: 3, sender: "me", message: "How are you?" },
        { id: 4, sender: "other", message: "I'm good, thanks!" },
        { id: 5, sender: "me", message: "What are you up to?" },
    ]);

    const [messageText, setMessageText] = useState("");

    // Function to render the message bubbles
    const renderMessage = (message) => {
        if (message.sender === "me") {
            return (
                <View className="bg-orange-300 py-3 px-4 rounded-2xl mb-2 self-end">
                    <Text>{message.message}</Text>
                </View>
            );
        } else {
            return (
                <View className="bg-gray-800 py-3 px-4 rounded-2xl mb-2 self-start">
                    <Text className="text-white">{message.message}</Text>
                </View>
            );
        }
    };

    // Function to send a message
    const sendMessage = () => {
        if (messageText.trim()) {
            const newMessage = {
                id: messages.length + 1,
                sender: "me",
                message: messageText.trim(),
            };
            setMessages([...messages, newMessage]);
            setMessageText(""); // Clear the text input after sending the message
        }
    };

    return (
        <ImageBackground
            source={{
                uri: "https://www.teahub.io/photos/full/322-3227128_sky-wallpaper-phone.jpg",
            }}
            className="flex-1"
            resizeMode="cover"
        >
            <SafeAreaView
                style={{
                    flex: 1,
                    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
                }}
            >
                <MyChatTopBar />

                <ScrollView className="flex-1 px-5 py-3">
                    {messages.map((message) => (
                        <View key={message.id}>{renderMessage(message)}</View>
                    ))}
                </ScrollView>

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
