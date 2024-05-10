import { View, Text, SafeAreaView, Platform, StatusBar, TouchableOpacity, ScrollView } from "react-native";

import MyHeader from "../components/MyHeader";
import React, { useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import MyChatListItem from "../components/MyChatListItem";
import { useFocusEffect } from "@react-navigation/native";

const CharacterListScreen = ({ navigation, route }) => {
    const [newCharacters, setNewCharacters] = useState([]);

    useEffect(() => {
        getNewCharacters();
    }, [])

    useFocusEffect(
        React.useCallback(() => {
            getNewCharacters();
            getChatsHistory();
        }, [])
    );

    const getNewCharacters = async () => {
        try {
            const value = await AsyncStorage.getItem('new-characters');
            setNewCharacters(value ? JSON.parse(value) : [])
        } catch (e) {
            console.log(`failed to get new characters ${e}`);
        }
    }

    const handleCreateCharacter = () => {
        navigation.navigate("CreateCharacter");
    };

    const getChatsHistory = async () => {
        try {
            const value = await AsyncStorage.getItem('chats-history');
            const history = JSON.parse(value);
            console.log(history);
            setChatsHistory(Array.isArray(history) ? history : []);
        } catch (e) {
            console.log(`Failed to get chat history:`, e);
        }
    }

    return (
        <SafeAreaView
            className={`flex-1 bg-chatbot-dark`}
            style={{ paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0 }}
        >
            <MyHeader title="Characters" icon={"person-add"} />
            {
                newCharacters.length > 0 ? (
                    <ScrollView
                        className="flex-1"
                        keyboardDismissMode="on-drag"
                        contentContainerStyle={{ flexGrow: 1 }}
                    >
                        {newCharacters.map((character, index) => (
                            <MyChatListItem
                                key={index}
                                character={character}
                            />
                        ))}
                    </ScrollView>
                ) : (
                    <View className="flex-1 items-center justify-center">
                        <Text className="text-white">You haven't created any character yet!</Text>
                    </View>
                )
            }

            <TouchableOpacity
                className="bg-white m-4 p-4 rounded-2xl items-center justify-center"
                onPress={handleCreateCharacter}
            >
                <Text className="text-base font-semibold">Create New Character</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default CharacterListScreen;
