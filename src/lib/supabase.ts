// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

// Tipos para las tablas principales
export interface User {
  id: number
  nombre: string
  apellido: string
  email: string
  codigo_estudiante?: string
  role_id: number
  activo: boolean
  empresa: string
  universidad: string
  created_at: string
}

export interface Cuenta {
  id: number
  user_id: number
  numero_cuenta: string
  saldo: number
  estado: string
  campanas_id?: number
  created_at: string
}

export interface Campana {
  id: number
  user_id: number
  nombre: string
  descripcion?: string
  fecha_inicio: string
  fecha_fin: string
  horario?: string
  lugar?: string
  nro_contacto?: string
  presupuesto?: number
  estado: boolean
  created_at: string
}

export interface Proveedor {
  id: number
  tipo_proveedor_id: number
  nombre: string
  email?: string
  telefono?: string
  estado: string
  created_at: string
}

export interface Producto {
  id: number
  proveedor_id: number
  tipo_producto_id: number
  codigo: string
  nombre: string
  precio: number
  stock: number
  estado: string
  imagen_url?: string
  created_at: string
}

export interface Transferencia {
  id: number
  cuenta_origen_id: number
  cuenta_destino_id: number
  fecha_transferencia: string
  monto: number
  estado: string
  created_at: string
}

export interface Venta {
  id: number
  cuenta_id: number
  fecha_venta: string
  total: number
  estado: string
  created_at: string
}

// Funciones útiles para el dashboard
export const fetchUsers = async () => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

export const fetchCuentas = async () => {
  const { data, error } = await supabase
    .from('cuentas')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

export const fetchCampanas = async () => {
  const { data, error } = await supabase
    .from('campanas')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

export const updateSaldoCuenta = async (cuentaId: number, nuevoSaldo: number) => {
  const { error } = await supabase
    .from('cuentas')
    .update({ saldo: nuevoSaldo })
    .eq('id', cuentaId)
  
  if (error) throw error
  return true
}

export const toggleCampanaEstado = async (campanaId: number, nuevoEstado: boolean) => {
  const { error } = await supabase
    .from('campanas')
    .update({ estado: nuevoEstado })
    .eq('id', campanaId)
  
  if (error) throw error
  return true
}

export const createCampana = async (campanaData: Partial<Campana>) => {
  const { data, error } = await supabase
    .from('campanas')
    .insert([campanaData])
    .select()
  
  if (error) throw error
  return data
}