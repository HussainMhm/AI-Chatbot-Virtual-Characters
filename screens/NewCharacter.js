import { View, Text, SafeAreaView, Platform, StatusBar } from "react-native";

const NewCharacter = () => {
    return (
        <SafeAreaView
            className={`flex-1 items-center justify-center`}
            style={{ paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0 }}
        >
            <Text>New Character</Text>
        </SafeAreaView>
    );
};

export default NewCharacter;
