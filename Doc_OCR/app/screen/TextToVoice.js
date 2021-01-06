import React, { useEffect, useState } from 'react';
import { SafeAreaView, TouchableOpacity, Text, TextInput, StyleSheet, View } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { MaterialCommunityIcons } from "@expo/vector-icons"
import * as Speech from 'expo-speech';
import translate from 'google-translate-open-api';

import AppBar from '../component/AppBar';
import colors from '../config/colors';

function TextToVoice({ navigation }) {

    const [text, setText] = useState('')
    const [stop, setStop] = useState(false)
    const [icon, setIcon] = useState()

    const handleTextToVoice = async (stop) => {
        const options = {
            // language: 
        };

        stop ? Speech.stop() : Speech.speak(text, options)

        const lang = await Speech.getAvailableVoicesAsync()
        console.log(lang)
        const result = await translate(`I'm fine.`, {
            tld: "cn",
            to: "zh-CN",
        });
        const data = result.data[0];
        console.log(data)

    }

    return (
        <View style={styles.mainContainer}>
            <AppBar showSearchBar={false} navigation={navigation} />
            {/* App Bar */}

            <View style={{ marginTop: RFPercentage(4), width: "90%", marginLeft: "5%", alignItems: "center" }} >
                <Text style={{ fontSize: RFPercentage(4), fontWeight: "bold", color: colors.primary }} >
                    Voice To Text
                </Text>
            </View>

            <View style={styles.textAreaContainer} >
                <TextInput
                    style={styles.textArea}
                    underlineColorAndroid="transparent"
                    placeholder="Type something"
                    placeholderTextColor="grey"
                    numberOfLines={28}
                    multiline={true}
                    textAlignVertical="top"
                    textAlign="left"
                    onChangeText={(text) => setText(text)}
                />
            </View>
            <View style={{ flexDirection: 'row', marginTop: RFPercentage(4), width: "90%", marginLeft: "5%", alignItems: "center", justifyContent: 'center' }} >
                <TouchableOpacity onPress={() => handleTextToVoice(false)} style={{ borderBottomColor: colors.primary, borderBottomWidth: 1, alignItems: "center", justifyContent: "center", borderRadius: RFPercentage(3), elevation: 2, padding: RFPercentage(1.3), backgroundColor: "#edeeef", width: "30%" }} >
                    <MaterialCommunityIcons name={"volume-high"} size={30} color={colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleTextToVoice(true)} style={{ marginLeft: RFPercentage(2), borderBottomColor: colors.primary, borderBottomWidth: 1, alignItems: "center", justifyContent: "center", borderRadius: RFPercentage(3), elevation: 2, padding: RFPercentage(1.3), backgroundColor: "#edeeef", width: "30%" }} >
                    <MaterialCommunityIcons name={"volume-off"} size={30} color={colors.primary} />
                </TouchableOpacity>
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        width: "100%"
    },

    textAreaContainer: {
        // flex: 1,
        width: "90%",
        marginLeft: "5%",
        justifyContent: "flex-start",
        alignItems: 'flex-start',
        alignItems: 'flex-start',
        borderColor: colors.lightGray,
        borderWidth: 2,
        marginTop: RFPercentage(4),
        padding: RFPercentage(2)
    },
    textArea: {
        width: "100%",
        fontSize: RFPercentage(2.2)
    }
})

export default TextToVoice;