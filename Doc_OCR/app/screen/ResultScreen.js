import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Text, TextInput, StyleSheet, View, Image, ScrollView } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { Ionicons } from "@expo/vector-icons"
import { Picker } from '@react-native-community/picker';
import Spinner from 'react-native-loading-spinner-overlay';
import { MaterialCommunityIcons } from "@expo/vector-icons"
import * as Speech from 'expo-speech';

import AppBar from '../component/AppBar';
import colors from '../config/colors';
import SpeechLangs from "../assets/languages/speechLanguages"
import { getTranslatedText, scanText } from '../http/api/api';


function ResultScreen(props) {

    const [text, setText] = useState('')
    const [translatedText, setTranslatedText] = useState('')
    const [currentLanguage, setCurrentLanguage] = useState()
    const [image, setImage] = useState({ uri: '' })
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function fetchData() {
            let latestImage = props.route.params.data;
            let lang = props.route.params.lang;

            if (latestImage.uri != image.uri) {
                setImage(latestImage)

                let data = new FormData();
                data.append('file', { uri: latestImage.uri, name: 'file', type: "image/jpg" });

                try {
                    setLoading(true);
                    const { data: text } = await scanText(data, lang)
                    setText(text);

                    setLoading(false);
                } catch (error) {
                    setLoading(false);
                    console.log("Error: ", error)
                }
            }

        }
        fetchData();

    })

    const handleTranslation = async (stop) => {
        const body = {
            text,
            to: currentLanguage
        };

        try {
            setLoading(true);
            const { data } = await getTranslatedText(body)
            setLoading(false);
            setTranslatedText(data)
        } catch (error) {
            setLoading(false);
            console.log("error: ", error)
        }
    }

    const swapText = () => {
        let temp = text;
        setText(translatedText)
        setTranslatedText(temp)
    }


    const handleTextToVoice = async (stop) => {
        const options = {
            language: currentLanguage
        };

        Speech.speak(translatedText, options)

    }

    const stopSpeech = () => {
        Speech.stop()

    }

    return (
        <View style={styles.mainContainer}>
            <AppBar showSearchBar={false} navigation={props.navigation} />
            {/* App Bar */}


            <Spinner
                color={colors.primary}
                visible={loading}
                textContent={'Loading...'}
                textStyle={{ color: colors.primary, marginTop: -RFPercentage(5) }}
            />

            <ScrollView>


                <View style={{ marginTop: RFPercentage(4), width: "90%", marginLeft: "5%", alignItems: "center" }} >
                    <Text style={{ fontSize: RFPercentage(4), fontWeight: "bold", color: colors.primary }} >
                        Scanned Text
                    </Text>
                </View>
                <View style={styles.textAreaContainer} >
                    <TextInput
                        style={styles.textArea}
                        underlineColorAndroid="transparent"
                        placeholder="Type something"
                        placeholderTextColor="grey"
                        numberOfLines={10}
                        multiline={true}
                        textAlignVertical="top"
                        textAlign="left"
                        value={text}
                        onChangeText={(text) => setText(text)}
                    />
                </View>
                <View style={{ flexDirection: "row", marginTop: RFPercentage(4), width: "90%", marginLeft: "10%", alignItems: "center" }} >
                    <TouchableOpacity onPress={() => swapText()} style={{ flexDirection: "row", width: "40%", alignItems: "flex-start", justifyContent: "flex-start" }} >
                        <Ionicons style={{ marginRight: -RFPercentage(1.8), marginTop: RFPercentage(1.3) }} size={30} name="arrow-down" />
                        <Ionicons size={30} name="arrow-up" />
                    </TouchableOpacity>
                    <View style={{ width: "10%", alignItems: "flex-start", justifyContent: "flex-start" }} >
                        <Text numberOfLines={1} style={{ fontSize: RFPercentage(3), fontWeight: "bold", color: colors.primary }} >
                            To
                    </Text>
                    </View>
                    <View style={{ width: "50%", alignItems: "flex-start", justifyContent: "flex-start" }} >
                        <Picker
                            selectedValue={currentLanguage}
                            style={{ height: 50, width: RFPercentage(20) }}
                            onValueChange={(itemValue, itemIndex) =>
                                setCurrentLanguage(itemValue)
                            }
                        >
                            {SpeechLangs.map((lang, i) => (
                                <Picker.Item key={i} label={lang.name} value={lang.code} />
                            ))}
                        </Picker>
                    </View>
                </View>

                <View style={styles.textAreaContainer} >
                    <TextInput
                        style={styles.textArea}
                        underlineColorAndroid="transparent"
                        placeholder="Translated Text"
                        placeholderTextColor="grey"
                        numberOfLines={10}
                        multiline={true}
                        textAlignVertical="top"
                        textAlign="left"
                        value={translatedText}
                        onChangeText={(text) => setText(text)}
                    />

                    <View style={{ marginTop: -RFPercentage(4), marginLeft: RFPercentage(1), flexDirection: "row", width: "100%", alignItems: "flex-end", justifyContent: "flex-end" }} >
                        <TouchableOpacity onPress={() => handleTextToVoice()} style={{ alignItems: "center", justifyContent: "center", borderRadius: RFPercentage(3), padding: RFPercentage(1.3) }} >
                            <MaterialCommunityIcons name={"volume-high"} size={30} color={colors.primary} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => stopSpeech()} style={{ alignItems: "center", justifyContent: "center", borderRadius: RFPercentage(3), padding: RFPercentage(1.3) }} >
                            <MaterialCommunityIcons name={"volume-off"} size={30} color={colors.primary} />
                        </TouchableOpacity>
                    </View>

                </View>
                <View style={{ marginBottom: RFPercentage(2), flexDirection: 'row', marginTop: RFPercentage(4), width: "90%", marginLeft: "5%", alignItems: "center", justifyContent: 'center' }} >
                    <TouchableOpacity activeOpacity={0.7} onPress={() => props.navigation.navigate('Home')} style={{ marginRight: RFPercentage(2), backgroundColor: "#af3d3d", alignItems: "center", justifyContent: "center", borderRadius: RFPercentage(3), padding: RFPercentage(1.3), paddingLeft: RFPercentage(3), paddingRight: RFPercentage(3) }} >
                        <Text style={{ fontSize: RFPercentage(2), color: "white" }} >Back</Text>
                    </TouchableOpacity>

                    <TouchableOpacity activeOpacity={0.7} onPress={() => handleTranslation()} style={{ backgroundColor: colors.primary, alignItems: "center", justifyContent: "center", borderRadius: RFPercentage(3), padding: RFPercentage(1.3), paddingLeft: RFPercentage(3), paddingRight: RFPercentage(3) }} >
                        <Text style={{ fontSize: RFPercentage(2), color: "white" }} >Translate</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
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
        padding: RFPercentage(2),
        maxHeight: RFPercentage(26),
    },
    textArea: {
        width: "100%",
        fontSize: RFPercentage(2.2)
    }
})

export default ResultScreen;