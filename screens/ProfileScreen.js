import React, { useState } from "react";
import {
    View,
    Text,
    SafeAreaView,
    Platform,
    StatusBar,
    Image,
    TouchableOpacity,
} from "react-native";
import MyHeader from "../components/MyHeader";

const ProfileScreen = () => {
    const [activeTab, setActiveTab] = useState("savedChats");

    // Tabs data
    const tabs = [
        { label: "Saved Chats", value: "savedChats" },
        { label: "My Characters", value: "myCharacters" },
        { label: "Favorites", value: "favorites" },
    ];

    // Function to render content based on active tab
    const renderContent = () => {
        switch (activeTab) {
            case "savedChats":
                return (
                    <View className="flex-1 justify-center items-center">
                        <Text className="text-gray-400 text-lg">No archived chat yet!</Text>
                    </View>
                );
            case "myCharacters":
                return (
                    <View className="flex-1 justify-center items-center">
                        <Text className="text-gray-400 text-lg">No characters created yet!</Text>
                    </View>
                );
            case "favorites":
                return (
                    <View className="flex-1 justify-center items-center">
                        <Text className="text-gray-400 text-lg">No favorited characters yet!</Text>
                    </View>
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
            <MyHeader title="Profile" icon={"person"} />

            {/* Profile information */}
            <View className="p-4 flex-row items-center">
                <Image
                    source={{ uri: "https://randomuser.me/api/portraits/med/men/1.jpg" }}
                    className="w-24 h-24 rounded-full mr-6"
                />
                <View>
                    <Text className="text-white text-xl font-bold">John Doe</Text>
                    <Text className="text-gray-500">@johndoe</Text>
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
