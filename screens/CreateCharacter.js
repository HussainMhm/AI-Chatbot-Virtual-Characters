import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    Platform,
    StatusBar,
} from "react-native";
import { useState } from "react";
import MyHeader from "../components/MyHeader";

const CreateCharacter = ({ navigation }) => {
    const [characterName, setCharacterName] = useState("");
    const [characterDescription, setCharacterDescription] = useState("");

    const handleCreateCharacter = () => {
        // Add logic to save the character, e.g., sending it to a backend or storing locally
        console.log("Character created:", { characterName, characterDescription });

        // Navigate back to the NewCharacter screen
        navigation.goBack();
    };

    return (
        <SafeAreaView
            className={`flex-1 bg-white`}
            style={{ paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0 }}
        >
            <MyHeader title="Create New Character" />

            <View className="flex-1 p-4">
                <TextInput
                    className="bg-gray-200 p-3 rounded-md"
                    placeholder="Character Name"
                    value={characterName}
                    onChangeText={setCharacterName}
                />

                <TextInput
                    className="bg-gray-200 p-3 rounded-md mt-4"
                    placeholder="Character Description"
                    value={characterDescription}
                    onChangeText={setCharacterDescription}
                    multiline
                />

                <TouchableOpacity
                    className="bg-orange-500 p-4 m-4 items-center rounded-2xl"
                    onPress={handleCreateCharacter}
                >
                    <Text className="text-base font-bold text-white">Create Character</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default CreateCharacter;
