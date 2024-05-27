import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    SafeAreaView,
    Platform,
    StatusBar,
    Image,
    TouchableOpacity,
    ScrollView,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MyProfileHeader from "../components/MyProfileHeader";
import MyChatListItem from "../components/MyChatListItem";
import MyCharacterListItem from "../components/profile/MyCharacterListItem";
import FavoriteCharacterListItem from "../components/profile/FavoriteCharacterListItem";
import { doc, getDoc, getDocs, query, collection, where } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { FIREBASE_DB, FIREBASE_AUTH } from "../firebaseConfig";
import charactersData from "../data/characters.json";

const ProfileScreen = () => {
    const [activeTab, setActiveTab] = useState("savedChats");
    const [favoriteCharacters, setFavoriteCharacters] = useState([]);
    const [chatsHistory, setChatsHistory] = useState([]);
    const [newCharacters, setNewCharacters] = useState([]);
    const [favoriteIds, setFavoritesIds] = useState([]);
    const [localCharacters] = useState(charactersData?.characters);

    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (currentUser) => {
            if (currentUser){
                loadChatsHistory();
                loadFavorites();
                loadNewCharacters();
            }else {
                loadFavoritesFromLocal();
                loadChatsHistoryFromLocal();
            }
            setUser(currentUser);
        });

        return () => unsubscribe();
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            if (user) {
                loadChatsHistory();
                loadFavorites();
                loadNewCharacters();
            }else {
                loadFavoritesFromLocal();
                loadChatsHistoryFromLocal();
            }
            
        }, [user])
    );

    const tabs = [
        { label: "Saved Chats", value: "savedChats" },
        { label: "My Characters", value: "myCharacters" },
        { label: "Favorites", value: "favorites" },
    ];

    useEffect(()=>{
        let favCharacters = [];
        favCharacters = localCharacters.filter((character) => favoriteIds.includes(character?.id))
        let favNewCharacters = newCharacters.filter((character) => favoriteIds.includes(character?.id))
        favCharacters = favCharacters.concat(favNewCharacters);
        setFavoriteCharacters(favCharacters)
    }, [favoriteIds, setFavoritesIds, newCharacters])

    const loadFavorites = async () => {
        try {
            const docRef = doc(FIREBASE_DB, "user_favorites", user.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                setFavoritesIds(data.favorites || []);
            }
        } catch (error) {
            console.error("Error loading favorites:", error);
        }
    };

    const loadFavoritesFromLocal = async () => {
        try {   
            const value = await AsyncStorage.getItem('user_favorites');
            let favoriteIds = value ? JSON.parse(value) : [];
            setFavoritesIds(favoriteIds);
        } catch (error) {
            console.error("Error loading favorites:", error);
        }
    };

    const loadChatsHistory = async () => {
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

    const loadChatsHistoryFromLocal = async () => {
        try {
            const value = await AsyncStorage.getItem('user_chat_history');
            const history = JSON.parse(value);
            setChatsHistory(Array.isArray(history) ? history : []);
        } catch (e) {
            console.log(`Failed to get chat history from local storage:`, e);
        }
    }

    const loadNewCharacters = async () => {
        try {
            const q = query(collection(FIREBASE_DB, "characters"), where("userId", "==", user.uid));
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

    const handleToggleFavorite = (characterId) => {
        let updatedFavorites = favoriteCharacters.filter((character) => character?.id !== characterId);
        setFavoriteCharacters(updatedFavorites);
        if (user) {
            loadFavorites();
        }else{
            loadFavoritesFromLocal();
        }
    };

    const renderContent = () => {
        switch (activeTab) {
            case "savedChats":
                return (
                    <ScrollView
                        className="flex-1 mt-4"
                        keyboardDismissMode="on-drag"
                        contentContainerStyle={{ flexGrow: 1 }}
                    >
                        {chatsHistory.length > 0 ? (
                            chatsHistory.map((chatHistory, index) => (
                                <MyChatListItem key={index} character={chatHistory} />
                            ))
                        ) : (
                            <View className="flex-1 items-center justify-center">
                                <Text className="text-gray-400 text-lg">No archived chat yet!</Text>
                            </View>
                        )}
                    </ScrollView>
                );
            case "myCharacters":
                return (
                    <ScrollView
                        className="flex-1 mt-4"
                        keyboardDismissMode="on-drag"
                        contentContainerStyle={{ flexGrow: 1 }}
                    >
                        {newCharacters.length > 0 ? (
                            newCharacters.map((character, index) => (
                                <MyCharacterListItem key={index} character={character} />
                            ))
                        ) : (
                            <View className="flex-1 items-center justify-center">
                                <Text className="text-gray-400 text-lg">
                                    No characters created yet!
                                </Text>
                            </View>
                        )}
                    </ScrollView>
                );
            case "favorites":
                return (
                    <ScrollView
                        className="flex-1 mt-4"
                        keyboardDismissMode="on-drag"
                        contentContainerStyle={{ flexGrow: 1 }}
                    >
                        {favoriteCharacters.length > 0 ? (
                            favoriteCharacters.map((character, index) => (
                                <FavoriteCharacterListItem
                                    key={index}
                                    user={user}
                                    character={character}
                                    favorites={favoriteIds}
                                    onToggleFavorite={handleToggleFavorite}
                                />
                            ))
                        ) : (
                            <View className="flex-1 items-center justify-center">
                                <Text className="text-gray-400 text-lg">
                                    No favorited characters yet!
                                </Text>
                            </View>
                        )}
                    </ScrollView>
                );
            default:
                return null;
        }
    };

    return (
        <SafeAreaView
            style={{
                flex: 1,
                paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
            }}
            className="bg-chatbot-dark"
        >
            <MyProfileHeader user={user} title="Profile" icon={"person"} />

            {/* Profile information */}
            <View className="p-4 flex-row items-center">
                <Image
                    source={{ uri: "https://randomuser.me/api/portraits/med/men/1.jpg" }}
                    className="w-24 h-24 rounded-full mr-6"
                />
                <View>
                    <Text className="text-white text-xl font-bold">{(user && user?.name) ? user?.name : 'Guest User'}</Text>
                    <Text className="text-gray-500">{(user && user?.email) ? user?.email : '@guest'}</Text>
                </View>
            </View>

            {/* Tabs */}
            <View style={{ flexDirection: "row", justifyContent: "space-around", marginTop: 16 }}>
                {tabs.map((tab) => (
                    <TouchableOpacity key={tab.value} onPress={() => setActiveTab(tab.value)}>
                        <Text
                            style={{
                                color: activeTab === tab.value ? "white" : "gray",
                            }}
                            className="text-base"
                        >
                            {tab.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {renderContent()}
        </SafeAreaView>
    );
};

export default ProfileScreen;
