import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    SafeAreaView,
    Platform,
    StatusBar,
    TextInput,
    ScrollView,
    TouchableOpacity,
} from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";

import MyHeader from "../components/MyHeader";
import MyChatListItem from "../components/MyChatListItem";

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from "@react-navigation/native";


const ChatListScreen = () => {
    const [chatsHistory, setChatsHistory] = useState([]);

    useEffect(() => {
        getChatsHistory();
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            getChatsHistory();
        }, [])
    );

    const getChatsHistory = async () => {
        try {
            const value = await AsyncStorage.getItem('chats-history');
            const history = JSON.parse(value);
            setChatsHistory(Array.isArray(history) ? history : []);
        } catch (e) {
            console.log(`Failed to get chat history:`, e);
        }
    }

    return (
        <SafeAreaView
            className="flex-1 bg-chatbot-dark"
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
                {
                    chatsHistory.length > 0 ? (
                        chatsHistory.map((chatHistory, index) => (
                            <MyChatListItem
                                key={index}
                                character={chatHistory?.chat}
                            />
                        ))
                    ) : (
                        <View className="flex-1 items-center justify-center">
                            <Text className="text-white">You haven't chatted with any character yet!</Text>
                        </View>
                    )
                }
            </ScrollView>

            <TouchableOpacity className="bg-white m-4 p-4 rounded-2xl items-center justify-center">
                <Text className="text-base font-semibold">Start New Chat</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default ChatListScreen;
