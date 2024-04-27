// navigation.js
import * as React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

// Import your screens
import HomeScreen from "./screens/HomeScreen";
import ChatScreen from "./screens/ChatScreen";
import FeedScreen from "./screens/FeedScreen";
import ProfileScreen from "./screens/ProfileScreen";
import NewCharacter from "./screens/NewCharacter";
import ChatListScreen from "./screens/ChatListScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                // Hide the header for all screens
                headerShown: false,

                // Set the tab bar icon
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === "Home") {
                        iconName = focused ? "home" : "home-outline";
                    } else if (route.name === "ChatList") {
                        iconName = focused ? "chatbubbles" : "chatbubbles-outline";
                    } else if (route.name === "Feed") {
                        iconName = focused ? "newspaper" : "newspaper-outline";
                    } else if (route.name === "NewCharacter") {
                        iconName = focused ? "person-add" : "person-add-outline";
                    } else if (route.name === "Profile") {
                        iconName = focused ? "person" : "person-outline";
                    }

                    // You can return any component here
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: "tomato",
                tabBarInactiveTintColor: "gray",
                tabBarLabelStyle: { fontSize: 12 },
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: "Home" }} />
            <Tab.Screen
                name="ChatList"
                component={ChatListScreen}
                options={{ tabBarLabel: "Chats" }}
            />
            <Tab.Screen name="Feed" component={FeedScreen} options={{ tabBarLabel: "Feed" }} />
            <Tab.Screen
                name="NewCharacter"
                component={NewCharacter}
                options={{ tabBarLabel: "Create" }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{ tabBarLabel: "Profile" }}
            />
        </Tab.Navigator>
    );
};

const Navigation = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen
                    name="Main"
                    component={BottomTabNavigator}
                    options={{ headerShown: false }}
                />
                <Stack.Screen name="Chat" component={ChatScreen} options={{ headerShown: false }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default Navigation;
