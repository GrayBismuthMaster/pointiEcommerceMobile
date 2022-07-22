import { gql, useMutation, useQuery } from '@apollo/client';
import React, { useState } from 'react'
import { Text, View, ScrollView, StyleSheet, Button, TextInput, Alert } from 'react-native';
import Icon  from 'react-native-vector-icons/MaterialIcons';
import { GradientBackground } from '../../components/GradientBackground';
import {useEffect} from 'react';
import { ModalScreen } from '../../components/Modal/ModalScreen';
import { Pedido } from '../../interfaces/appInterfaces';
import { AsignarCliente } from './AsignarCliente';
import AsignarProductos from './AsignarProductos';
const OBTENER_PEDIDOS = gql`
    query obtenerPedidosVendedor{
        obtenerPedidosVendedor{
            id
            pedido{
                id
                nombre
                cantidad
                precio
            }
            cliente{
                id
                nombre
                apellido
                email
                telefono
            }
            vendedor
            total
            estado
        }
    }
`


const NUEVO_PEDIDO = gql`
    mutation nuevoPedido($input : PedidoInput){
      nuevoPedido(input : $input){
        id
      }
    }    
`


const ACTUALIZAR_PEDIDO = gql`
    mutation actualizarPedido($id : ID!, $input : PedidoInput){
        actualizarPedido(id : $id, input : $input){
            estado 
        }
    }
`

const ELIMINAR_PEDIDO = gql `
    mutation eliminarPedido($id :ID!){
        eliminarPedido(id:$id) 
    }
`
export const PedidosScreen = () => {
    
    const [pedidos , setPedidos] = useState<Array<any>>([]);
    const [modalVisible, setModalVisible] = useState(false);
    //AGREGAR PRODUCTO
    const [confirmarAgregar, setConfirmarAgregar] = useState(false);
    const [nuevoPedido] = useMutation(NUEVO_PEDIDO, {
        update(cache, { data:{ nuevoPedido}}) {
            //Obtener el objeto de cach'e que deseamos actualizar 
            //Tomar una copia del cache
            const {obtenerPedidos }:any = cache.readQuery({query: OBTENER_PEDIDOS})
            //Reescribimos el caché 
            cache.writeQuery({
                query:OBTENER_PEDIDOS,
                data:{
                    //Actualizar la información 
                    obtenerPedidos:[...obtenerPedidos, nuevoPedido]
                }
            })
        }
    })

    //ELIMINAR PRODUCTO
    const [actionIcon, setActionIcon] = useState(false);
    const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
    const [confirmarEliminacion, setConfirmarEliminacion] = useState(false);
    const [eliminarPedidoDB] = useMutation(ELIMINAR_PEDIDO, {
        update(cache, { data:{ eliminarPedido}}) {
            //Obtener el objeto de cach'e que deseamos actualizar
            //Tomar una copia del cache
            const {obtenerPedidosVendedor }:any = cache.readQuery({query: OBTENER_PEDIDOS})
            //Reescribimos el caché
            cache.writeQuery({
                query: OBTENER_PEDIDOS,
                data:{
                    //Actualizar la información
                    obtenerPedidosVendedor: obtenerPedidosVendedor.filter((pedido : Pedido)  => pedido.id !== (pedidoSeleccionado as any).id)
                }
            })
        }
    })

    //ACTUALIZAR CLIENTE
    const [upActionIcon, setUpActionIcon] = useState(false);
    const [pedidoActualizar, setPedidoActualizar] = useState(null);
    const [confirmarUpdate, setConfirmarUpdate] = useState(false);
    //ACTUALIZAR CLIENTE
    const [actualizarPedidoDB] = useMutation(ACTUALIZAR_PEDIDO);


    const [datosPedido, setDatosPedido] = useState({
        nombre: '',
        precio: '',
        existencia: '',
    });
    const [tipoAccion, setTipoAccion] = useState('');
    
    const { data, loading, error } = useQuery(OBTENER_PEDIDOS);
    
    useEffect(() => {
        console.log(data);
        if(data === undefined){
            console.log('nulo')
            setPedidos([]);
        }else{
            if(data !==null){
                setPedidos(data.obtenerPedidosVendedor);
            }
        }
        // if(!data){
        //     setPedidos([]);
        // }else{
        //     
        // }
        return () => {
            setPedidos([]);
        }
    }
    ,[data]);

    useEffect(() => {
      console.log("Peiddo modificacod")
        console.log(pedidos)
      return () => {
        
      }
    }, [JSON.stringify(pedidos)])
    
    useEffect(() => {
        if(confirmarEliminacion){
            eliminarPedido();
            setConfirmarEliminacion(false);
            setTipoAccion('');
        }
        if(confirmarUpdate){
            actualizarProducto();
            setConfirmarUpdate(false);
            setTipoAccion('');
        }
        if(confirmarAgregar){
            agregarProducto();
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
        console.log("Nuevo delete de pedido", JSON.parse(e._dispatchInstances.memoizedProps.prop).id)
        setTipoAccion('eliminar');
        setPedidoSeleccionado(JSON.parse(e._dispatchInstances.memoizedProps.prop).id);
    }

    const updateActionIcon = (prop : any)=>{
        setUpActionIcon(!upActionIcon);
        setModalVisible(!modalVisible);
        setTipoAccion('editar');
        //NECESARIO ID DE VENDEDOR, id de cliente y estado
        // const {id, nombre, precio, existencia} = JSON.parse(prop._dispatchInstances.memoizedProps.prop);
        // setDatosPedido({
        //     nombre,
        //     precio : precio.toString(),
        //     existencia : existencia.toString()
        // })
        // setPedidoActualizar(id);
    }

    const eliminarPedido = async ()=>{
        try{
            await eliminarPedidoDB({
                variables:{
                    id: pedidoSeleccionado
                }
            })
            //Use omit to remove the prop
            let pedidosLocal = (pedidos as any).filter((pedido: any) => (pedido as any).id !== pedidoSeleccionado);
            setPedidos(pedidosLocal);
            Alert.alert('Eliminado', 'El producto ha sido eliminado correctamente');
        }
        catch(error){
            console.log(error);
        }
    }
    const actualizarProducto =  async ()=>{
        const {nombre, precio, existencia} = datosPedido;
        try{
            const {data} = await actualizarPedidoDB({
                variables:{
                  id : pedidoActualizar,
                  input : {
                    nombre,  
                    precio : parseFloat(precio),
                    existencia : parseInt(existencia)
                  }
                }
              })
              console.log("datos de respuesta de actualizar",data);
              if(data.actualizarPedido){
                //use edit to change the prop
                let pedidosLocal = pedidos.map((pedido)=>{
                    console.log("pedido", (pedido as any).id)
                    if((pedido as any).id === pedidoActualizar){
                        return {
                            ...pedido,
                            nombre: datosPedido.nombre,
                            precio : Number(datosPedido.precio),
                            existencia : Number(datosPedido.existencia),
                        }
                    }
                    return pedido;
                }
                );
        
                setPedidos(pedidosLocal);
                Alert.alert('Exito', 'Pedido actualizado correctamente');
              }
            
        }catch(error){
            console.log(error);
        }
    }

    const agregarProducto = async ()=>{
        
        const {nombre, precio, existencia} = datosPedido;
        const {data} = await nuevoPedido ({
            variables:{
                input:{
                    nombre,
                    precio : Number(precio),
                    existencia : Number(existencia),
                }
            }
        }) 
        //ID DEL CLIENTE RETORNADO DE LA BASE DE DATOS
        console.log(data.nuevoProducto)
        setPedidos([...pedidos, {...datosPedido, id: data.nuevoPedido.id}]);
        
        Alert.alert('Exito', 'Producto creado correctamente');
    }
  return (
    <GradientBackground> 
        <View style = {styles.mainContainer}>
            <ScrollView > 
                
                <Button title = "Agregar Pedido" onPress = {()=>{
                    setModalVisible(!modalVisible);
                    setTipoAccion('agregar');
                }}/>
                <ModalScreen visible = {modalVisible}>
                    {
                        tipoAccion === 'eliminar' 
                            ?
                        <>
                            <Text>Eliminar Pedido</Text>
                            <Text>¿Estas seguro que deseas eliminar este producto?</Text>
                            <Button
                                title="Eliminar"
                                onPress={() => setConfirmarEliminacion(!confirmarEliminacion)}
                            />
                        </>
                            :
                        tipoAccion === 'editar'
                            ?
                        <>
                            <Text style={{backgroundColor : 'green'}}>Editar Pedido</Text>
                            <TextInput style={{backgroundColor : 'green'}} placeholder='Nombre' value={datosPedido.nombre} onChangeText={(e)=>{setDatosPedido({...datosPedido, nombre : e})}}/>
                            <Button
                                title="Editar"
                                onPress={() => setConfirmarUpdate(!confirmarUpdate)}
                            />
                        </>
                            :
                        tipoAccion === 'agregar'
                            ?
                        <>
                            <Text style={{
                                backgroundColor : 'rgba(0,0,0,0.9)',
                                fontSize : 25,
                                marginVertical : 10
                            }}>
                                Agregar Pedido
                            </Text>
                            
                            <Text style={{
                                backgroundColor : 'rgba(0,0,0,0.9)',
                                fontSize : 15,
                                marginVertical : 10
                            }}>                       
                                1. Asigna un cliente al Pedido
                            </Text>
                                
                            <AsignarCliente/>
                            
                            <Text style={{
                                backgroundColor : 'rgba(0,0,0,0.9)',
                                fontSize : 15,
                                marginVertical : 10
                            }}>                       
                                2. Selecciona o busca los productos
                            </Text>
                             <AsignarProductos/>
                           <Button
                                title="Agregar"
                                onPress={() => setConfirmarAgregar(!confirmarAgregar)}
                            />
                        </>
                            :
                        <>
                        </>
                    }
                    
                </ModalScreen>
                <Text style= {styles.mainTitle}> PEDIDOS</Text>
                <View style = {styles.titlesContainer}>
                    <Text style = {styles.title}>Cliente</Text>
                    <Text style = {styles.title}>Resumen</Text>
                    <Text style = {styles.title}>Acciones</Text>
                </View>
                {
                    pedidos.length > 0
                        ?
                    pedidos.map((pedido :Pedido) => (
                    <View 
                        key={pedido.id}
                        style={styles.clienteContainer}
                    >
                        <View style = {styles.valuesContainer}>
                            <Text style={styles.value}>{pedido.cliente.nombre}
                                {'\n'}
                                {pedido.cliente.email}
                                {'\n'}
                                {pedido.cliente.telefono}
                                {'\n'}
                                {'\n'}
                                {'\n'}
                                Estado Pedido : {pedido.estado}
                            </Text>
                            <Text style={styles.value}>
                                {
                                pedido.pedido.map((producto : any)=>{
                                    return 'Producto : '+producto.nombre + '\n' 
                                    +'Cantidad : '+producto.cantidad + '\n' 
                                })
                                }
                                {'\n'}
                                {'\n'}
                                Total a Pagar : {pedido.total}

                            </Text>
                            <Text style={styles.value}>
                                {!actionIcon ? <Icon onPress={(e)=>{deleteActionIcon(e )}} name={"delete-outline"} size={22} color={"red"} prop = {JSON.stringify({id:pedido.id})}/> : <Icon onPress={(e)=>{deleteActionIcon(e )}} name={"delete"} size={22} color={"red"} prop = {JSON.stringify({id:pedido.id})} /> }
                                {!upActionIcon ? <Icon onPress={(e)=>{updateActionIcon(e )}} name={"update"} size={22} color={"yellow"} prop = {JSON.stringify({id:pedido.id, cliente : pedido.cliente, pedido : pedido.pedido, total: pedido.total, vendedor : pedido.vendedor})}/> : <Icon onPress={(e)=>{updateActionIcon(e )}} name={"done"} size={22} color={"yellow"}  prop = {JSON.stringify({id:pedido.id, cliente : pedido.cliente, pedido : pedido.pedido, total: pedido.total, vendedor : pedido.vendedor})} /> }
                            </Text>
                        </View>
                        
                    </View>
                    ))
                        :
                    <View>
                        <Text style= {styles.mainTitle}>No hay Pedidos</Text>
                    </View>
                }
            </ScrollView>
        </View>     
        
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
        color : 'red',
        alignSelf : 'center'
    },
    title: {
        fontWeight: 'bold',
        fontSize: 14,
        paddingHorizontal : '3%',
    },
    titlesContainer: {
        flex : 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: 'blue',
        
    },
    clienteContainer : {
        backgroundColor : 'red',
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
        backgroundColor : 'blue',
    },
    value : {
        flex: 1,
        fontSize : 10,
        marginHorizontal : '2%',

    },
})