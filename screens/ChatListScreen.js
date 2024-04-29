import React from "react";
import {
    View,
    Text,
    SafeAreaView,
    Platform,
    StatusBar,
    TextInput,
    ScrollView,
    Touchable,
    TouchableOpacity,
} from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";

import MyHeader from "../components/MyHeader";
import MyChatListItem from "../components/MyChatListItem";

const ChatListScreen = () => {
    return (
        <SafeAreaView
            className={`flex-1 bg-chatbot-dark`}
            style={{ paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0 }}
        >
            <MyHeader title="Chats" icon={"chatbubbles"} />

            <View className="flex-row m-4 p-4 rounded-3xl bg-[#1b1b1b] items-center">
                <FontAwesome name="search" size={24} color="white" style={{ paddingRight: 16 }} />
                <TextInput
                    placeholder="Search"
                    placeholderTextColor="gray"
                    className={`flex-1 text-lg ${Platform.OS === "ios" ? "-mt-1" : ""}`}
                />
            </View>

            <ScrollView
                className="flex-1"
                keyboardDismissMode="on-drag"
                contentContainerStyle={{ flexGrow: 1 }}
            >
                <MyChatListItem
                    name="Elon Musk"
                    message={"Invest wisely, work hard, and innovate. Success..."}
                />
                <MyChatListItem
                    name="Steve Jobs"
                    message={"Invest wisely, work hard, and innovate. Success..."}
                />
                <MyChatListItem
                    name="Donald Trump"
                    message={"Invest wisely, work hard, and innovate. Success..."}
                />
            </ScrollView>

            <TouchableOpacity className="bg-white m-4 p-4 rounded-2xl items-center justify-center">
                <Text className="text-base font-semibold">Start New Chat</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default ChatListScreen;
