// api/auth.js

import axios from "axios";

const API = axios.create({
  baseURL: "http://http://192.168.0.105/:5000/api/auth",
});

export const register = (data) => API.post("/register", data);
export const verifyRegisterOTP = (data) => API.post("/register/verify", data);

export const login = (data) => API.post("/login", data);
export const verifyLoginOTP = (data) => API.post("/login/verify", data);

export const deleteUser = (data) => API.delete("/delete", { data });
