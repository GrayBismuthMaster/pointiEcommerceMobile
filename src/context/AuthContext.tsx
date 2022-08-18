import React, {createContext, useReducer, useEffect} from 'react'
import AsyncStorage  from '@react-native-async-storage/async-storage';

import dermatologiaApi from '../api/dermatologiaApi';
import { Usuario, LoginData, RegisterData } from '../interfaces/appInterfaces'
import { authReducer, AuthState } from './authReducer';
import { useMutation, gql } from '@apollo/client';
import jwt_decode from "jwt-decode";
const AUTENTICAR_USUARIO = gql`
    mutation autenticarUsuario($input:AutenticarInput)
    {
        autenticarUsuario(input:$input)
        {
            token
        }
    }
`;

type AuthContextProps = {
    errorMessage: string;
    token: string | null;
    user: Usuario | null;
    status : 'not-authenticated' | 'checking' | 'authenticated'  
    signUp : (registerData : RegisterData) => void
    signIn : (loginData: LoginData) => void
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
    
    const [autenticarUsuario] = useMutation(AUTENTICAR_USUARIO);


    const [state, dispatch] = useReducer(authReducer, authInitialState);
    useEffect(()=>{
        // if(state.token!==null){
        //     checkToken();
        // }
        // console.log(state);
        checkToken();
    },[])    
    //Verificar token 
    const checkToken = async() =>{
        const tokenVerificado = await AsyncStorage.getItem('token');
        const userVerificado = await AsyncStorage.getItem('user');
        console.log("token verificado")
        console.log(tokenVerificado)
        if(!tokenVerificado){
            return dispatch({type: 'notAuthenticated'})
        }
        dispatch({
            type: 'signUp',
            payload :{
                token: tokenVerificado, 
                user : userVerificado ? JSON.parse(userVerificado) : ''
            }
        })
        
    }


 
   const  signIn = async (obj : LoginData)=>{
        try{
            const {email, password} = obj
            const {data} = await autenticarUsuario({
                variables: {
                    input: {
                        email,
                        password
                    }
                }
            })
            console.log("entta");
            console.log(data)
            const {token} = data.autenticarUsuario;
            var decoded = jwt_decode(token);
            const {id,nombre, apellido} : any = decoded;
            const user = {
                id,  
                nombre,
                apellido,
                email
            }
            
            console.log('token', token);
            await AsyncStorage.setItem('token',token);
            await AsyncStorage.setItem('user',JSON.stringify(user));
            dispatch({
                type: 'signUp',
                payload :{
                    token ,
                    user
                }
            })

        }catch(error:any){
            console.log(error);
            const errorMessage = error.message;
            dispatch({type : 'addError', payload: errorMessage || 'información incorrecta'})
        }
   }
   const  signUp = async ({nombre, cedula, fecha_nacimiento, sexo, estado_civil, religion, ocupacion, lugar_nacimiento, residencia, domicilio, telefono, estado, imagen, username, email, password} : RegisterData)=> {
        try{
            const resp = await dermatologiaApi.post('/auth/signup', {nombre, cedula, fecha_nacimiento, sexo, estado_civil, religion, ocupacion, lugar_nacimiento, residencia, domicilio, telefono, estado, imagen, username, email, password})
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

    const logOut = async()=> {
        await AsyncStorage.removeItem('token');
        dispatch({type : 'logout'})
    };
    const removeError = ()=> {
        dispatch({type : 'removeError'});
    } 


    return (
        <AuthContext.Provider value = {{
            ...state,
             signUp,
             signIn,
             logOut, 
             removeError,
             status: state.status
        }}>
            {children}
        </AuthContext.Provider>
    )
}

