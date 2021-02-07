import React, { useEffect, useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Image } from 'react-native';
import { Picker } from '@react-native-community/picker';
import { RFPercentage } from 'react-native-responsive-fontsize';
import Spinner from 'react-native-loading-spinner-overlay';
import { useToastBannerToggler } from 'react-native-toast-banner';
import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';

import TesseractLangs from "../assets/languages/tessRactLanguages"
import AppBar from '../component/AppBar';
import colors from '../config/colors';
import { scanText } from '../http/api/api';
import { saveTextFile } from '../component/SaveFile';
import { bannerConfig } from '../component/banner';

const ComressionPercents = [
    { value: 0, to: "100%" },
    { value: 0.1, to: "90%" },
    { value: 0.2, to: "80%" },
    { value: 0.3, to: "70%" },
    { value: 0.4, to: "60%" },
    { value: 0.5, to: "50%" },
    { value: 0.6, to: "40%" },
    { value: 0.7, to: "30%" },
    { value: 0.8, to: "20%" },
    { value: 0.9, to: "10%" },
]

function OCRScreen(props) {
    const [image, setImage] = useState({ uri: null })
    const [currentLanguage, setCurrentLanguage] = useState()
    const [loading, setLoading] = useState(false);
    const [count, setCount] = useState(1);
    const [imageSize, setImageSize] = useState(1);
    const [warnMessage, setWarnMessage] = useState(false)
    const [compressValue, setCompressValue] = useState(1)
    const [render, setRender] = useState(false)
    const { showBanner, hideBanner } = useToastBannerToggler();

    const resizeHeight = 700

    const setInfo = async (latestImage) => {
        let imageHeight;

        if (latestImage.height >= resizeHeight) {
            imageHeight = resizeHeight
        } else {
            imageHeight = latestImage.height
        }

        let manipResult = await ImageManipulator.manipulateAsync(
            latestImage.uri,
            [{ resize: { height: imageHeight } }], { compress: compressValue },
        );

        const info = await FileSystem.getInfoAsync(manipResult.uri);
        const sizeKB = Math.trunc(info.size / 1024);

        manipResult.cancelled = false
        manipResult.type = "image"

        setImageSize(sizeKB)

        if (sizeKB > 1024) {
            setWarnMessage(true)
        } else {
            setWarnMessage(false)
        }

        return manipResult

    }

    useEffect(() => {
        const fun = async () => {
            let latestImage = props.route.params.data;

            if (latestImage.uri !== image.tempUri) {
                let uri = latestImage.uri;

                let imageHeight;

                if (latestImage.height >= resizeHeight) {
                    imageHeight = resizeHeight
                } else {
                    imageHeight = latestImage.height
                }

                let manipResult = await ImageManipulator.manipulateAsync(
                    latestImage.uri,
                    [{ resize: { height: imageHeight } }], { compress: 1 },
                );

                const info = await FileSystem.getInfoAsync(manipResult.uri);
                const sizeKB = Math.trunc(info.size / 1024);

                manipResult.cancelled = false
                manipResult.type = "image"


                if (sizeKB > 1024) {
                    setWarnMessage(true)
                } else {
                    setWarnMessage(false)
                }

                manipResult.tempUri = uri
                console.log("use: ")
                setImageSize(sizeKB)
                setImage(manipResult)
            }
        }
        fun()

    })

    const handleCompression = async () => {
        const uri = image.tempUri;
        const res = await setInfo(image)
        res.tempUri = uri
        setImage(res)
        console.log("res: ", res)
    }

    const proceedToTranslate = async () => {
        setCount(count + 1)

        let data = new FormData();
        data.append('file', { uri: image.uri, name: 'file', type: "image/jpg" });
        try {
            setLoading(true);
            const { data: text } = await scanText(data, currentLanguage)
            setLoading(false);

            await saveTextFile(text)

            props.navigation.navigate('ResultScreen', { data: text, count: count })

        } catch (error) {
            setLoading(false);
            console.log("Error: ", error)
            showBanner(bannerConfig(hideBanner, "Image scanning error, image size is too big try smaller image"))
        }
    }

    return (
        <View style={styles.mainContainer}>

            {/* App Bar */}
            <AppBar showSearchBar={false} navigation={props.navigation} />

            <View style={{ flex: 1, width: "90%", marginLeft: "5%" }} >

                <Spinner
                    color={colors.primary}
                    visible={loading}
                    textContent={'Loading...'}
                    textStyle={{ color: colors.primary, marginTop: -RFPercentage(5) }}
                />

                <View style={{ justifyContent: "flex-start", flexDirection: "row", marginTop: RFPercentage(1), width: "90%", marginLeft: "5%", alignItems: "center" }} >
                    <Text numberOfLines={1} style={{ fontSize: RFPercentage(2), fontWeight: "bold", color: "red" }} >
                        * Image is too large Comress the image for scanning
                    </Text>
                </View>


                <View style={{ width: "100%", marginTop: RFPercentage(2) }}>
                    <Image resizeMode="stretch" style={{ width: "99%", height: RFPercentage(45) }} source={image} />
                </View>


                <View style={{ justifyContent: "flex-start", flexDirection: "row", marginTop: RFPercentage(5), width: "90%", marginLeft: "5%", alignItems: "flex-start" }} >
                    <Text numberOfLines={1} style={{ fontSize: RFPercentage(3), fontWeight: "bold", color: colors.primary }} >
                        Image Info
                    </Text>
                </View>
                <View style={{ marginTop: RFPercentage(1), justifyContent: "center", flexDirection: "row", width: "90%", marginLeft: "5%", alignItems: "center" }} >
                    <View style={{ marginRight: RFPercentage(2), justifyContent: "flex-start", flexDirection: "row", alignItems: "center" }} >
                        <Text style={{ marginRight: RFPercentage(1), fontSize: RFPercentage(2.6), fontWeight: "bold", color: "black" }} >Size</Text>
                        <Text>{imageSize}Kb</Text>
                    </View>
                    <View style={{ marginRight: RFPercentage(2), justifyContent: "flex-start", flexDirection: "row", alignItems: "center" }} >
                        <Text style={{ marginRight: RFPercentage(1), fontSize: RFPercentage(2.6), fontWeight: "bold", color: "black" }} >Width</Text>
                        <Text>{image.width}</Text>
                    </View>
                    <View style={{ marginRight: RFPercentage(2), justifyContent: "flex-start", flexDirection: "row", alignItems: "center" }} >
                        <Text style={{ marginRight: RFPercentage(1), fontSize: RFPercentage(2.6), fontWeight: "bold", color: "black" }} >Height</Text>
                        <Text>{image.height}</Text>
                    </View>
                </View>

                <View style={{ justifyContent: "flex-start", flexDirection: "row", marginTop: RFPercentage(3), width: "90%", marginLeft: "5%", alignItems: "flex-start" }} >
                    <Text numberOfLines={1} style={{ fontSize: RFPercentage(3), fontWeight: "bold", color: colors.primary }} >
                        Compress
                    </Text>
                </View>
                <View style={{ justifyContent: "center", flexDirection: "row", width: "90%", marginLeft: "5%", alignItems: "center" }} >

                    <View style={{ alignItems: "flex-start", justifyContent: "flex-start" }} >
                        <Text numberOfLines={1} style={{ fontSize: RFPercentage(2.6), fontWeight: "bold", color: "black" }} >
                            To
                            </Text>
                    </View>
                    <View style={{ alignItems: "center", justifyContent: "flex-start" }} >
                        <Picker
                            selectedValue={compressValue}
                            style={{ height: 50, width: RFPercentage(15) }}
                            onValueChange={(itemValue, itemIndex) =>
                                setCompressValue(itemValue)
                            }
                        >
                            {ComressionPercents.map((item, i) => (
                                <Picker.Item key={i} label={item.to} value={item.value} />
                            ))}
                        </Picker>
                    </View>
                    <TouchableOpacity activeOpacity={0.7} onPress={() => handleCompression()} style={{ backgroundColor: colors.primary, alignItems: "center", justifyContent: "center", borderRadius: RFPercentage(3), padding: RFPercentage(1), paddingLeft: RFPercentage(2.5), paddingRight: RFPercentage(2.5) }} >
                        <Text style={{ fontSize: RFPercentage(2), color: "white" }} >Compress</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ flexDirection: "row", marginTop: RFPercentage(1), width: "90%", marginLeft: "5%", alignItems: "flex-start" }} >
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

                <View style={{ marginTop: RFPercentage(1), flexDirection: 'row', width: "90%", marginLeft: "5%", alignItems: "flex-start", justifyContent: 'center' }} >
                    <TouchableOpacity activeOpacity={0.7} onPress={() => props.navigation.navigate('Home')} style={{ marginRight: RFPercentage(2), backgroundColor: "#af3d3d", alignItems: "center", justifyContent: "center", borderRadius: RFPercentage(3), padding: RFPercentage(1.3), paddingLeft: RFPercentage(3), paddingRight: RFPercentage(3) }} >
                        <Text style={{ fontSize: RFPercentage(2), color: "white" }} >Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.7} onPress={() => proceedToTranslate()} style={{ backgroundColor: colors.primary, alignItems: "center", justifyContent: "center", borderRadius: RFPercentage(3), padding: RFPercentage(1.3), paddingLeft: RFPercentage(3.6), paddingRight: RFPercentage(3.6) }} >
                        <Text style={{ fontSize: RFPercentage(2), color: "white" }} >Scan</Text>
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

export default OCRScreen;