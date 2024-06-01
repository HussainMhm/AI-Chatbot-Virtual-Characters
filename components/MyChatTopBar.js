import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    StyleSheet,
    ScrollView,
    Alert,
    TouchableWithoutFeedback,
    Switch,
} from "react-native";
import { FontAwesome5, SimpleLineIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const MyChatTopBar = ({
    messages,
    favorites,
    character,
    saveChatMessages,
    deleteChatHistory,
    restartChat,
    toggleFavorite,
    voiceEnabled,
    toggleVoice,
    isExpoVoice,
    setExpoVoice
}) => {
    const navigation = useNavigation();
    const [modalVisible, setModalVisible] = useState(false);

    const goBack = () => {
        const userMessagesExist = messages.some((message) => message.role === "user");
        if (userMessagesExist) {
            Alert.alert(
                "Save Chat",
                "Do you want to save the chat history?",
                [
                    {
                        text: "No",
                        style: "cancel",
                        onPress: () => navigation.goBack(),
                    },
                    {
                        text: "Save",
                        onPress: () => {
                            saveChatMessages();
                            navigation.goBack();
                        },
                    },
                ],
                { cancelable: false }
            );
        } else {
            navigation.goBack();
        }
    };

    const handleOptionPress = async (option) => {
        switch (option) {
            case "Archive & Re-Start Chat":
                await archiveChat();
                break;
            case "Delete & Re-Start Chat":
                await deleteChat();
                break;
            case "Add to Favorites":
                toggleFavorite();
                break;
            default:
                break;
        }
        setModalVisible(false);
    };

    const archiveChat = async () => {
        try {
            await saveChatMessages();
            restartChat();
            Alert.alert("Chat Archived", "Your chat has been archived.");
        } catch (error) {
            console.error("Error archiving chat:", error);
        }
    };

    const deleteChat = async () => {
        try {
            deleteChatHistory();
            Alert.alert("Chat Deleted", "Your chat has been deleted.");
        } catch (error) {
            console.error("Error deleting chat history:", error);
        }
    };

    return (
        <View className="flex-row items-center p-4">
            <TouchableOpacity onPress={goBack}>
                <FontAwesome5 name="chevron-left" size={24} color="white" />
            </TouchableOpacity>

            <View
                className="flex-1 p-2 mx-4 rounded-2xl"
                style={{ backgroundColor: "rgba(0, 0, 0, 0.25)" }}
            >
                <Text className="text-center text-base text-white">
                    Every Character's say is made up!
                </Text>
            </View>

            <TouchableOpacity onPress={() => setModalVisible(true)}>
                <SimpleLineIcons name="options" size={24} color="white" />
            </TouchableOpacity>

            <Modal
                transparent={true}
                animationType="slide"
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                    <View
                        className="flex-1 justify-end"
                        style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
                    >
                        <View className="bg-[#0F0F0F] rounded-t-3xl p-4 py-10 space-y-4">
                            <TouchableOpacity
                                className="flex-row items-center p-5 rounded-3xl bg-[#1B1B1B]"
                                onPress={() => toggleVoice()}
                            >
                                <Switch
                                    className="ml-2"
                                    trackColor={{ false: "#B0B4BA", true: "#0CBF08" }}
                                    thumbColor={"#FFFFFF"}
                                    ios_backgroundColor="#3e3e3e"
                                    onValueChange={toggleVoice}
                                    value={voiceEnabled}
                                    style={styles.icon}
                                />
                                <Text className="text-white ml-2 text-lg">Voice Speach</Text>
                            </TouchableOpacity>
                            {voiceEnabled && (
                                <TouchableOpacity
                                    className="flex-row items-center p-5 rounded-3xl bg-[#1B1B1B]"
                                    onPress={() => setExpoVoice(!isExpoVoice)}
                                >
                                    <Switch
                                        className="ml-2"
                                        trackColor={{ false: "#B0B4BA", true: "#0CBF08" }}
                                        thumbColor={"#FFFFFF"}
                                        ios_backgroundColor="#3e3e3e"
                                        onValueChange={setExpoVoice}
                                        value={isExpoVoice}
                                        style={styles.icon}
                                    />
                                    <Text className="text-white ml-2 text-lg">Faster Response</Text>
                                </TouchableOpacity>
                            )}
                            <TouchableOpacity
                                className="flex-row items-center p-5 rounded-3xl bg-[#1B1B1B]"
                                onPress={() => handleOptionPress("Archive & Re-Start Chat")}
                            >
                                <SimpleLineIcons
                                    name="arrow-down-circle"
                                    size={24}
                                    color="white"
                                    style={styles.icon}
                                />
                                <Text className="text-white ml-4 text-lg">
                                    Archive & Re-Start Chat
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                className="flex-row items-center p-5 rounded-3xl bg-[#1B1B1B]"
                                onPress={() => handleOptionPress("Delete & Re-Start Chat")}
                            >
                                <SimpleLineIcons
                                    name="trash"
                                    size={24}
                                    color="white"
                                    style={styles.icon}
                                />
                                <Text className="text-white ml-4 text-lg">
                                    Delete & Re-Start Chat
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                className="flex-row items-center p-5 rounded-3xl bg-[#1B1B1B]"
                                onPress={() => handleOptionPress("Add to Favorites")}
                            >
                                <MaterialCommunityIcons
                                    name={
                                        favorites.includes(character.id) ? "heart" : "heart-outline"
                                    }
                                    size={24}
                                    color="white"
                                    style={styles.icon}
                                />
                                <Text className="text-white ml-4 text-lg">Add to Favorites</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    icon: {
        width: 24,
        height: 24,
    },
});

export default MyChatTopBar;
