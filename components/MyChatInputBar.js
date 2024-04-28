import { TextInput, TouchableOpacity, Platform, KeyboardAvoidingView, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const MyChatInputBar = ({ messageText, setMessageText, sendMessage, recording, startRecording, stopRecording }) => {
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-row items-center px-5 mb-4"
        >
            <View
                style={{ backgroundColor: "rgba(0, 0, 0, 0.7)", color: "white", flexDirection: "row", alignItems: "center" }}
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
