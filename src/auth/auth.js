import jwtDecode from 'jwt-decode';
import AsyncStorage  from '@react-native-async-storage/async-storage';
const ACCESS_TOKEN_KEY = 'token';
const API_URL = 'http://localhost:9000';
const ISSERVER = typeof window === "undefined";

export async function getAccessToken() {
    return await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
  
}

export function getUser() {
    const token = getAccessToken();
    console.log("desde el getUser", token);
    if (!token) {
      return null;
    }
    return getUserFromToken(token);
  
}

export async function login(userId, password) {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({ userId, password }),
  });
  if (response.ok) {
    const { token } = await response.json();
    await AsyncStorage.setItem(ACCESS_TOKEN_KEY, token);
    return { id: userId };
  }
  return null;
}

export function logout() {
  AsyncStorage.removeItem(ACCESS_TOKEN_KEY);
}

function getUserFromToken(token) {
    console.log("desde el getUserFromToken", token);
    const jwtPayload = jwtDecode(token)
    console.log(jwtPayload.sub);
    return { usuario:{id: jwtPayload.sub} };

  
}
