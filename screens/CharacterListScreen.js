import { View, Text, SafeAreaView, Platform, StatusBar, TouchableOpacity, ScrollView } from "react-native";

import MyHeader from "../components/MyHeader";
import React, { useEffect, useState } from "react";
import MyChatListItem from "../components/MyChatListItem";
import { onAuthStateChanged } from "firebase/auth";
import { FIREBASE_DB, FIREBASE_AUTH } from "../firebaseConfig";
import { useFocusEffect } from "@react-navigation/native";
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";

const CharacterListScreen = ({ navigation, route }) => {
    const [newCharacters, setNewCharacters] = useState([]);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                loadNewCharacters(currentUser);
            }
        });

        return () => unsubscribe();
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            if (user) {
                loadNewCharacters(user);
            }
        }, [user])
    );

    const loadNewCharacters = async (currentUser) => {
        try {
            const q = query(collection(FIREBASE_DB, "characters"), where("userId", "==", currentUser.uid));
            const querySnapshot = await getDocs(q);
            const characters = querySnapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id // Ensure each character has an id property
            }));
            setNewCharacters(characters);
        } catch (e) {
            console.log(`Failed to fetch new characters: ${e}`);
        }
    };

    const handleDeleteCharacter = async (characterId) => {
        try {
            await deleteDoc(doc(FIREBASE_DB, "characters", characterId));
            console.log(characterId);
            setNewCharacters(newCharacters.filter(character => character.id !== characterId));
        } catch (e) {
            console.log(`Failed to delete character: ${e}`);
        }
    };

    const handleCreateCharacter = () => {
        navigation.navigate("CreateCharacter");
    };

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
                                onDelete={() => handleDeleteCharacter(character.id)}
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
