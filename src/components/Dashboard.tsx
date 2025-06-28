import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import BondForm from './BondForm';
import { calculateBondResults } from '../utils/bondCalculations';
import { Plus, Calculator, Edit, Trash2, Eye, X } from 'lucide-react';

// Importación dinámica del componente BondResults
const BondResults = React.lazy(() => import('./BondResults'));

const Dashboard: React.FC = () => {
  const { bonds, deleteBond } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editingBond, setEditingBond] = useState<string | undefined>();
  const [viewingResults, setViewingResults] = useState<string | undefined>();

  const handleDeleteBond = (id: string) => {
    if (window.confirm('¿Está seguro de que desea eliminar este bono?')) {
      deleteBond(id);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingBond(undefined);
  };

  const handleSaveForm = () => {
    setShowForm(false);
    setEditingBond(undefined);
  };

  const handleViewResults = (bondId: string) => {
    setViewingResults(bondId);
  };

  const handleOpenNewBondForm = () => {
    setShowForm(true);
    setEditingBond(undefined);
  };

  const formatCurrency = (value: number, currency: string) => {
    const symbol = currency === 'PEN' ? 'S/.' : currency === 'USD' ? '$' : '€';
    return `${symbol} ${value.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(2)}%`;
  };

  const getFrequencyText = (frequency: number) => {
    switch (frequency) {
      case 1: return 'Anual';
      case 2: return 'Semestral';
      case 4: return 'Trimestral';
      case 12: return 'Mensual';
      default: return `${frequency}x/año`;
    }
  };

  // Si estamos viendo los resultados de un bono
  if (viewingResults) {
    const bond = bonds.find(b => b.id === viewingResults);
    if (bond) {
      const results = calculateBondResults(bond);
      return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              {/* Título y botón de volver - ahora en blanco/claro */}
              <h1 className="text-2xl font-bold text-white">Resultados del Bono</h1> {/* Cambiado a text-white */}
              <button
                  onClick={() => setViewingResults(undefined)}
                  className="px-4 py-2 text-gray-300 hover:text-white transition-colors" // Cambiado a text-gray-300
              >
                ← Volver al Dashboard
              </button>
            </div>
            <React.Suspense fallback={<div className="flex justify-center items-center h-64">
              <div className="spinner"></div>
            </div>}>
              <BondResults bondData={bond} results={results} />
            </React.Suspense>
          </div>
      );
    }
  }

  return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            {/* Título y subtítulo del Dashboard - ahora en blanco/claro */}
            <h1 className="text-2xl font-bold text-white">Dashboard de Bonos</h1> {/* Cambiado a text-white */}
            <p className="text-gray-300 mt-1">Sistema de cálculo de bonos corporativos - Método Americano</p> {/* Cambiado a text-gray-300 */}
          </div>
          <button
              onClick={handleOpenNewBondForm}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <Plus size={20} className="mr-2" />
            Nuevo Bono
          </button>
        </div>

        {/* Stats Cards - los fondos de las tarjetas son blancos, el texto se mantiene oscuro aquí */}
        {/* No cambiamos el texto dentro de las tarjetas ya que el fondo de las tarjetas es blanco, lo que es correcto */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Calculator className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Total Bonos</p>
                <p className="text-2xl font-bold text-gray-800">{bonds.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-green-600 font-bold">S/.</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Soles (PEN)</p>
                <p className="text-2xl font-bold text-gray-800">
                  {bonds.filter(b => b.currency === 'PEN').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-blue-600 font-bold">$</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Dólares (USD)</p>
                <p className="text-2xl font-bold text-gray-800">
                  {bonds.filter(b => b.currency === 'USD').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-purple-600 font-bold">€</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Euros (EUR)</p>
                <p className="text-2xl font-bold text-gray-800">
                  {bonds.filter(b => b.currency === 'EUR').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bonds Table */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            {/* Título de la tabla - se mantiene oscuro porque el fondo de la tabla es blanco */}
            <h2 className="text-lg font-semibold text-gray-800">Lista de Bonos</h2>
          </div>

          {/* Mensaje cuando no hay bonos - texto cambiado a blanco/claro */}
          {bonds.length === 0 ? (
              <div className="p-12 text-center">
                <Calculator className="h-16 w-16 text-gray-300 mx-auto mb-4" /> {/* Icono en gris claro */}
                <h3 className="text-lg font-medium text-white mb-2">No hay bonos registrados</h3> {/* Cambiado a text-white */}
                <p className="text-gray-300 mb-4">Comience creando su primer bono corporativo</p> {/* Cambiado a text-gray-300 */}
                <button
                    onClick={handleOpenNewBondForm}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Crear Primer Bono
                </button>
              </div>
          ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                  {/* Encabezados de la tabla - se mantienen oscuros porque el fondo de thead es gris claro */}
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nombre
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Valor Nominal
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tasa Cupón
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Períodos
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Frecuencia
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Moneda
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                  {/* Filas de la tabla - se mantienen oscuras porque el fondo de tbody es blanco */}
                  {bonds.map((bond) => (
                      <tr key={bond.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{bond.name}</div>
                          <div className="text-sm text-gray-500">
                            Creado: {new Date(bond.createdAt).toLocaleDateString('es-PE')}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(bond.nominalValue, bond.currency)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatPercentage(bond.couponRate)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {bond.maturityPeriods}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {getFrequencyText(bond.frequency)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          bond.currency === 'PEN' ? 'bg-green-100 text-green-800' :
                              bond.currency === 'USD' ? 'bg-blue-100 text-blue-800' :
                                  'bg-purple-100 text-purple-800'
                      }`}>
                        {bond.currency}
                      </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                                onClick={() => handleViewResults(bond.id)}
                                className="text-green-600 hover:text-green-900 transition-colors"
                                title="Ver resultados"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                                onClick={() => {
                                  setEditingBond(bond.id);
                                  setShowForm(true);
                                }}
                                className="text-blue-600 hover:text-blue-900 transition-colors"
                                title="Editar"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                                onClick={() => handleDeleteBond(bond.id)}
                                className="text-red-600 hover:text-red-900 transition-colors"
                                title="Eliminar"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                  ))}
                  </tbody>
                </table>
              </div>
          )}
        </div>

        {/* Modal Forms - el fondo del modal es bg-white, así que el texto oscuro está bien */}
        {showForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[9999]">
              <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b">
                  <h2 className="text-xl font-bold text-gray-800">
                    {editingBond ? 'Editar Bono' : 'Nuevo Bono'}
                  </h2>
                  <button
                      onClick={handleCloseForm}
                      className="text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>
                <div className="p-6">
                  <BondForm
                      bondId={editingBond}
                      onClose={handleCloseForm}
                      onSave={handleSaveForm}
                  />
                </div>
              </div>
            </div>
        )}
      </div>
  );
};

export default Dashboard;