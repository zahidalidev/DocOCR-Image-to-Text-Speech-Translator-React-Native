import axios from "axios"

import apiEndPoint from "../../config/api"

export const getTranslatedText = async (body) => {
    console.log(apiEndPoint)
    return await axios.post(`${apiEndPoint}/translate`, body)
}