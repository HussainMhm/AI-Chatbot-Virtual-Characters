import React, { useState, useEffect } from "react";
import {
    TextInput,
    TouchableOpacity,
    Platform,
    KeyboardAvoidingView,
    View,
    Alert,
    StyleSheet,
    Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import Voice from "@react-native-voice/voice";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const MyChatInputBar = ({
    messageText,
    setMessageText,
    sendMessage,
    visionImageUrl,
    setVisionImageUrl
}) => {
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

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            uploadImageAsync(result.assets[0].uri);
        } else {
            clearImage();
        }
    };

    const uploadImageAsync = async (uri) => {
        try {
            const blob = await fetch(uri).then((res) => res.blob());
            const storage = getStorage(); // Initialize Firebase storage
            const storageRef = ref(storage, `images/${Date.now()}`);
            await uploadBytes(storageRef, blob);
            const url = await getDownloadURL(storageRef);
            setVisionImageUrl(url);
        } catch (error) {
            console.error("Error uploading image: ", error);
            Alert.alert("Error", "Failed to upload image. Please try again.");
            clearImage();
        }
    };

    const clearImage = () => {
        setVisionImageUrl('');
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-row items-center px-5 mb-4"
        >
            {visionImageUrl && (
                <View style={styles.imagePreviewContainer}>
                    <Image source={{ uri: visionImageUrl }} style={styles.imagePreview} />
                    <TouchableOpacity style={styles.clearButton} onPress={clearImage}>
                        <Ionicons name="close-circle" size={24} color="white" />
                    </TouchableOpacity>
                </View>
            )}
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
                <TouchableOpacity style={{ marginLeft: 2 }} onPress={pickImage}>
                    <MaterialCommunityIcons name="image-search" size={30} color="white" />
                </TouchableOpacity>
            </View>

            <TouchableOpacity className="ml-2" onPress={sendMessage}>
                <Ionicons name="send" size={30} color="white" />
            </TouchableOpacity>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    imagePreviewContainer: {
        position: "relative",
        marginBottom: 10,
    },
    imagePreview: {
        width: 100,
        height: 100,
        borderRadius: 10,
    },
    clearButton: {
        position: "absolute",
        top: -10,
        right: -10,
    }
});

export default MyChatInputBar;
