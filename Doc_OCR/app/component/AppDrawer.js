import React from "react";
import { Text, View } from "native-base";
import { Button, Divider, Drawer } from "react-native-paper";
import { Image, StyleSheet, Share } from "react-native";
import * as StoreReview from 'expo-store-review';
import { RFPercentage } from "react-native-responsive-fontsize";

function AppDrawer({ navigation }) {
    const [active, setActive] = React.useState('');

    const shareApp = async () => {
        await Share.share({
            message: 'React Native | A framework for building native apps using React',
        });
    }

    const rateApp = async () => {
        const CanRate = await StoreReview.isAvailableAsync();
        if (CanRate) {
            const res = StoreReview.requestReview();
            console.log('res', res, await StoreReview.hasAction())
        }
        StoreReview.requestReview();
    }

    return (
        <Drawer.Section  >
            <View style={{ flexDirection: 'row', padding: RFPercentage(2.4), marginTop: RFPercentage(3) }} >
                <Image style={{ width: RFPercentage(31.5), height: RFPercentage(6.2) }} source={require("../assets/navigationIcon.png")} />
            </View>
            <Divider />
            <Drawer.Item
                label="Home"
                icon="home"
                active={active === 'second'}
                onPress={() => navigation.navigate('Home')}
            />
            <Divider />
            <Drawer.Item
                label="Features"
            />

            <Drawer.Item
                label="Image To Text"
                icon="camera"
                active={active === 'second'}
                onPress={() => navigation.navigate('Home')}
            />
            <Drawer.Item
                label="Listen"
                icon="volume-high"
                active={active === 'third'}
                onPress={() => navigation.navigate("TextToVoice")}

            />
            <Drawer.Item
                label="Translate"
                icon="translate"
                active={active === 'third'}
                onPress={() => navigation.navigate("TranslateScreen")}

            />
            <Divider />
            <Drawer.Item
                label="Extras"
            />
            {/* <Drawer.Item
                label="Privacy Policy"
                icon="lock"
                active={active === 'third'}
                onPress={() => navigation.navigate("TranslateScreen")}

            /> */}
            <Drawer.Item
                label="Rate Us"
                icon="star"
                active={active === 'third'}
                onPress={() => rateApp()}

            />
            <Drawer.Item
                label="Share"
                icon="share"
                active={active === 'third'}
                onPress={() => shareApp()}

            />
        </Drawer.Section>
    );
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        justifyContent: "flex-start",
        paddingVertical: RFPercentage(2.4),

    }
})

export default AppDrawer;