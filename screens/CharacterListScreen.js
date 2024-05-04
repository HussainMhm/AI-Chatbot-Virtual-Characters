import { View, Text, SafeAreaView, Platform, StatusBar, TouchableOpacity } from "react-native";

import MyHeader from "../components/MyHeader";

const CharacterListScreen = ({ navigation }) => {
    const handleCreateCharacter = () => {
        navigation.navigate("CreateCharacter");
    };

    return (
        <SafeAreaView
            className={`flex-1 bg-chatbot-dark`}
            style={{ paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0 }}
        >
            <MyHeader title="Characters" icon={"person-add"} />

            <View className="flex-1 items-center justify-center">
                <Text className="text-white">You haven't created any character yet!</Text>
            </View>

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
