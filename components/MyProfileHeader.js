import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { FIREBASE_AUTH } from "../firebaseConfig";
import { signOut } from "firebase/auth";

const MyProfileHeader = ({ user, title, icon, option }) => {
    const navigation = useNavigation();

    const handleSignOut = async () => {
        try {
            await signOut(FIREBASE_AUTH);
            navigation.navigate("Authentication", { screen: "signinOptions" });
        } catch (error) {
            console.error("Error signing out: ", error);
        }
    };

    return (
        <View className="p-4 flex-row justify-between items-center border-b-gray-800 border-b">
            <Text className="text-white text-3xl font-bold">{title}</Text>
            {user ? (<>
                <TouchableOpacity
                    className="bg-[#1F1F1F] mr-4 py-2 px-4 rounded-xl"
                    onPress={handleSignOut}
                >
                    <Text className="text-white text-lg font-bold">Sign Out</Text>
                </TouchableOpacity>
            </>) : (
                <View className="flex-row items-center">
                    {option == "signin" ? (
                        <TouchableOpacity
                            className="bg-[#1F1F1F] mr-4 py-2 px-4 rounded-xl"
                            onPress={() =>
                                navigation.navigate("Authentication", { screen: "signinOptions" })
                            }
                        >
                            <Text className="text-white text-lg font-bold">Sign in</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            className="bg-[#1F1F1F] mr-4 py-2 px-4 rounded-xl"
                            onPress={() =>
                                navigation.navigate("Authentication", { screen: "signupOptions" })
                            }
                        >
                            <Text className="text-white text-lg font-bold">Sign up</Text>
                        </TouchableOpacity>
                    )}
                    {icon && (
                        <TouchableOpacity>
                            <Ionicons name={icon} size={24} color="white" />
                        </TouchableOpacity>
                    )}
                </View>
            )}

        </View>
    );
};

export default MyProfileHeader;
