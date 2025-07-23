'use client'

import { useEffect, useState } from 'react'
import { 
  Users, 
  CreditCard, 
  Calendar, 
  Plus, 
  Edit2, 
  DollarSign,
  Activity
} from 'lucide-react'
import { 
  fetchUsers, 
  fetchCuentas, 
  fetchCampanas, 
  updateSaldoCuenta, 
  toggleCampanaEstado as toggleCampana, 
  createCampana as createNewCampana,
  User,
  Cuenta,
  Campana
} from '../lib/supabase'

interface CampaignSubmitData {
  user_id: number
  nombre: string
  descripcion: string
  fecha_inicio: string
  fecha_fin: string
  lugar: string
  presupuesto: number
  estado: boolean
}

interface EditingState {
  isNew?: boolean
  [key: string]: unknown
}

interface CampaignModalProps {
  onClose: () => void
  onSubmit: (data: CampaignSubmitData) => void
}

function CampaignModal({ onClose, onSubmit }: CampaignModalProps) {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    fecha_inicio: '',
    fecha_fin: '',
    lugar: '',
    presupuesto: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<{[key: string]: string}>({})

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {}
    
    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es obligatorio'
    if (!formData.fecha_inicio) newErrors.fecha_inicio = 'La fecha de inicio es obligatoria'
    if (!formData.fecha_fin) newErrors.fecha_fin = 'La fecha de fin es obligatoria'
    if (!formData.lugar.trim()) newErrors.lugar = 'El lugar es obligatorio'
    if (!formData.presupuesto || parseFloat(formData.presupuesto) <= 0) {
      newErrors.presupuesto = 'El presupuesto debe ser mayor a 0'
    }
    
    // Validar que fecha_fin sea mayor que fecha_inicio
    if (formData.fecha_inicio && formData.fecha_fin && formData.fecha_fin <= formData.fecha_inicio) {
      newErrors.fecha_fin = 'La fecha de fin debe ser posterior a la fecha de inicio'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setIsSubmitting(true)
    
    try {
      const campanaData = {
        user_id: 3, // Admin user
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        fecha_inicio: formData.fecha_inicio,
        fecha_fin: formData.fecha_fin,
        lugar: formData.lugar,
        presupuesto: parseFloat(formData.presupuesto),
        estado: true
      }
      
      await onSubmit(campanaData)
    } catch (error) {
      console.error('Error al crear campaña:', error)
      alert('Error al crear la campaña. Por favor, inténtalo de nuevo.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData({...formData, [field]: value})
    // Limpiar error cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors({...errors, [field]: ''})
    }
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Nueva Campaña</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre *
            </label>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) => handleInputChange('nombre', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ingresa el nombre de la campaña"
            />
            {errors.nombre && <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              value={formData.descripcion}
              onChange={(e) => handleInputChange('descripcion', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="Describe brevemente la campaña"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha Inicio *
            </label>
            <input
              type="date"
              value={formData.fecha_inicio}
              onChange={(e) => handleInputChange('fecha_inicio', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.fecha_inicio && <p className="mt-1 text-sm text-red-600">{errors.fecha_inicio}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha Fin *
            </label>
            <input
              type="date"
              value={formData.fecha_fin}
              onChange={(e) => handleInputChange('fecha_fin', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.fecha_fin && <p className="mt-1 text-sm text-red-600">{errors.fecha_fin}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lugar *
            </label>
            <input
              type="text"
              value={formData.lugar}
              onChange={(e) => handleInputChange('lugar', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ubicación de la campaña"
            />
            {errors.lugar && <p className="mt-1 text-sm text-red-600">{errors.lugar}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Presupuesto *
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.presupuesto}
              onChange={(e) => handleInputChange('presupuesto', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0.00"
            />
            {errors.presupuesto && <p className="mt-1 text-sm text-red-600">{errors.presupuesto}</p>}
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creando...
              </>
            ) : (
              'Crear Campaña'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([])
  const [cuentas, setCuentas] = useState<Cuenta[]>([])
  const [campanas, setCampanas] = useState<Campana[]>([])
  const [activeTab, setActiveTab] = useState('users')
  const [loading, setLoading] = useState(true)
  const [editingItem, setEditingItem] = useState<EditingState | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [usersData, cuentasData, campanasData] = await Promise.all([
        fetchUsers(),
        fetchCuentas(),
        fetchCampanas()
      ])

      setUsers(usersData || [])
      setCuentas(cuentasData || [])
      setCampanas(campanasData || [])
    } catch (error) {
      console.error('Error loading data:', error)
      alert('Error al cargar los datos. Por favor, recarga la página.')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateSaldo = async (cuentaId: number, newSaldo: number) => {
    try {
      await updateSaldoCuenta(cuentaId, newSaldo)
      
      setCuentas(cuentas.map(cuenta => 
        cuenta.id === cuentaId ? { ...cuenta, saldo: newSaldo } : cuenta
      ))
      
      alert('Saldo actualizado correctamente')
    } catch (error) {
      console.error('Error updating saldo:', error)
      alert('Error al actualizar el saldo')
    }
  }

  const handleToggleCampana = async (campanaId: number, newEstado: boolean) => {
    try {
      await toggleCampana(campanaId, newEstado)
      
      setCampanas(campanas.map(campana => 
        campana.id === campanaId ? { ...campana, estado: newEstado } : campana
      ))
      
      alert('Estado de campaña actualizado')
    } catch (error) {
      console.error('Error updating campana:', error)
      alert('Error al actualizar la campaña')
    }
  }

  const handleCreateCampana = async (campanaData: CampaignSubmitData) => {
    try {
      // Convertir el presupuesto de string a number
      const campanaForDB = {
        ...campanaData,
        presupuesto: campanaData.presupuesto
      }
      
      const result = await createNewCampana(campanaForDB)
      
      if (result) {
        // Recargar datos para obtener la campaña recién creada
        await loadData()
        setEditingItem(null)
        alert('Campaña creada exitosamente')
      }
    } catch (error) {
      console.error('Error creating campana:', error)
      throw error // Re-lanzar el error para que el modal lo maneje
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mb-4"></div>
          <div className="text-xl text-gray-700">Cargando datos de Supabase...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">Panel de Administración Lukitas</h1>
            <div className="flex items-center space-x-4">
              <Activity className="h-8 w-8 text-green-600" />
              <span className="text-sm text-gray-600">Coordinador Admin</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Usuarios</p>
                <p className="text-2xl font-bold text-gray-900">{users.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <CreditCard className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Cuentas Activas</p>
                <p className="text-2xl font-bold text-gray-900">{cuentas.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Campañas Activas</p>
                <p className="text-2xl font-bold text-gray-900">{campanas.filter(c => c.estado).length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('users')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'users' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Usuarios y Cuentas
            </button>
            <button
              onClick={() => setActiveTab('campanas')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'campanas' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Campañas
            </button>
          </nav>
        </div>

        {/* Content */}
        {activeTab === 'users' && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Gestión de Usuarios y Lukitas</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Usuario
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cuenta
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Saldo Lukitas
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => {
                    const cuenta = cuentas.find(c => c.user_id === user.id)
                    return (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {user.nombre} {user.apellido}
                            </div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                            <div className="text-xs text-gray-400">{user.codigo_estudiante}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{cuenta?.numero_cuenta}</div>
                          <div className="text-xs text-gray-500">{cuenta?.estado}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 text-green-600 mr-1" />
                            <span className="text-sm font-medium text-gray-900">
                              {cuenta?.saldo?.toFixed(2) || '0.00'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => {
                              const newSaldo = prompt('Nuevo saldo de Lukitas:', cuenta?.saldo?.toString() || '0')
                              if (newSaldo && cuenta && !isNaN(parseFloat(newSaldo))) {
                                handleUpdateSaldo(cuenta.id, parseFloat(newSaldo))
                              }
                            }}
                            className="text-blue-600 hover:text-blue-900 mr-3"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'campanas' && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Gestión de Campañas</h2>
              <button
                onClick={() => setEditingItem({ isNew: true })}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nueva Campaña
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Campaña
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fechas
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Presupuesto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {campanas.map((campana) => (
                    <tr key={campana.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{campana.nombre}</div>
                          <div className="text-sm text-gray-500">{campana.descripcion}</div>
                          <div className="text-xs text-gray-400">{campana.lugar}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(campana.fecha_inicio).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(campana.fecha_fin).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 text-green-600 mr-1" />
                          <span className="text-sm font-medium text-gray-900">
                            {campana.presupuesto?.toFixed(2) || '0.00'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          campana.estado 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {campana.estado ? 'Activa' : 'Inactiva'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleToggleCampana(campana.id, !campana.estado)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal for New Campaign */}
        {editingItem && (
          <CampaignModal 
            onClose={() => setEditingItem(null)}
            onSubmit={handleCreateCampana}
          />
        )}
      </div>
    </div>
  )
}