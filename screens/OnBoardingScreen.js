import React, { useEffect, useRef, useState } from "react";
import { View, Text, SafeAreaView, Platform, StatusBar, TouchableOpacity } from "react-native";
import Onboarding from "react-native-onboarding-swiper";
import LottieView from "lottie-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const OnBoardingScreen = ({ navigation }) => {
    const onboardingRef = useRef(null);
    const [isFirstLaunch, setIsFirstLaunch] = useState(null);

    useEffect(() => {
        if (isFirstLaunch === false) {
            navigation.replace("Main");
        }
    }, [isFirstLaunch, navigation]);

    const navigateToMainScreen = () => {
        navigation.replace("Main");
    };

    const navigateToNextPage = () => {
        onboardingRef.current?.goNext();
    };

    const renderButton = (title, onPress) => (
        <TouchableOpacity
            className="bg-white mt-12 py-4 rounded-2xl items-center justify-center"
            onPress={onPress}
        >
            <Text className="text-base font-semibold">{title}</Text>
        </TouchableOpacity>
    );

    const renderDot = ({ selected }) => (
        <View
            style={{
                width: selected ? 25 : 10,
                height: 10,
                marginHorizontal: 3,
                borderRadius: 5,
                backgroundColor: selected ? "white" : "#A0A0A0",
            }}
        />
    );

    if (isFirstLaunch === null) {
        return null; // Show a loading spinner or splash screen if needed
    }

    return (
        <SafeAreaView
            className="flex-1 bg-chatbot-dark"
            style={{ paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0 }}
        >
            <Onboarding
                ref={onboardingRef}
                DotComponent={renderDot}
                pages={[
                    {
                        backgroundColor: "#0f0f0f",
                        image: (
                            <View className="justify-center items-center mx-2">
                                <LottieView
                                    source={require("../assets/animations/onboarding1.json")}
                                    autoPlay
                                    loop
                                    style={{ width: 300, height: 300 }}
                                />
                                <View className="mt-4">
                                    <Text className="text-white text-3xl font-bold text-center">
                                        Welcome to ChatBot AI
                                    </Text>
                                    <Text className="text-gray-400 text-lg mt-2 text-center px-2">
                                        Chance to ask the question you've always wanted to ask.
                                    </Text>
                                    {renderButton("Get Started", navigateToNextPage)}
                                </View>
                            </View>
                        ),
                        title: <></>,
                        subtitle: <></>,
                    },
                    {
                        backgroundColor: "#0f0f0f",
                        image: (
                            <View className="justify-center items-center mx-2">
                                <LottieView
                                    source={require("../assets/animations/onboarding2.json")}
                                    autoPlay
                                    loop
                                    style={{ width: 300, height: 300 }}
                                />
                                <View className="mt-4">
                                    <Text className="text-white text-3xl font-bold text-center">
                                        Chat with Characters
                                    </Text>
                                    <Text className="text-gray-400 text-lg mt-2 text-center px-2">
                                        Immerse yourself in the world of your favorite characters.
                                    </Text>
                                    {renderButton("Continue", navigateToNextPage)}
                                </View>
                            </View>
                        ),
                        title: <></>,
                        subtitle: <></>,
                    },
                    {
                        backgroundColor: "#0f0f0f",
                        image: (
                            <View className="justify-center items-center mx-2">
                                <LottieView
                                    source={require("../assets/animations/onboarding3.json")}
                                    autoPlay
                                    loop
                                    style={{ width: 300, height: 300 }}
                                />
                                <View className="mt-4">
                                    <Text className="text-white text-3xl font-bold text-center">
                                        Create Your AI Friend
                                    </Text>
                                    <Text className="text-gray-400 text-lg mt-2 text-center px-2">
                                        Create your own AI friend and chat with them anytime.
                                    </Text>
                                    {renderButton("Start Chatting!", navigateToMainScreen)}
                                </View>
                            </View>
                        ),
                        title: <></>,
                        subtitle: <></>,
                    },
                ]}
                showSkip={false}
                showNext={false}
                showDone={false}
            />
        </SafeAreaView>
    );
};

export default OnBoardingScreen;
