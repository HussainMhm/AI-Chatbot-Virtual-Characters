import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Platform,
    SafeAreaView,
    StatusBar,
    TextInput,
} from "react-native";
import { FIREBASE_AUTH } from "../firebaseConfig";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
} from "firebase/auth";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";

const AuthenticationScreen = ({ navigation, route }) => {
    const { screen } = route.params;
    const [currentScreen, setCurrentScreen] = useState(screen); // default to the screen from route params
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        setCurrentScreen(screen);
    }, [screen]);

    function handleSignUp(email, password) {
        createUserWithEmailAndPassword(FIREBASE_AUTH, email, password)
            .then((userCredential) => {
                // Signed in
                console.log("User registered:", userCredential.user);
                // You can navigate to other screens here or set user info
            })
            .catch((error) => {
                console.error("Error signing up:", error.message);
                // Handle errors here, such as displaying a notification
            });
    }

    function handleSignIn(email, password) {
        signInWithEmailAndPassword(FIREBASE_AUTH, email, password)
            .then((userCredential) => {
                // Signed in
                navigation.navigate("Profile")
            })
            .catch((error) => {
                console.error("Error signing in:", error.message);
                // Handle errors here
            });
    }

    function handlePasswordReset(email) {
        sendPasswordResetEmail(FIREBASE_AUTH, email)
            .then(() => {
                console.log("Password reset email sent.");
                // Update UI or notify user
            })
            .catch((error) => {
                console.error("Error sending password reset email:", error.message);
                // Handle errors here
            });
    }

    // RENDER FUNCTIONS

    function renderSignUpOptionsScreen() {
        return (
            <View className="absolute bottom-0 left-0 right-0 mb-28">
                <Text className="text-white text-center text-4xl font-semibold">
                    Welcome to {"\n"}
                    <Text className="text-blue-500 font-bold">ChatBot AI</Text>
                </Text>

                <Text className="text-gray-400 text-center text-base mt-2">
                    Chat with unique AI characters.
                </Text>

                <View className="my-4 space-y-4">
                    <TouchableOpacity
                        className="flex-row bg-white mx-4 p-4 rounded-xl items-center justify-center"
                        onPress={() => setCurrentScreen("signup")}
                    >
                        <Ionicons name="mail" size={24} color="black" />
                        <Text className="text-base font-bold ml-2">Sign up with email</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="flex-row bg-blue-500 mx-4 p-4 rounded-xl items-center justify-center"
                        onPress={() => {}} // Google sign up
                    >
                        <FontAwesome5 name="google" size={22} color="white" />
                        <Text className="text-white text-base font-bold ml-2">
                            Sign up with Google
                        </Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity onPress={() => setCurrentScreen("signinOptions")}>
                    <Text className="text-gray-400 text-center">
                        Already have an account?{" "}
                        <Text className="text-white font-bold">Sign in</Text>
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }

    function renderSignInOptionsScreen() {
        return (
            <View className="absolute bottom-0 left-0 right-0 mb-28">
                <Text className="text-white text-center text-4xl font-semibold">
                    Welcome to {"\n"}
                    <Text className="text-blue-500 font-bold">ChatBot AI</Text>
                </Text>

                <Text className="text-gray-400 text-center text-base mt-2">
                    Chat with unique AI characters.
                </Text>

                <View className="my-4 space-y-4">
                    <TouchableOpacity
                        className="flex-row bg-white mx-4 p-4 rounded-xl items-center justify-center"
                        onPress={() => setCurrentScreen("signin")}
                    >
                        <Ionicons name="mail" size={24} color="black" />
                        <Text className="text-base font-bold ml-2">Sign in with email</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="flex-row bg-blue-500 mx-4 p-4 rounded-xl items-center justify-center"
                        onPress={() => {}} // Google sign in
                    >
                        <FontAwesome5 name="google" size={22} color="white" />
                        <Text className="text-white text-base font-bold ml-2">
                            Sign in with Google
                        </Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity onPress={() => setCurrentScreen("signupOptions")}>
                    <Text className="text-gray-400 text-center">
                        Don't have an account? <Text className="text-white font-bold">Sign up</Text>
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }

    function renderSignUp() {
        return (
            <View className="mt-4">
                <Text className="text-white text-2xl text-center font-bold">
                    Sign up with email
                </Text>
                <Text className="text-gray-400 text-center text-base mt-2">
                    Enter your email and password
                </Text>

                <View className="mt-8 mx-4 space-y-4">
                    <TextInput
                        placeholder="Email"
                        placeholderTextColor="gray"
                        className="p-5 rounded-xl bg-[#1b1b1b] text-white"
                        onChangeText={setEmail}
                        value={email}
                    />
                    <TextInput
                        placeholder="Password"
                        placeholderTextColor="gray"
                        secureTextEntry={true}
                        className="p-5 rounded-xl bg-[#1b1b1b] text-white"
                        onChangeText={setPassword}
                        value={password}
                    />
                </View>

                <TouchableOpacity
                    className="bg-white m-4 p-4 rounded-xl items-center justify-center"
                    onPress={() => handleSignUp(email, password)}
                >
                    <Text className="text-base font-semibold">Sign up</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setCurrentScreen("signin")}>
                    <Text className="text-gray-400 text-center">
                        Already have an account? Sign in
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }

    function renderSignIn() {
        return (
            <View className="mt-4">
                <Text className="text-white text-2xl text-center font-bold">
                    Sign in with email
                </Text>
                <Text className="text-gray-400 text-center text-base mt-2">
                    Enter your email and password
                </Text>

                <View className="mt-8 mx-4 space-y-4">
                    <TextInput
                        placeholder="Email"
                        placeholderTextColor="gray"
                        className="p-5 rounded-xl bg-[#1b1b1b] text-white"
                        onChangeText={setEmail}
                        value={email}
                    />
                    <TextInput
                        placeholder="Password"
                        placeholderTextColor="gray"
                        secureTextEntry={true}
                        className="p-5 rounded-xl bg-[#1b1b1b] text-white"
                        onChangeText={setPassword}
                        value={password}
                    />
                </View>

                <TouchableOpacity
                    className="mr-4 mt-4"
                    onPress={() => setCurrentScreen("forgotPassword")}
                >
                    <Text className="text-gray-400 text-right">Forgot Password?</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    className="bg-white m-4 p-4 rounded-xl items-center justify-center"
                    onPress={() => handleSignIn(email, password)}
                >
                    <Text className="text-base font-semibold">Sign in</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setCurrentScreen("signup")}>
                    <Text className="text-gray-400 text-center">
                        Don't have an account? Sign up
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }

    function renderForgotPassword() {
        return (
            <View className="mt-4">
                <Text className="text-white text-2xl text-center font-bold">Forgot Password</Text>
                <Text className="text-gray-400 text-center text-base mt-2">
                    Enter your email to reset your password
                </Text>

                <View className="mt-8 mx-4 space-y-4">
                    <TextInput
                        placeholder="Email"
                        placeholderTextColor="gray"
                        className="p-5 rounded-xl bg-[#1b1b1b] text-white"
                        onChangeText={setEmail}
                        value={email}
                    />
                </View>

                <TouchableOpacity
                    className="bg-white m-4 p-4 rounded-xl items-center justify-center"
                    onPress={() => handlePasswordReset(email)}
                >
                    <Text className="text-base font-semibold">Reset</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setCurrentScreen("signin")}>
                    <Text className="text-gray-400 text-center">Back to Sign in</Text>
                </TouchableOpacity>
            </View>
        );
    }

    function renderCurrentScreen() {
        switch (currentScreen) {
            case "signup":
                return renderSignUp();
            case "signin":
                return renderSignIn();
            case "forgotPassword":
                return renderForgotPassword();
            case "signupOptions":
                return renderSignUpOptionsScreen();
            case "signinOptions":
                return renderSignInOptionsScreen();
            default:
                return <Text>Invalid screen</Text>;
        }
    }

    return (
        <SafeAreaView
            style={{
                flex: 1,
                paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
                backgroundColor: "#0a0a0a",
            }}
        >
            <View className="flex-row mb-10">
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={{ position: "absolute", left: 16, top: 16 }}
                >
                    <FontAwesome5 name="chevron-left" size={24} color="white" />
                </TouchableOpacity>
            </View>
            {renderCurrentScreen()}
        </SafeAreaView>
    );
};

export default AuthenticationScreen;
