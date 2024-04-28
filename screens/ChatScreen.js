import React, { useRef, useState } from "react";
import {
    View,
    Text,
    SafeAreaView,
    Platform,
    StatusBar,
    ImageBackground,
    ScrollView,
    Alert,
    Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import MyChatTopBar from "../components/MyChatTopBar";
import MyChatInputBar from "../components/MyChatInputBar";

import { apiCall } from "../api/openAi";
import { getImage } from "../helpers/index";

const ChatScreen = ({ navigation, route }) => {
    const { character } = route.params;
    console.log(character);

    // State to store the messages
    const [messages, setMessages] = useState([
        { role: "system", content: character.system_content },
        { role: "assistant", content: character.assistant_content },
    ]);
    const [messageText, setMessageText] = useState("");
    const [loading, setLoading] = useState(false);

    const ScrollViewRef = useRef();

    // Function to send a message
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
            // Clear the text input after sending the message
            setMessageText("");
        }
    };

    // Function to scroll to the end of the chat
    const updateScrollView = () => {
        setTimeout(() => {
            ScrollViewRef?.current?.scrollToEnd({ animated: true });
        });
    };

    // Function to render the message bubbles
    const renderMessage = (message, index) => {
        if (message.role === "user") {
            return (
                <View className="bg-orange-300 py-3 px-4 rounded-2xl mb-2 self-end">
                    <Text>{message.content}</Text>
                </View>
            );
        } else if (message.role === "assistant") {
            if (message.content.startsWith("https://")) {
                return (
                    <View className="bg-gray-800 py-3 px-4 rounded-2xl mb-2 self-start">
                        <Image
                            source={{ uri: message.content }}
                            className="w-full h-40 rounded-2xl"
                            style={{ width: 200, height: 200, borderRadius: 20 }}
                        />
                    </View>
                );
            } else {
                return (
                    <View className="bg-gray-800 py-3 px-4 rounded-2xl mb-2 self-start">
                        <Text className="text-white">{message.content}</Text>
                    </View>
                );
            }
        }
    };

    return (
        <ImageBackground source={getImage(character.id)} className="flex-1" resizeMode="cover">
            <SafeAreaView
                style={{
                    flex: 1,
                    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
                }}
            >
                <MyChatTopBar />

                <ScrollView ref={ScrollViewRef} className="flex-1 px-5 py-3">
                    {messages.map((message, i) => (
                        <View key={i}>{renderMessage(message)}</View>
                    ))}

                    {loading && (
                        <View className="bg-gray-800 py-3 px-4 rounded-2xl mb-2 self-start">
                            <Ionicons name="ellipsis-horizontal" size={24} color="white" />
                        </View>
                    )}
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
