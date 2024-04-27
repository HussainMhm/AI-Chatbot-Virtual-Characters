import { View, Text, SafeAreaView, Platform, StatusBar } from "react-native";

const HomeScreen = ({ navigation }) => {
    return (
        <SafeAreaView
            className={`flex-1 justify-center items-center`}
            style={{ paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0 }}
        >
            <Text>Home Screen</Text>
        </SafeAreaView>
    );
};

export default HomeScreen;
