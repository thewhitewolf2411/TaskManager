import Axios from "axios"
import config from "../config"

const { apiUrl } = config

export default Axios.create({
  baseURL: apiUrl,
  headers: { "Cache-Control": "no-store", Pragma: "no-cache", Expires: "0" },
  withCredentials: true,
})
