import React, {useReducer} from 'react'
import PedidoContext from './PedidoContext'
import PedidoReducer from './PedidoReducer'
import {
    SELECCIONAR_CLIENTE,
    SELECCIONAR_PRODUCTO,
    CANTIDAD_PRODUCTOS, 
    ACTUALIZAR_TOTAL
} from '../../types'

const PedidoState = ({children}) =>{
    //State de Pedidos
    const initialState = {
        cliente : {},
        productos : [],
        total : 0
    }
    const [state, dispatch] = useReducer(PedidoReducer, initialState);
    const agregarCliente = (cliente) =>{
        dispatch({
            type : SELECCIONAR_CLIENTE, 
            payload : cliente
        })
    }
    const agregarProductos = (productosSeleccionados) =>{
        console.log("productos seleccionados en Pedido State",productosSeleccionados);
        console.log("productos seleccionados del state")
        console.log(state.productos);
        let nuevoState;
        if(state.productos.length > 0){
            //Tomar del segundo arreglo, una copia para asignarlo al primero
            nuevoState = productosSeleccionados.map(producto =>{
            const nuevoObjeto = state.productos.find(productoState => productoState.id === producto.id);
            return {...producto, ...nuevoObjeto};
        })
        }else{
            nuevoState = productosSeleccionados;
        }
        
        dispatch({
            type : SELECCIONAR_PRODUCTO,
            payload : nuevoState
        })
    }
    const cantidadProductos = (nuevoProducto : number)=>{
        console.log('cantidad de productos', nuevoProducto);
        dispatch({
            type : CANTIDAD_PRODUCTOS,
            payload : nuevoProducto
        });
    }

    const actualizarTotal = ()=>{
        dispatch({
            type : ACTUALIZAR_TOTAL
        })
    }
    return (
        <PedidoContext.Provider
            value={{
                cliente : state.cliente,
                productos : state.productos,
                total : state.total,
                agregarCliente,
                agregarProductos,
                cantidadProductos, 
                actualizarTotal
            }}
        >
            {children}
        </PedidoContext.Provider>
    )
}

export default PedidoState;