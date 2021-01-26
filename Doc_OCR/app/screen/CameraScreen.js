import React, { useEffect, useState } from 'react';
import { TouchableOpacity, Text, TextInput, StyleSheet, View, Image, ScrollView } from 'react-native';
import { Picker } from '@react-native-community/picker';
import { RFPercentage } from 'react-native-responsive-fontsize';

import TesseractLangs from "../assets/languages/tessRactLanguages"
import AppBar from '../component/AppBar';
import colors from '../config/colors';

function CameraScreen(props) {
    const [image, setImage] = useState(null)
    const [currentLanguage, setCurrentLanguage] = useState()

    useEffect(() => {
        let latestImage = props.route.params.data;
        setImage(latestImage)
    })

    const proceedToTranslate = () => {
        props.navigation.navigate('ResultScreen', { data: image, lang: currentLanguage })
    }

    return (
        <View style={styles.mainContainer}>

            {/* App Bar */}
            <AppBar showSearchBar={false} navigation={props.navigation} />

            <View style={{ flex: 1, width: "90%", marginLeft: "5%" }} >

                <View style={{ width: "100%", marginTop: RFPercentage(5) }}>
                    <Image resizeMode="stretch" style={{ width: "99%", height: RFPercentage(60) }} source={image} />
                </View>

                <View style={{ marginBottom: -RFPercentage(2), flex: 1, flexDirection: "row", marginTop: RFPercentage(5), width: "90%", marginLeft: "10%", alignItems: "flex-start" }} >
                    <View style={{ marginTop: RFPercentage(1), width: "50%", alignItems: "flex-start", justifyContent: "flex-start" }} >
                        <Text numberOfLines={1} style={{ fontSize: RFPercentage(3), fontWeight: "bold", color: colors.primary }} >
                            Select Language
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
                            {TesseractLangs.map((lang, i) => (
                                <Picker.Item key={i} label={lang.name} value={lang.code} />
                            ))}
                        </Picker>
                    </View>
                </View>

                <View style={{ flex: 1, flexDirection: 'row', width: "90%", marginLeft: "5%", alignItems: "flex-start", justifyContent: 'center' }} >
                    <TouchableOpacity activeOpacity={0.7} onPress={() => props.navigation.navigate('Home')} style={{ marginRight: RFPercentage(2), backgroundColor: "#af3d3d", alignItems: "center", justifyContent: "center", borderRadius: RFPercentage(3), padding: RFPercentage(1.3), paddingLeft: RFPercentage(3), paddingRight: RFPercentage(3) }} >
                        <Text style={{ fontSize: RFPercentage(2), color: "white" }} >Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.7} onPress={() => proceedToTranslate()} style={{ backgroundColor: colors.primary, alignItems: "center", justifyContent: "center", borderRadius: RFPercentage(3), padding: RFPercentage(1.3), paddingLeft: RFPercentage(3), paddingRight: RFPercentage(3) }} >
                        <Text style={{ fontSize: RFPercentage(2), color: "white" }} >Translate</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        width: "100%"
    },
})

export default CameraScreen;