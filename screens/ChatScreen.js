import { View, Text, SafeAreaView, Platform, StatusBar } from "react-native";

const ChatScreen = () => {
    return (
        <SafeAreaView
            className={`flex-1 items-center justify-center`}
            style={{ paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0 }}
        >
            <Text>Chat Screen</Text>
        </SafeAreaView>
    );
};

export default ChatScreen;
