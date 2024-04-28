import React, { useEffect, useRef, useState } from "react";
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
    Alert,
    Image,
} from "react-native";

import MyChatTopBar from "../components/MyChatTopBar";
import MyChatInputBar from "../components/MyChatInputBar";

import Voice from "@react-native-community/voice";
import { apiCall } from "../api/openAi";

const ChatScreen = ({ navigation, route }) => {
    const { name, image } = route.params;

    const [messages, setMessages] = useState([]);
    const [messageText, setMessageText] = useState("");
    const [loading, setLoading] = useState(false);

    const [recording, setRecording] = useState(false);

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
            updateScroleView();
            setLoading(true);
            apiCall(messageText.trim(), newMessages).then((res) => {
                if (res?.success) {
                    setLoading(false);
                    setMessages([...res.data]);
                    updateScroleView();
                } else {
                    Alert.alert("Error", res.msg);
                }
            });
            // Clear the text input after sending the message
            setMessageText("");
        }
    };

    const updateScroleView = () => {
        setTimeout(() => {
            ScrollViewRef?.current?.scrollToEnd({ animated: true });
        });
    };

    const speechStartHandler = (e) => {
        console.log("speach start handler");
    };
    const speechEndHandler = (e) => {
        setRecording(false);
        console.log("speach end handler");
    };
    const speechResultsHandler = (e) => {
        setMessageText(e.value[0] ?? "");
        console.log(`voice event: ${e}`);
    };
    const speechErrorHandler = (e) => {
        console.log(`speach error handler: ${e}`);
    };

    const startRecording = async () => {
        setRecording(true);
        try {
            await Voice.start("en-US");
        } catch (error) {
            console.log(`error: ${error}`);
        }
    };

    const stopRecording = async () => {
        try {
            await Voice.stop();
            setRecording(false);
            // fetch api response
        } catch (error) {
            console.log(`error: ${error}`);
        }
    };

    useEffect(() => {
        // Voice Handler Events
        Voice.onSpeechStart = speechStartHandler;
        Voice.onSpeechEnd = speechEndHandler;
        Voice.onSpeechResults = speechResultsHandler;
        Voice.onSpeechError = speechErrorHandler;
        return () => {
            // Destroy the voice instance
            Voice.destroy().then(Voice.removeAllListeners);
        };
    }, []);

    // Function to render the message bubbles
    const renderMessage = (message, index) => {
        if (message.role === "user") {
            return (
                <View className="bg-orange-300 py-3 px-4 rounded-2xl mb-2 self-end">
                    <Text>{message.content}</Text>
                </View>
            );
        } else {
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

                <ScrollView ref={ScrollViewRef} className="flex-1 px-5 py-3">
                    {messages.map((message, i) => (
                        <View key={i}>{renderMessage(message)}</View>
                    ))}
                    {loading && (
                        <View className="bg-gray-800 py-3 px-4 rounded-2xl mb-2 self-start">
                            <Text className="text-white">loading</Text>
                        </View>
                    )}
                </ScrollView>

                <MyChatInputBar
                    messageText={messageText}
                    setMessageText={setMessageText}
                    sendMessage={sendMessage}
                    recording={recording}
                    startRecording={startRecording}
                    stopRecording={stopRecording}
                />
            </SafeAreaView>
        </ImageBackground>
    );
};

export default ChatScreen;
