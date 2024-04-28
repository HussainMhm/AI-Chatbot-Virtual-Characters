import { View, Text, SafeAreaView, Platform, StatusBar, TouchableOpacity } from "react-native";
import MyHeader from "../components/MyHeader";

const NewCharacter = () => {
    return (
        <SafeAreaView
            className={`flex-1 bg-white`}
            style={{ paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0 }}
        >
            <MyHeader title="Characters" icon={"person-add"} />

            <View className="flex-1 items-center justify-center">
                <Text>You haven't created any character yet!</Text>
            </View>

            <TouchableOpacity
                className="bg-orange-500 p-4 m-4 items-center rounded-2xl"
                onPress={() => {}}
            >
                <Text className="text-base font-bold">Create New Character</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default NewCharacter;
