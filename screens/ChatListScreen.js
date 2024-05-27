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

import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { FIREBASE_DB, FIREBASE_AUTH } from "../firebaseConfig";

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from "@react-navigation/native";


const ChatListScreen = () => {
    const [chatsHistory, setChatsHistory] = useState([]);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (currentUser) => {
            if (currentUser) {
                getChatsHistory();
            }else {
                getChatsHistoryFromLocal();
            }
            setUser(currentUser);
        });

        return () => unsubscribe();
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            getChatsHistory();
        }, [user])
    );

    const getChatsHistory = async () => {
        try {
            const docRef = doc(FIREBASE_DB, "user_chat_history", user.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                const history = Object.values(data);
                setChatsHistory(Array.isArray(history) ? history : []);
            } else {
                setChatsHistory([]);
            }
        } catch (e) {
            console.log(`Failed to get chat history:`, e);
        }
    }

    const getChatsHistoryFromLocal = async () => {
        try {
            const value = await AsyncStorage.getItem('user_chat_history');
            const history = JSON.parse(value);
            setChatsHistory(Array.isArray(history) ? history : []);
        } catch (e) {
            console.log(`Failed to get chat history from local storage:`, e);
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
                                character={chatHistory}
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
