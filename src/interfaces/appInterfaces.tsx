export interface LoginResponse {
    datosUsuario : Usuario ; 
    token: string;
}

export interface Usuario {
    _id : string;
    nombre: string;
    cedula : string;
    fecha_nacimiento : string;
    sexo : boolean;
    estado_civil : string;
    religion : string
    ocupacion : string
    lugar_nacimiento : string
    residencia : string
    domicilio : string 
    telefono : string 
    fecha_actual : string 
    estado : boolean
    imagen : string
    username : string 
    email : string

}

export interface LoginData {
    email : string;
    password : string
}



export interface RegisterData {
    nombre: string;
    cedula : string;
    fecha_nacimiento : string;
    sexo : boolean;
    estado_civil : string;
    religion : string
    ocupacion : string
    lugar_nacimiento : string
    residencia : string
    domicilio : string 
    telefono : string 
    estado : string
    imagen : string
    username : string 
    email : string
    password : string
}


/*
    INTERFAZ DE TRATAMIENTO
*/

export interface IdUsuario {
    _id: string;
    nombre: string;
    imagen: string;
}

export interface IdHistoriaClinica {
    _id: string;
    motivo_consulta: string;
    diagnostico: string;
    id_usuario: IdUsuario;
}

export interface Tratamiento {
    _id: string;
    nombre: string;
    descripcion: string;
    foto: string;
    fechaActual: Date;
    id_historia_clinica: IdHistoriaClinica;
}


export interface Cliente{
    id : string;
    nombre : string
    apellido : string
    empresa : string
    email : string
    telefono : string
}
export interface Producto{
    id : string;
    nombre : string
    precio : number
    existencia : number
}

export interface Pedido{
    id : string
    pedido : PedidoGrupo[]    
    cliente : Cliente
    vendedor : string
    total : string
    estado : EstadoPedido
}
export interface PedidoGrupo{
    id : string;
    cantidad : number;
    nombre : string;
    precio : number;
}
export enum EstadoPedido{
    PENDIENTE,
    COMPLETADO,
    CANCELADO 
}