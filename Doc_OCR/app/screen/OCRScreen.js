import React, { useEffect, useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Image } from 'react-native';
import { Picker } from '@react-native-community/picker';
import { RFPercentage } from 'react-native-responsive-fontsize';
import Spinner from 'react-native-loading-spinner-overlay';
import { useToastBannerToggler } from 'react-native-toast-banner';
import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';
import { MaterialCommunityIcons } from "@expo/vector-icons"
import * as MediaLibrary from 'expo-media-library';

import TesseractLangs from "../assets/languages/tessRactLanguages"
import AppBar from '../component/AppBar';
import colors from '../config/colors';
import { scanText } from '../http/api/api';
import { saveTextFile } from '../component/SaveFile';
import { bannerConfig } from '../component/banner';
import { ImageBackground } from 'react-native';

const ComressionPercents = [
    { value: 0, to: "Max" },
    { value: 0.1, to: "90%" },
    { value: 0.2, to: "80%" },
    { value: 0.3, to: "70%" },
    { value: 0.4, to: "60%" },
    { value: 0.5, to: "50%" },
    { value: 0.6, to: "40%" },
    { value: 0.7, to: "30%" },
    { value: 0.8, to: "20%" },
    { value: 0.9, to: "Min" },
]

function OCRScreen(props) {
    const [image, setImage] = useState({ uri: null })
    const [currentLanguage, setCurrentLanguage] = useState()
    const [loading, setLoading] = useState(false);
    const [count, setCount] = useState(1);
    const [imageSize, setImageSize] = useState(1);
    const [compressionTool, setCompressionTool] = useState(false)
    const [imageDetail, setImageDetail] = useState(false)
    const [compressValue, setCompressValue] = useState(1)
    const [render, setRender] = useState(false)
    const { showBanner, hideBanner } = useToastBannerToggler();

    const resizeHeight = 700

    const imageSizeKb = async (manipResult) => {
        const info = await FileSystem.getInfoAsync(manipResult.uri);
        return Math.trunc(info.size / 1024);
    }

    const imagrManipulator = async (latestImage, imageHeight, i) => {
        let manipResult = await ImageManipulator.manipulateAsync(
            latestImage.uri,
            [{ resize: { height: imageHeight } }], { compress: i },
        );
        return manipResult;
    }

    const setInfo = async (latestImage) => {
        let imageHeight;

        if (latestImage.height >= resizeHeight) {
            imageHeight = resizeHeight
        } else {
            imageHeight = latestImage.height
        }

        let manipResult = await imagrManipulator(latestImage, imageHeight, compressValue)

        const sizeKB = await imageSizeKb(manipResult);

        manipResult.cancelled = false
        manipResult.type = "image"

        setImageSize(sizeKB)

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

                let i = 1;
                let manipResult = await imagrManipulator(latestImage, imageHeight, i)
                let sizeKB = await imageSizeKb(manipResult);

                while (sizeKB > 200) {
                    i = i - 0.1;
                    i = parseFloat(i.toFixed(1));

                    manipResult = await imagrManipulator(latestImage, imageHeight, i)
                    sizeKB = await imageSizeKb(manipResult);
                }

                setCompressValue(i)
                manipResult.cancelled = false
                manipResult.type = "image"
                manipResult.tempUri = uri

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
            showBanner(bannerConfig(hideBanner, "Image scanning error, image size is too big try smaller image"))
        }
    }

    const downloadImage = async () => {
        try {
            const assetLink = await MediaLibrary.createAssetAsync(image.uri)
            await MediaLibrary.createAlbumAsync("Download", assetLink, false);
            alert("Image was successfully downloaded!");
        } catch (error) {
            alert("Error while downloading!")
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

                {imageSize > 300 ?
                    <View style={{ justifyContent: "flex-start", flexDirection: "row", marginTop: RFPercentage(1), width: "90%", marginLeft: "5%", alignItems: "center" }} >
                        <Text numberOfLines={1} style={{ fontSize: RFPercentage(2), fontWeight: "bold", color: "red" }} >
                            * Image is too large Compress the image for scanning
                        </Text>
                    </View>
                    : null
                }

                <View style={{ width: "100%", marginTop: RFPercentage(2) }}>
                    <ImageBackground resizeMode="stretch" style={{ justifyContent: "flex-start", alignItems: "flex-end", width: "99%", height: RFPercentage(58) }} source={image} >
                        <View style={{ marginRight: RFPercentage(0.2), backgroundColor: "white" }} >
                            <TouchableOpacity onPress={() => downloadImage()} >
                                <MaterialCommunityIcons color={colors.primary} size={RFPercentage(5)} name="download" />
                            </TouchableOpacity>
                        </View>
                    </ImageBackground>
                </View>

                <View style={{ justifyContent: "flex-start", flexDirection: "row", marginTop: RFPercentage(3), width: "90%", marginLeft: "5%", alignItems: "flex-start" }} >
                    <Text numberOfLines={1} style={{ width: "90%", fontSize: RFPercentage(3), fontWeight: "bold", color: colors.primary }} >
                        Image Info
                    </Text>
                    <TouchableOpacity onPress={() => {
                        setImageDetail(!imageDetail)
                        setCompressionTool(false)
                    }} >
                        <MaterialCommunityIcons name="chevron-down" color={colors.primary} size={RFPercentage(3)} />
                    </TouchableOpacity>
                </View>

                {imageDetail ?
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
                    : null}

                <View style={{ justifyContent: "flex-start", flexDirection: "row", marginTop: RFPercentage(2), width: "90%", marginLeft: "5%", alignItems: "flex-start" }} >
                    <Text numberOfLines={1} style={{ width: "90%", fontSize: RFPercentage(3), fontWeight: "bold", color: colors.primary }} >
                        Compression Tool
                    </Text>
                    <TouchableOpacity onPress={() => {
                        setCompressionTool(!compressionTool)
                        setImageDetail(false)
                    }} >
                        <MaterialCommunityIcons name="chevron-down" color={colors.primary} size={RFPercentage(3)} />
                    </TouchableOpacity>
                </View>

                {compressionTool ?
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
                    : null}

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

                <View style={{ flex: 1, marginBottom: RFPercentage(3), flexDirection: 'row', width: "90%", marginLeft: "5%", alignItems: "flex-end", justifyContent: 'center' }} >
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
        width: "100%",
        backgroundColor: "white"
    },
})

export default OCRScreen;