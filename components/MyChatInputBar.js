import React, { useState, useEffect } from "react";
import { TextInput, TouchableOpacity, Platform, KeyboardAvoidingView, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";

const GOOGLE_CLOUD_FUNCTION_URL = "YOUR_GOOGLE_CLOUD_FUNCTION_URL_HERE";

const MyChatInputBar = ({ messageText, setMessageText, sendMessage }) => {
    const [recording, setRecording] = useState();
    const [permissionResponse, requestPermission] = Audio.usePermissions();

    useEffect(() => {
        askForMicrophonePermission();
    }, []);

    async function askForMicrophonePermission() {
        const { status } = await requestPermission();
        if (status !== "granted") {
            console.log("Microphone permission not granted");
        }
    }

    async function startRecording() {
        const recordingOptions = {
            android: {
                extension: ".m4a",
                outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
                audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
                sampleRate: 44100,
                numberOfChannels: 2,
                bitRate: 128000,
            },
            ios: {
                extension: ".wav",
                audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
                sampleRate: 44100,
                numberOfChannels: 1,
                bitRate: 128000,
                linearPCMBitDepth: 16,
                linearPCMIsBigEndian: false,
                linearPCMIsFloat: false,
            },
        };

        const recording = new Audio.Recording();
        try {
            await recording.prepareToRecordAsync(recordingOptions);
            await recording.startAsync();
            console.log("Recording started");
            setRecording(recording);
        } catch (error) {
            console.error("Failed to start recording", error);
        }
    }

    async function stopRecording() {
        console.log("Stopping recording..");
        setRecording(undefined);
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        console.log("Recording stopped and stored at", uri);

        sendAudioToGoogleCloud(uri);
    }

    async function sendAudioToGoogleCloud(uri) {
        const formData = new FormData();
        formData.append("file", {
            uri,
            type: "audio/x-wav",
            name: "speech2text",
        });
        try {
            const response = await fetch(GOOGLE_CLOUD_FUNCTION_URL, {
                method: "POST",
                body: formData,
            });
            const data = await response.json();
            console.log("Transcribed text:", data.transcript);
            // Use the transcribed text in your application
            setMessageText(data.transcript);
        } catch (error) {
            console.error("Error sending audio to Google Cloud:", error);
        }
    }

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
