import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet, ScrollView, Alert } from "react-native";
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
            // case "Rate Chat":
            //     rateChat();
            //     break;
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
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <TouchableOpacity
                            style={styles.modalOption}
                            onPress={() => handleOptionPress("Archive & Re-Start Chat")}
                        >
                            <SimpleLineIcons
                                name="arrow-down-circle"
                                size={24}
                                color="white"
                                style={styles.icon}
                            />
                            <Text style={styles.modalOptionText}>Archive & Re-Start Chat</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.modalOption}
                            onPress={() => handleOptionPress("Delete & Re-Start Chat")}
                        >
                            <SimpleLineIcons
                                name="trash"
                                size={24}
                                color="white"
                                style={styles.icon}
                            />
                            <Text style={styles.modalOptionText}>Delete & Re-Start Chat</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.modalOption}
                            onPress={() => handleOptionPress("Add to Favorites")}
                        >
                            <MaterialCommunityIcons
                                name={favorites.includes(character.id) ? "heart" : "heart-outline"}
                                size={24}
                                color="white"
                                style={styles.icon}
                            />
                            <Text style={styles.modalOptionText}>Add to Favorites</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: "flex-end",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContainer: {
        backgroundColor: "#0F0F0F",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        rowGap: 8,
        paddingTop: 24,
        padding: 16,
    },
    modalOption: {
        flexDirection: "row",
        alignItems: "center",
        padding: 20,
        borderRadius: 20,
        backgroundColor: "#1B1B1B",
    },
    modalOptionText: {
        color: "#fff",
        fontSize: 18,
        marginLeft: 16,
    },
    icon: {
        width: 24,
        height: 24,
    },
});

export default MyChatTopBar;
