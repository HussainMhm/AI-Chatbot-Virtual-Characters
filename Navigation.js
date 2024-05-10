import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { View, Text, TouchableOpacity } from "react-native";

import HomeScreen from "./screens/HomeScreen";
import ChatScreen from "./screens/ChatScreen";
import FeedScreen from "./screens/FeedScreen";
import ProfileScreen from "./screens/ProfileScreen";
import CharacterListScreen from "./screens/CharacterListScreen";
import ChatListScreen from "./screens/ChatListScreen";
import CharacterBuilder from "./screens/CharacterBuilder";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const CustomTabBar = ({ state, descriptors, navigation }) => {
    const onPress = (route) => {
        const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
        });

        if (!event.defaultPrevented) {
            navigation.navigate(route.name);
        }
    };

    return (
        <View className="flex-row justify-between items-center bg-chatbot-dark border-t border-[#222222] h-24 px-5">
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const label = options.tabBarLabel !== undefined ? options.tabBarLabel : route.name;

                const isFocused = state.index === index;

                return (
                    <TouchableOpacity
                        key={index}
                        className="items-center"
                        onPress={() => onPress(route)}
                    >
                        <Ionicons
                            name={options.tabBarIconName}
                            size={26}
                            color={isFocused ? "white" : "gray"}
                        />
                        <Text style={{ color: isFocused ? "white" : "gray" }} className="mt-2">
                            {label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

const BottomTabNavigator = () => {
    return (
        <Tab.Navigator tabBar={(props) => <CustomTabBar {...props} />}>
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarLabel: "Home",
                    tabBarIconName: "home",
                    headerShown: false,
                }}
            />
            <Tab.Screen
                name="ChatList"
                component={ChatListScreen}
                options={{
                    tabBarLabel: "Chats",
                    tabBarIconName: "chatbubble",
                    headerShown: false,
                }}
            />
            <Tab.Screen
                name="Feed"
                component={FeedScreen}
                options={{
                    tabBarLabel: "Feed",
                    tabBarIconName: "newspaper",
                    headerShown: false,
                }}
            />
            <Tab.Screen
                name="NewCharacter"
                component={CharacterListScreen}
                options={{
                    tabBarLabel: "Create",
                    tabBarIconName: "add-circle",
                    headerShown: false,
                }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    tabBarLabel: "Profile",
                    tabBarIconName: "person",
                    headerShown: false,
                }}
            />
        </Tab.Navigator>
    );
};

const Navigation = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen
                    name="Main"
                    component={BottomTabNavigator}
                    options={{ headerShown: false }}
                />
                <Stack.Screen name="CreateCharacter" component={CharacterBuilder} />
                <Stack.Screen name="Chat" component={ChatScreen} options={{ headerShown: false }} />
                <Stack.Screen name="CharacterList" component={CharacterListScreen} />

            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default Navigation;
