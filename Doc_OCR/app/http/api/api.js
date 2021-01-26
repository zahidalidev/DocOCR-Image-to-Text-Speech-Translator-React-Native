import axios from "axios"

import apiEndPoint from "../../config/api"

export const getTranslatedText = async (body) => {
    return await axios.post(`${apiEndPoint}/translate`, body)
}

export const scanText = async (data, lang) => {
    return await axios.post(`${apiEndPoint}/ocr/${lang}`, data)
}