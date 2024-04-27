import React from "react";
import { View, Text, SafeAreaView, Platform, StatusBar, TextInput, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import MyHeader from "../components/MyHeader";
import MyChatListItem from "../components/MyChatListItem";

const ChatListScreen = () => {
    return (
        <SafeAreaView
            className={`flex-1 bg-white`}
            style={{ paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0 }}
        >
            <MyHeader title="Chats" icon={"chatbubbles"} />

            <View className="flex-row m-4 p-4 rounded-3xl bg-slate-200">
                <Ionicons name="search" size={24} color="black" style={{ paddingRight: 10 }} />
                <TextInput placeholder="Search" className="flex-1" />
            </View>

            <ScrollView
                className="flex-1"
                keyboardDismissMode="on-drag"
                contentContainerStyle={{ flexGrow: 1 }}
            >
                <MyChatListItem />
                <MyChatListItem />
                <MyChatListItem />
            </ScrollView>
        </SafeAreaView>
    );
};

export default ChatListScreen;
