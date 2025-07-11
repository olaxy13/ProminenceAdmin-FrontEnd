import axios from "axios";

export const apiKit = axios.create({
  baseURL: "https://prominence-xn1b.onrender.com/",
  headers: {
      'Content-Type': 'application/json',
      "Access-Control-Allow-Origin": "*"
    },
    timeout: 50000,
});
export const apiKitForm = axios.create({
  baseURL: "https://prominence-xn1b.onrender.com/",
    timeout: 50000,
});