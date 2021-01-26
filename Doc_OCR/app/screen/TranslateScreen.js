import React, { useState } from 'react';
import { TouchableOpacity, Text, TextInput, StyleSheet, View } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { Ionicons } from "@expo/vector-icons"
import { Picker } from '@react-native-community/picker';

import AppBar from '../component/AppBar';
import colors from '../config/colors';
import SpeechLangs from "../assets/languages/speechLanguages"
import { getTranslatedText } from '../http/api/api';
import { ScrollView } from 'react-native';


function TranslateScreen({ navigation }) {

    const [text, setText] = useState('')
    const [translatedText, setTranslatedText] = useState('')
    const [currentLanguage, setCurrentLanguage] = useState()

    const handleTranslation = async (stop) => {
        const body = {
            text,
            to: currentLanguage
        };

        try {
            const { data } = await getTranslatedText(body)
            setTranslatedText(data)
        } catch (error) {
            console.log("error: ", error)
        }
    }

    const swapText = () => {
        let temp = text;
        setText(translatedText)
        setTranslatedText(temp)
    }



    return (
        <View style={styles.mainContainer}>
            <AppBar showSearchBar={false} navigation={navigation} />
            {/* App Bar */}

            <ScrollView>
                <View style={{ marginTop: RFPercentage(4), width: "90%", marginLeft: "5%", alignItems: "center" }} >
                    <Text style={{ fontSize: RFPercentage(4), fontWeight: "bold", color: colors.primary }} >
                        Translator
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
                </View>
                <View style={{ marginBottom: RFPercentage(2), flexDirection: 'row', marginTop: RFPercentage(4), width: "90%", marginLeft: "5%", alignItems: "center", justifyContent: 'center' }} >
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
        padding: RFPercentage(2)
    },
    textArea: {
        width: "100%",
        fontSize: RFPercentage(2.2)
    }
})

export default TranslateScreen;