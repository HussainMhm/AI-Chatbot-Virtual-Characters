import { View, Text, Image, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";

const MyListImage = ({ character, imageWidth, imageHeight, onHeartPress }) => {
    const navigation = useNavigation();

    const [isLiked, setIsLiked] = useState(false);

    const toggleLike = () => {
        setIsLiked(!isLiked);
    };

    const handleCharacterPress = () => {
        // Navigate to ChatScreen when character is pressed
        navigation.navigate("Chat", { character });
    };

    return (
        <TouchableOpacity className="mr-4" activeOpacity={0.8} onPress={handleCharacterPress}>
            {/* Image */}
            <View>
                <Image
                    source={character.image}
                    style={{ width: imageWidth, height: imageHeight }}
                    className={`rounded-xl`}
                />

                {/* Dark overlay */}
                <View className="absolute top-0 left-0 bottom-0 right-0 rounded-xl bg-black opacity-20" />

                {/* Heart icon */}
                <TouchableOpacity
                    className="absolute top-2 right-2"
                    onPress={() => {
                        toggleLike();
                        onHeartPress(character); // Check this later
                    }}
                >
                    <MaterialCommunityIcons
                        name={isLiked ? "heart" : "heart-outline"}
                        size={28}
                        color="white"
                    />
                </TouchableOpacity>
            </View>

            {/* Character name */}
            <Text className="mt-3 text-center text-base">{character.name}</Text>
        </TouchableOpacity>
    );
};

export default MyListImage;
