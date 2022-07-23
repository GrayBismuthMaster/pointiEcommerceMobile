import { gql, useMutation, useQuery } from '@apollo/client';
import React, { useState } from 'react'
import { Text, View, ScrollView, StyleSheet, Button, TextInput, Alert } from 'react-native';
import Icon  from 'react-native-vector-icons/MaterialIcons';
import { GradientBackground } from '../../components/GradientBackground';
import {useEffect} from 'react';
import { ModalScreen } from '../../components/Modal/ModalScreen';
import { Cliente } from '../../interfaces/appInterfaces';
import { Fab } from '../../components/Fab';
const OBTENER_CLIENTES_USUARIO = gql`
      query obtenerClientesVendedor {
        obtenerClientesVendedor{
          id
          nombre
          apellido
          empresa
          email
          telefono
        }
      }
`;


const NUEVO_CLIENTE = gql `
    mutation nuevoCliente($input: ClienteInput){
        nuevoCliente(input: $input){
            id
            nombre 
            apellido
            empresa
            email
            telefono
        }
    }
`;


const ACTUALIZAR_CLIENTE = gql `
  mutation actualizarCliente($id : ID!, $input : ClienteInput){
    actualizarCliente(id: $id, input : $input){
      nombre
      email
    }
  }
`

const ELIMINAR_CLIENTE = gql `
    mutation eliminarCliente($id :ID!){
        eliminarCliente(id:$id) 
    }
`
export const ClientesScreen = () => {
    
    const [clientesVendedor , setClientesVendedor] = useState<Array<any>>([]);
    const [modalVisible, setModalVisible] = useState(false);
    //AGREGAR CLIENTE
    const [confirmarAgregar, setConfirmarAgregar] = useState(false);
    const [nuevoCliente] = useMutation(NUEVO_CLIENTE, {
        update(cache, { data:{ nuevoCliente}}) {
            //Obtener el objeto de cach'e que deseamos actualizar 
            //Tomar una copia del cache
            const {obtenerClientesVendedor }:any = cache.readQuery({query: OBTENER_CLIENTES_USUARIO})
            //Reescribimos el caché 
            cache.writeQuery({
                query:OBTENER_CLIENTES_USUARIO,
                data:{
                    //Actualizar la información 
                    obtenerClientesVendedor:[...obtenerClientesVendedor, nuevoCliente]
                }
            })
        }
    })

    //ELIMINAR CLIENTE
    const [actionIcon, setActionIcon] = useState(false);
    const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
    const [confirmarEliminacion, setConfirmarEliminacion] = useState(false);
    const [eliminarClienteDB] = useMutation(ELIMINAR_CLIENTE, {
        update(cache, { data:{ eliminarCliente}}) {
            //Obtener el objeto de cach'e que deseamos actualizar
            //Tomar una copia del cache
            const {obtenerClientesVendedor }:any = cache.readQuery({query: OBTENER_CLIENTES_USUARIO})
            //Reescribimos el caché
            cache.writeQuery({
                query:OBTENER_CLIENTES_USUARIO,
                data:{
                    //Actualizar la información
                    obtenerClientesVendedor:obtenerClientesVendedor.filter((cliente : Cliente)  => cliente.id !== (clienteSeleccionado as any).id)
                }
            })
        }
    })

    //ACTUALIZAR CLIENTE
    const [upActionIcon, setUpActionIcon] = useState(false);
    const [clienteActualizar, setClienteActualizar] = useState(null);
    const [confirmarUpdate, setConfirmarUpdate] = useState(false);
    //ACTUALIZAR CLIENTE
    const [actualizarClienteDB] = useMutation(ACTUALIZAR_CLIENTE);


    const [datosCliente, setDatosCliente] = useState({
        nombre: '',
        apellido: '',
        empresa: '',
        email: '',
        telefono : ''
    });
    const [tipoAccion, setTipoAccion] = useState('');

    const { data, loading, error } = useQuery(OBTENER_CLIENTES_USUARIO);
    useEffect(() => {
        if(data){
            setClientesVendedor(data.obtenerClientesVendedor);
        }
        return () => {
            setClientesVendedor([]);
        }
    }
    ,[data]);

    useEffect(() => {
      console.log("Cleintes vendedor modificacod")
        console.log(clientesVendedor)
      return () => {
        
      }
    }, [JSON.stringify(clientesVendedor)])
    
    useEffect(() => {
        if(confirmarEliminacion){
            eliminarCliente();
            setConfirmarEliminacion(false);
            setTipoAccion('');
        }
        if(confirmarUpdate){
            actualizarCliente();
            setConfirmarUpdate(false);
            setTipoAccion('');
        }
        if(confirmarAgregar){
            agregarCliente();
            setConfirmarAgregar(false);
            setTipoAccion('');
        }
      return () => {
        
      }
    }, [confirmarEliminacion, confirmarUpdate, confirmarAgregar])
    

    if(loading) return <Text>Cargando...</Text>;
    console.log(data);
    
    
    const deleteActionIcon = (e : any)=>{
        setActionIcon(!actionIcon)
        setModalVisible(!modalVisible);
        console.log("Nuevo delete", JSON.parse(e._dispatchInstances.memoizedProps.prop).id)
        setTipoAccion('eliminar');
        setClienteSeleccionado(JSON.parse(e._dispatchInstances.memoizedProps.prop).id);
    }

    const updateActionIcon = (prop : any)=>{
        setUpActionIcon(!upActionIcon);
        setModalVisible(!modalVisible);
        setTipoAccion('editar');
        const {id, nombre, apellido, empresa, email, telefono} = JSON.parse(prop._dispatchInstances.memoizedProps.prop);
        setDatosCliente({
            nombre,
            apellido,
            empresa,
            email,
            telefono
        })
        setClienteActualizar(id);
    }

    const eliminarCliente = async ()=>{
        try{
            await eliminarClienteDB({
                variables:{
                    id: clienteSeleccionado
                }
            })
            //Use omit to remove the prop
            clientesVendedor.map((cliente)=>{
                console.log("cliente", (cliente as any).id)
            });
            let clientes = clientesVendedor.filter(cliente => (cliente as any).id !== clienteSeleccionado);
            setClientesVendedor(clientes);
            Alert.alert('Eliminado', 'El cliente ha sido eliminado correctamente');
        }
        catch(error){
            console.log(error);
        }
        
    }
    const actualizarCliente =  async ()=>{
        const {nombre, apellido, empresa, email, telefono} = datosCliente;
        try{
            const {data} = await actualizarClienteDB({
                variables:{
                  id : clienteActualizar,
                  input : {
                    nombre, 
                    apellido, 
                    empresa, 
                    email,
                    telefono
                  }
                }
              })
              console.log(data);
              if(data.actualizarCliente){
                //use edit to change the prop
                let clientes = clientesVendedor.map((cliente)=>{
                    console.log("cliente", (cliente as any).id)
                    if((cliente as any).id === clienteActualizar){
                        return {
                            ...cliente,
                            nombre: datosCliente.nombre,
                            apellido : datosCliente.apellido,
                            empresa : datosCliente.empresa,
                            email : datosCliente.email,
                            telefono : datosCliente.telefono
                        }
                    }
                    return cliente;
                }
                );
        
                setClientesVendedor(clientes);
                Alert.alert('Exito', 'Cliente actualizado correctamente');
              }
            
        }catch(error){
            console.log(error);
        }
    }

    const agregarCliente = async ()=>{
        
        const {nombre, apellido, empresa, email, telefono} = datosCliente;
        const {data} = await nuevoCliente ({
            variables:{
                input:{
                    nombre,
                    apellido,
                    empresa,
                    email,
                    telefono
                }
            }
        }) 
        //ID DEL CLIENTE RETORNADO DE LA BASE DE DATOS
        console.log(data.nuevoCliente)
        setClientesVendedor([...clientesVendedor, {...datosCliente, id: data.nuevoCliente.id}]);
        
        Alert.alert('Exito', 'Cliente creado correctamente');
    }


    const presionado = ()=>{
            console.log("Presionado")
            setModalVisible(!modalVisible);
            setTipoAccion('agregar');
        
    }
  return (
    <GradientBackground> 
        <View style = {styles.mainContainer}>
            
            <ScrollView > 
                
                {/* <Button title = "Agregar Cliente" /> */}
                <ModalScreen visible = {modalVisible}>
                    {
                        tipoAccion === 'eliminar' 
                            ?
                        <>
                            <Text>Eliminar Cliente</Text>
                            <Text>¿Estas seguro que deseas eliminar este cliente?</Text>
                            <Button
                                title="Eliminar"
                                onPress={() => setConfirmarEliminacion(!confirmarEliminacion)}
                            />
                        </>
                            :
                        tipoAccion === 'editar'
                            ?
                        <View style ={styles.modalContainer}>
                            <Text style={styles.modalTitle}>Editar Cliente</Text>
                            <TextInput placeholder='Nombre' value={datosCliente.nombre} onChangeText={(e)=>{setDatosCliente({...datosCliente, nombre : e})}}/>
                            <TextInput placeholder='Apellido' value={datosCliente.apellido} onChangeText={(e)=>{setDatosCliente({...datosCliente, apellido : e})}}/>
                            <TextInput placeholder='Empresa' value={datosCliente.empresa} onChangeText={(e)=>{setDatosCliente({...datosCliente, empresa : e})}}/>
                            <TextInput placeholder='Email' value={datosCliente.email} onChangeText={(e)=>{setDatosCliente({...datosCliente, email : e})}}/>
                            <TextInput placeholder='Telefono' value={datosCliente.telefono} onChangeText={(e)=>{setDatosCliente({...datosCliente, telefono : e})}}/>
                            <Button
                                title="Editar"
                                onPress={() => setConfirmarUpdate(!confirmarUpdate)}
                            />
                        </View>
                            :
                        tipoAccion === 'agregar'
                            ?
                        <View style= {styles.modalContainer}>
                            <Text style={styles.modalTitle}>Agregar Cliente</Text>
                            <TextInput placeholder='Nombre' value={datosCliente.nombre} onChangeText={(e)=>{setDatosCliente({...datosCliente, nombre : e})}}/>
                            <TextInput placeholder='Apellido' value={datosCliente.apellido} onChangeText={(e)=>{setDatosCliente({...datosCliente, apellido : e})}}/>
                            <TextInput placeholder='Empresa' value={datosCliente.empresa} onChangeText={(e)=>{setDatosCliente({...datosCliente, empresa : e})}}/>
                            <TextInput placeholder='Email' value={datosCliente.email} onChangeText={(e)=>{setDatosCliente({...datosCliente, email : e})}}/>
                            <TextInput placeholder='Telefono' value={datosCliente.telefono} onChangeText={(e)=>{setDatosCliente({...datosCliente, telefono : e})}}/>
                            <Button
                                title="Agregar"
                                onPress={() => setConfirmarAgregar(!confirmarAgregar)}
                            />
                        </View>
                            :
                        <>
                        </>
                    }
                    
                </ModalScreen>
                <Text style= {styles.mainTitle}> CLIENTES</Text>
                <View style = {styles.titlesContainer}>
                    <Text style = {styles.title}>Nombre</Text>
                    <Text style = {styles.title}>Apellido</Text>
                    <Text style = {styles.title}>Empresa</Text>
                    <Text style = {styles.title}>Email</Text>
                    <Text style = {styles.title}>Telefono</Text>
                    <Text style = {styles.title}>Accion</Text>
                </View>
                {
                    clientesVendedor.length > 0
                        ?
                    clientesVendedor.map((cliente :any) => (
                    <View 
                        key={cliente.id}
                        style={styles.clienteContainer}
                    >
                        <View style = {styles.valuesContainer}>
                            <Text style={styles.value}>{cliente.nombre}</Text>
                            <Text style={styles.value}>{cliente.apellido}</Text>
                            <Text style={styles.value}>{cliente.empresa}</Text>
                            <Text style={styles.value}>{cliente.email}</Text>
                            <Text style={styles.value}>{cliente.telefono}</Text>
                            <Text style={styles.value}>
                                {!actionIcon ? <Icon onPress={(e)=>{deleteActionIcon(e )}} name={"delete-outline"} size={22} color={"red"} prop = {JSON.stringify({id:cliente.id})}/> : <Icon onPress={(e)=>{deleteActionIcon(e )}} name={"delete"} size={22} color={"red"} prop = {JSON.stringify({id:cliente.id})} /> }
                                {!upActionIcon ? <Icon onPress={(e)=>{updateActionIcon(e )}} name={"update"} size={22} color={"yellow"} prop = {JSON.stringify({id:cliente.id, nombre : cliente.nombre, apellido : cliente.apellido, empresa : cliente.empresa, email : cliente.email, telefono : cliente.telefono})}/> : <Icon onPress={(e)=>{updateActionIcon(e )}} name={"done"} size={22} color={"yellow"}  prop = {JSON.stringify({id:cliente.id, nombre : cliente.nombre, apellido : cliente.apellido, empresa : cliente.empresa, email : cliente.email, telefono : cliente.telefono})} /> }
                            </Text>
                        </View>
                        
                    </View>
                    ))
                        :
                    <View>
                        <Text style= {styles.mainTitle}>No hay clientes</Text>
                    </View>
                }
            </ScrollView>
        </View>     
        
        <Fab title='+' position='right' onPress={presionado}/>
    </GradientBackground>
  )
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    mainTitle : {
        fontSize: 30,
        fontWeight: 'bold',
        marginVertical : '8%',
        color : 'rgba(0,0,0,0.8)',
        alignSelf : 'center'
    },
    title: {
        fontWeight: 'bold',
        fontSize: 14,
        paddingHorizontal : '3%',
        color : 'rgba(255,255,255,0.8)',
    },
    titlesContainer: {
        flex : 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.8)',
        marginHorizontal : '2%',
        
    },
    clienteContainer : {
        flex : 1,
        marginVertical : '3%',
        justifyContent : 'center',
        alignItems : 'center',
    },
    valuesContainer : {
        // flex : 5,
        width : '95%',
        flexDirection : 'row',
        justifyContent : 'space-around',
        alignItems : 'center',
        backgroundColor : 'rgba(255,255,255,0.8)',
    },
    value : {
        flex: 1,
        fontSize : 10,
        marginHorizontal : '2%',
        color : 'rgba(0,0,0,0.8)',
    },
    modalContainer : {
        width : '90%',
        height : '80%',
        backgroundColor : 'rgba(0,0,0,0.8)',
    },
    modalTitle : {
        fontSize : 20,
        fontWeight : 'bold',
        color : 'rgba(255,255,255,0.8)',
        marginVertical : '3%',
        marginHorizontal : '3%',
        alignSelf : 'center'
    }
})