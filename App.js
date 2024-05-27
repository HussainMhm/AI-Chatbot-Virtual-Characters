import { StatusBar } from "expo-status-bar";
import Navigation from "./Navigation";
import { LogBox } from "react-native";
LogBox.ignoreLogs(["new NativeEventEmitter"]); // Ignore log notification by message

export default function App() {
    return (
        <>
            <Navigation />
            <StatusBar style="light" />
        </>
    );
}
