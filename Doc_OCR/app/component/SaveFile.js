import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import * as Permissions from 'expo-permissions';

export const saveTextFile = async (latestText) => {
    const { status } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);

    let fileData = [];
    if (status === "granted") {
        let fileUri = FileSystem.documentDirectory + "DocOcrHistoryNew.txt";
        // await MediaLibrary.deleteAssetsAsync(fileUri)
        // const asset = await MediaLibrary.createAssetAsync(fileUri)
        // await MediaLibrary.createAlbumAsync("Download", asset, false)

        let info = await FileSystem.getInfoAsync(fileUri)

        if (info.exists) {
            let res = await FileSystem.readAsStringAsync(fileUri)

            await FileSystem.deleteAsync(fileUri)  // delete file to update

            let fileResponce = JSON.parse(res)
            fileData.push(...fileResponce)
        }

        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();
        today = mm + '/' + dd + '/' + yyyy;

        fileData.push({ "data": latestText, "date": today })

        let jsonData = JSON.stringify(fileData)
        await FileSystem.writeAsStringAsync(fileUri, jsonData);  // writing to file
    }
}

export const readTextFile = async (latestText) => {
    const { status } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);

    if (status === "granted") {
        let fileUri = FileSystem.documentDirectory + "DocOcrHistoryNew.txt";

        let info = await FileSystem.getInfoAsync(fileUri)

        if (info.exists) {
            let res = await FileSystem.readAsStringAsync(fileUri)
            return JSON.parse(res)
        }
    }
}


export const updateTextFile = async (latestText) => {
    const { status } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);

    if (status === "granted") {
        let fileUri = FileSystem.documentDirectory + "DocOcrHistoryNew.txt";

        let info = await FileSystem.getInfoAsync(fileUri)

        if (info.exists) {
            await FileSystem.deleteAsync(fileUri)  // delete file to update
        }

        let jsonData = JSON.stringify(latestText)
        await FileSystem.writeAsStringAsync(fileUri, jsonData);  // writing to file
    }
}
