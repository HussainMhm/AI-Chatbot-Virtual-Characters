import { View, Text, SafeAreaView, Platform, StatusBar } from "react-native";
import MyHeader from "../components/MyHeader";

const FeedScreen = () => {
    return (
        <SafeAreaView
            className={`flex-1 bg-white`}
            style={{ paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0 }}
        >
            <MyHeader title="Feed" icon={"newspaper"} />
        </SafeAreaView>
    );
};

export default FeedScreen;
