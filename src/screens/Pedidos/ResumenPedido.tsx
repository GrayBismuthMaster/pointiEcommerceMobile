import React, { useContext } from 'react'
import { Text } from 'react-native';
import PedidoContext from '../../context/pedidos/PedidoContext'
import ResumenProducto from './ResumenProducto';
const ResumenPedido = () => {
    //Context de Pedidos
    const pedidoContext = useContext(PedidoContext)
    const {productos}:any = pedidoContext;
    return (
        <>
            <Text >3.- Ajustar la cantidades del producto</Text>
            {
                productos.length > 0
                    ? 
                (
                        <>
                        {
                            productos.map((producto:any) => (
                                <ResumenProducto
                                    key = {producto.id}
                                    producto = {producto}
                                />
                            ))
                        }
                        </>
                )
                    :
                (
                    <>
                        <Text>No hay productos</Text>
                    </>
                )
            }
        </>
        
    )
}

export default ResumenPedido;