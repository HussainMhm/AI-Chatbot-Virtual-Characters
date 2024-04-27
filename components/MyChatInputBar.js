import { TextInput, TouchableOpacity, Platform, KeyboardAvoidingView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const MyChatInputBar = ({ messageText, setMessageText, sendMessage }) => {
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-row items-center px-5 mb-4"
        >
            <TextInput
                style={{ backgroundColor: "rgba(0, 0, 0, 0.7)", color: "white" }}
                className="flex-1 rounded-2xl py-4 px-4 my-2 mr-2"
                placeholder="Type a message..."
                placeholderTextColor="gray"
                onChangeText={(text) => setMessageText(text)}
                value={messageText}
                onSubmitEditing={sendMessage}
            />
            <TouchableOpacity className="ml-2" onPress={sendMessage}>
                <Ionicons name="send" size={30} color="white" />
            </TouchableOpacity>
        </KeyboardAvoidingView>
    );
};

export default MyChatInputBar;
