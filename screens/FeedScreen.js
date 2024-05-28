import React, { useState, useEffect, useRef } from "react";
import {
    View,
    Text,
    SafeAreaView,
    Platform,
    StatusBar,
    TouchableOpacity,
    ImageBackground,
} from "react-native";
import MyHeader from "../components/MyHeader";
import Swiper from "react-native-deck-swiper";
import characters from "../data/characters.json";
import { getImage } from "../helpers";
import { FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const FeedScreen = () => {
    const [cards, setCards] = useState([]);
    const [swiperKey, setSwiperKey] = useState(0);
    const [currentCard, setCurrentCard] = useState(null);
    const swiper = useRef(null);
    const navigation = useNavigation();

    useEffect(() => {
        setCards(characters.characters);
    }, []);

    const onSwiped = (cardIndex) => {
        if (cardIndex < cards.length - 1) {
            setCurrentCard(cards[cardIndex + 1]);
        } else {
            setCurrentCard(null); // No more cards
        }
    };

    useEffect(() => {
        if (cards.length > 0) {
            setCurrentCard(cards[0]);
        }
    }, [cards]);

    const handleSwipedAll = () => {
        setSwiperKey((prevKey) => prevKey + 1); // Reset the swiper by updating the key
    };

    return (
        <SafeAreaView
            className={`flex-1 bg-chatbot-dark`}
            style={{ paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0 }}
        >
            <MyHeader title="Feed" icon={"newspaper"} />
            <View className="-mt-4 h-4/5">
                <Swiper
                    key={swiperKey}
                    ref={swiper}
                    cards={cards}
                    renderCard={(card) => {
                        if (!card)
                            return (
                                <View className="h-[480] justify-end items-center rounded-lg overflow-hidden shadow-xl">
                                    <Text>No more cards</Text>
                                </View>
                            );
                        return (
                            <ImageBackground
                                source={
                                    card.id === -1 ? { uri: card?.image_path } : getImage(card.id)
                                }
                                className="h-3/5 justify-end items-center rounded-3xl border-6 border-black overflow-hidden shadow-2xl"
                                imageStyle={{ width: "100%", height: "100%", resizeMode: "cover" }}
                            >
                                <View
                                    className="w-full p-4"
                                    style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
                                >
                                    <Text className="text-white text-center text-2xl font-bold p-2">
                                        {card.name}
                                    </Text>
                                    <Text className="text-white text-center text-base pb-2">
                                        {card.assistant_content}
                                    </Text>
                                </View>
                            </ImageBackground>
                        );
                    }}
                    onSwipedLeft={(cardIndex) => onSwiped(cardIndex)}
                    onSwipedRight={(cardIndex) => onSwiped(cardIndex)}
                    onSwipedAll={handleSwipedAll} // Reset swiper when all cards are swiped
                    cardIndex={0}
                    backgroundColor={"transparent"}
                    stackSize={4}
                    verticalSwipe={false}
                    overlayLabels={{
                        left: {
                            title: "SKIP",
                            style: {
                                label: {
                                    backgroundColor: "red",
                                    borderColor: "red",
                                    color: "white",
                                    borderWidth: 1,
                                },
                                wrapper: {
                                    flexDirection: "column",
                                    alignItems: "flex-end",
                                    justifyContent: "flex-start",
                                    marginTop: 30,
                                    marginLeft: -30,
                                },
                            },
                        },
                        right: {
                            title: "SKIP",
                            style: {
                                label: {
                                    backgroundColor: "red",
                                    borderColor: "red",
                                    color: "white",
                                    borderWidth: 1,
                                },
                                wrapper: {
                                    flexDirection: "column",
                                    alignItems: "flex-start",
                                    justifyContent: "flex-start",
                                    marginTop: 30,
                                    marginLeft: 30,
                                },
                            },
                        },
                    }}
                    stackScale={2}
                />
            </View>
            <View className="flex-row space-x-4 justify-center items-center">
                <TouchableOpacity
                    className="bg-[#1F1F1F] h-16 w-16 justify-center items-center rounded-3xl"
                    onPress={() => swiper.current?.swipeLeft()}
                >
                    <FontAwesome5 name="chevron-left" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity
                    className="bg-white h-16 w-40 justify-center items-center rounded-3xl"
                    onPress={() => navigation.navigate("Chat", { character: currentCard })}
                >
                    <Text className="font-bold text-base">Chat Now</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    className="bg-[#1F1F1F] h-16 w-16 justify-center items-center rounded-3xl"
                    onPress={() => swiper.current?.swipeRight()}
                >
                    <FontAwesome5 name="chevron-right" size={24} color="white" />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default FeedScreen;
