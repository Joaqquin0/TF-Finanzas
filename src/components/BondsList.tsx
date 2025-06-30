import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import BondForm from './BondForm';
import { calculateBondResults } from '../utils/bondCalculations';
import { Plus, Search, Filter, Calculator, Edit, Trash2, Eye } from 'lucide-react';

// Importación dinámica del componente BondResults
const BondResults = React.lazy(() => import('./BondResults'));

const BondsList: React.FC = () => {
  const { bonds, deleteBond } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editingBond, setEditingBond] = useState<string | undefined>();
  const [viewingResults, setViewingResults] = useState<string | undefined>();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCurrency, setFilterCurrency] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');

  // Filtrar bonos
  const filteredBonds = bonds.filter(bond => {
    const matchesSearch = bond.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCurrency = filterCurrency === 'all' || bond.currency === filterCurrency;
    const matchesType = filterType === 'all' || bond.interestType === filterType;
    
    return matchesSearch && matchesCurrency && matchesType;
  });

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

  const getGraceText = (bond: any) => {
    if (bond.gracePeriods === 0) return 'Sin gracia';
    const type = bond.graceType === 'total' ? 'Total' : 'Parcial';
    return `${bond.gracePeriods} períodos (${type})`;
  };
  if (viewingResults) {
    const bond = bonds.find(b => b.id === viewingResults);
    if (bond) {
      const results = calculateBondResults(bond);
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">Resultados del Bono</h1>
            <button
              onClick={() => setViewingResults(undefined)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              ← Volver a la Lista
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
          <h1 className="text-2xl font-bold text-gray-800">Gestión de Bonos</h1>
          <p className="text-gray-600 mt-1">Administre sus bonos corporativos</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <Plus size={20} className="mr-2" />
          Nuevo Bono
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar bonos por nombre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Currency Filter */}
          <div className="flex items-center space-x-2">
            <Filter size={20} className="text-gray-400" />
            <select
              value={filterCurrency}
              onChange={(e) => setFilterCurrency(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todas las monedas</option>
              <option value="PEN">Soles (PEN)</option>
              <option value="USD">Dólares (USD)</option>
              <option value="EUR">Euros (EUR)</option>
            </select>
          </div>

          {/* Interest Type Filter */}
          <div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todos los tipos</option>
              <option value="effective">Tasa Efectiva</option>
              <option value="nominal">Tasa Nominal</option>
            </select>
          </div>
        </div>

        {/* Results count */}
        <div className="mt-4 text-sm text-gray-600">
          Mostrando {filteredBonds.length} de {bonds.length} bonos
        </div>
      </div>

      {/* Bonds Grid */}
      {filteredBonds.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <Calculator className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            {bonds.length === 0 ? 'No hay bonos registrados' : 'No se encontraron bonos'}
          </h3>
          <p className="text-gray-600 mb-4">
            {bonds.length === 0 
              ? 'Comience creando su primer bono corporativo'
              : 'Intente modificar los filtros de búsqueda'
            }
          </p>
          {bonds.length === 0 && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Crear Primer Bono
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredBonds.map((bond) => (
            <div key={bond.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">{bond.name}</h3>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      bond.currency === 'PEN' ? 'bg-green-100 text-green-800' :
                      bond.currency === 'USD' ? 'bg-blue-100 text-blue-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {bond.currency}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleViewResults(bond.id)}
                      className="text-green-600 hover:text-green-800 transition-colors"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => {
                        setEditingBond(bond.id);
                        setShowForm(true);
                      }}
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteBond(bond.id)}
                      className="text-red-600 hover:text-red-800 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Bond Details */}
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Valor Nominal:</span>
                    <span className="text-sm font-medium">{formatCurrency(bond.nominalValue, bond.currency)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Tasa de Interés:</span>
                    <span className="text-sm font-medium">{formatPercentage(bond.couponRate)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Períodos:</span>
                    <span className="text-sm font-medium">{bond.maturityPeriods}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Frecuencia:</span>
                    <span className="text-sm font-medium">{getFrequencyText(bond.frequency)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Tasa Mercado:</span>
                    <span className="text-sm font-medium">{formatPercentage(bond.marketRate)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Gracia:</span>
                    <span className="text-sm font-medium">{getGraceText(bond)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Tipo Interés:</span>
                    <span className="text-sm font-medium">
                      {bond.interestType === 'effective' ? 'Efectiva' : 'Nominal'}
                    </span>
                  </div>
                  
                  {bond.interestType === 'nominal' && bond.capitalization && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Capitalización:</span>
                      <span className="text-sm font-medium">{bond.capitalization}/año</span>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    Creado: {new Date(bond.createdAt).toLocaleDateString('es-PE')}
                  </span>
                  <button
                    onClick={() => handleViewResults(bond.id)}
                    className="bg-blue-50 text-blue-600 px-3 py-1 rounded-md text-sm hover:bg-blue-100 transition-colors flex items-center"
                  >
                    <Calculator size={14} className="mr-1" />
                    Calcular
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Forms */}
      {showForm && (
        <BondForm
          bondId={editingBond}
          onClose={handleCloseForm}
          onSave={handleSaveForm}
        />
      )}
    </div>
  );
};

export default BondsList;
