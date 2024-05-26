import { View, Text, Image, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { getImage } from "../helpers";

const MyListImage = ({ character, imageWidth, imageHeight, isFavorite, onHeartPress }) => {
    const navigation = useNavigation();

    const handleCharacterPress = () => {
        // Navigate to ChatScreen when character is pressed
        navigation.navigate("Chat", { character });
    };

    return (
        <TouchableOpacity className="mr-4" activeOpacity={0.8} onPress={handleCharacterPress}>
            {/* Image */}
            <View>
                <Image
                    source={getImage(character.id)}
                    style={{ width: imageWidth, height: imageHeight }}
                    className={`rounded-3xl`}
                />

                {/* Dark overlay */}
                <View className="absolute top-0 left-0 bottom-0 right-0 rounded-xl bg-black opacity-20" />

                {/* Heart icon */}
                <TouchableOpacity
                    className="absolute top-2 right-2"
                    onPress={() => {
                        onHeartPress(character?.id);
                    }}
                >
                    <MaterialCommunityIcons
                        name={isFavorite ? "heart" : "heart-outline"}
                        size={28}
                        color="white"
                    />
                </TouchableOpacity>
            </View>

            {/* Character name */}
            <Text className="text-[#888888] text-center text-lg mt-3">{character.name}</Text>
        </TouchableOpacity>
    );
};

export default MyListImage;
