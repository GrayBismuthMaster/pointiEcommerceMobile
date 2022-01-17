import React, {createContext, useReducer, useEffect} from 'react'
import AsyncStorage  from '@react-native-async-storage/async-storage';

import dermatologiaApi from '../api/dermatologiaApi';
import { Usuario, LoginResponse, LoginData } from '../interfaces/appInterfaces'
import { authReducer, AuthState } from './authReducer';
type AuthContextProps = {
    errorMessage: string;
    token: string | null;
    user: Usuario | null;
    status : 'checking' | 'authenticated' | 'not-authenticated'
    signUp : ()=> void
    signIn : (loginData: LoginData)=> void
    logOut : ()=> void
    removeError : ()=> void

}

const authInitialState : AuthState = {
    status : 'checking',
    token : null,
    user : null,
    errorMessage : ''
}

export const AuthContext = createContext({} as AuthContextProps);
export const AuthProvider = ({children} : any)=>{

    const [state, dispatch] = useReducer(authReducer, authInitialState);
    useEffect(()=>{
        checkToken();
    },[])    
    //Verificar token 
    const checkToken = async() =>{
        const tokenVerificado = await AsyncStorage.getItem('token');
       if(!tokenVerificado){
            return dispatch({type: 'notAuthenticated'})
        }
        const resp = await dermatologiaApi.get('/auth/verify')
        console.log("respuesta de verificacione de token ", resp.data);
        
        dispatch({
            type: 'signUp',
            payload :{
                token: tokenVerificado ,
                user : resp.data.user
            }
        })
        
    }


   const  signUp = async ()=> {
        
   }
   const  signIn = async (obj : LoginData)=>{
        try{
            const {email, password} = obj
            const resp = await dermatologiaApi.post('/auth/signin', {email, password})
            console.log(resp.data);
            const token = resp.data.token;
            const user = resp.data.datosUsuario;
            dispatch({
                type: 'signUp',
                payload :{
                    token ,
                    user
                }
            })

            await AsyncStorage.setItem('token',token);
        }catch(error:any){
            console.log(error);
            const errorMessage = error.message;
            dispatch({type : 'addError', payload: errorMessage || 'información incorrecta'})
        }
   }
    const logOut = ()=> {}
    const removeError = ()=> {
        dispatch({type : 'removeError'});


    } 
    return (
        <AuthContext.Provider value = {{
            ...state,
             signUp,
             signIn,
             logOut, 
             removeError
        }}>
            {children}
        </AuthContext.Provider>
    )
}

