import 'react-native-gesture-handler'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { AuthProvider } from './src/context/AuthContext'
import { StackNavigator } from './src/Navigation/StackNavigator'
import { ApolloClient, InMemoryCache, ApolloProvider, HttpLink, split} from '@apollo/client';
import {setContext} from '@apollo/client/link/context'
import AsyncStorage  from '@react-native-async-storage/async-storage';
import PedidoState from './src/context/pedidos/PedidoState'
import PushNotification from 'react-native-push-notification'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient as createWsClient } from 'graphql-ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { Kind, OperationTypeNode } from 'graphql';

PushNotification.createChannel(
  {
    channelId: "1", // (required)
    channelName: "My channel", // (required)
    channelDescription: "A channel to categorise your notifications", // (optional) default: undefined.
    soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
    importance: 4, // (optional) default: 4. Int value of the Android notification importance
    vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
  },
  (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.);
)
  const App = () => {
  

  return (
    /*
    <HolaMundoScreen/>
    <CounterScreen/>
    <BoxObjectModelScreen/>
    <DimensionesScreen/>
    <PositionScreen/>
      <FlexScreen/>
      <TareaScreen/>
      <StatusBar
        backgroundColor='black'
        barStyle='light-content'
      />
       <CalculadoraScreen/>
      <SafeAreaView >
      <Text>asdsad</Text>
      </SafeAreaView>
      
      <StackNavigator/>
      
        <MenuHomeNavigation/>
      <HomeNavigator/>
    */
    <NavigationContainer>
      <AppState>
        
        <StackNavigator/>
      </AppState>
    </NavigationContainer>
  );
}
const AppState = ({children}:any) =>{
  

 
const httpLink = new HttpLink({
  uri: 'http://192.168.100.34:9000/graphql',
});

const wsLink =
    new GraphQLWsLink(createWsClient({
        url: 'ws://192.168.100.34:9000/graphql',
        // connectionParams: () => ({ accessToken: getAccessToken() }),
    }))



function isSubscription({ query } : any) {
    const definition = getMainDefinition(query);
    return definition.kind === Kind.OPERATION_DEFINITION
        && definition.operation === OperationTypeNode.SUBSCRIPTION;
}

  // Initialize Apollo Client
  const authLink = setContext( async (_,{headers}) => {
    console.log('headers',headers);
    //Leer el storage almacenado
    const token = await AsyncStorage.getItem('token');
    console.log("token en el contexto")
    console.log(token);
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : ''
        }
    }
});


  
const client = new ApolloClient({
  // сonnectToDevTools: true,
  cache: new InMemoryCache(),
  link: split(isSubscription, wsLink, authLink.concat(httpLink) )

    
});
  return(
    <ApolloProvider client={client}>
      <AuthProvider>
        <PedidoState> 
          {children}
        </PedidoState>
      </AuthProvider>
    </ApolloProvider>
  )  
}

export default App;
