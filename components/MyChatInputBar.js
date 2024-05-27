import React, { useState, useEffect } from "react";
import {
    TextInput,
    TouchableOpacity,
    Platform,
    KeyboardAvoidingView,
    View,
    Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Voice from "@react-native-voice/voice";

const MyChatInputBar = ({ messageText, setMessageText, sendMessage }) => {
    const [recording, setRecording] = useState(false);

    useEffect(() => {
        Voice.onSpeechStart = onSpeechStart;
        Voice.onSpeechEnd = onSpeechEnd;
        Voice.onSpeechResults = onSpeechResults;
        Voice.onSpeechPartialResults = onSpeechPartialResults; // Handle partial results
        Voice.onSpeechError = onSpeechError;

        return () => {
            Voice.destroy().then(Voice.removeAllListeners);
        };
    }, []);

    const onSpeechStart = (e) => {
        console.log("onSpeechStart: ", e);
        setRecording(true);
    };

    const onSpeechEnd = (e) => {
        console.log("onSpeechEnd: ", e);
        setRecording(false);
    };

    const onSpeechResults = (e) => {
        console.log("onSpeechResults: ", e);
        const speechText = e.value[0];
        setMessageText(speechText);
    };

    const onSpeechPartialResults = (e) => {
        console.log("onSpeechPartialResults: ", e);
        const speechText = e.value[0];
        setMessageText(speechText); // Update the text input with partial results
    };

    const onSpeechError = (e) => {
        console.log("onSpeechError: ", e);
        setRecording(false);
        Alert.alert("Error", "An error occurred during speech recognition.");
    };

    const startRecording = async () => {
        try {
            await Voice.start("en-US");
        } catch (e) {
            console.error(e);
        }
    };

    const stopRecording = async () => {
        try {
            await Voice.stop();
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-row items-center px-5 mb-4"
        >
            <View
                style={{
                    backgroundColor: "rgba(0, 0, 0, 0.7)",
                    color: "white",
                    flexDirection: "row",
                    alignItems: "center",
                }}
                className="flex-1 rounded-2xl py-4 px-4 my-2 mr-2"
            >
                <TextInput
                    style={{ color: "white", flex: 1 }}
                    placeholder="Type a message..."
                    placeholderTextColor="gray"
                    onChangeText={(text) => setMessageText(text)}
                    value={messageText}
                    onSubmitEditing={sendMessage}
                />
                {recording ? (
                    <TouchableOpacity style={{ marginLeft: 8 }} onPress={stopRecording}>
                        <Ionicons name="mic-off" size={30} color="white" />
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity style={{ marginLeft: 8 }} onPress={startRecording}>
                        <Ionicons name="mic" size={30} color="white" />
                    </TouchableOpacity>
                )}
            </View>

            <TouchableOpacity className="ml-2" onPress={sendMessage}>
                <Ionicons name="send" size={30} color="white" />
            </TouchableOpacity>
        </KeyboardAvoidingView>
    );
};

export default MyChatInputBar;
