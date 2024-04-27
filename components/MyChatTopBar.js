import { View, Text, TouchableOpacity } from "react-native";
import { FontAwesome5, SimpleLineIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const MyChatTopBar = () => {
    const navigation = useNavigation();

    // Go back to the previous screen
    const goBack = () => {
        navigation.goBack();
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
                    Every Characters say is made up!
                </Text>
            </View>

            <TouchableOpacity>
                <SimpleLineIcons name="options" size={24} color="white" />
            </TouchableOpacity>
        </View>
    );
};

export default MyChatTopBar;
