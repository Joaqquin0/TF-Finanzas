import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Save, AlertCircle } from 'lucide-react';

interface BondFormProps {
  bondId?: string;
  onClose: () => void;
  onSave: () => void;
}

const BondForm: React.FC<BondFormProps> = ({ bondId, onClose, onSave }) => {
  const { addBond, updateBond, getBond, config } = useApp();
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState({
    name: '',
    nominalValue: 1000,
    couponRate: 0.1,
    maturityPeriods: 12,
    frequency: 12,
    marketRate: 0.12,
    gracePeriods: 0,
    graceType: 'none' as 'total' | 'partial' | 'none',
    currency: config.currency,
    interestType: config.interestType,
    capitalization: config.capitalization,
  });

  useEffect(() => {
    if (bondId) {
      const bond = getBond(bondId);
      if (bond) {
        setFormData({
          name: bond.name,
          nominalValue: bond.nominalValue,
          couponRate: bond.couponRate,
          maturityPeriods: bond.maturityPeriods,
          frequency: bond.frequency,
          marketRate: bond.marketRate,
          gracePeriods: bond.gracePeriods,
          graceType: bond.graceType,
          currency: bond.currency,
          interestType: bond.interestType,
          capitalization: bond.capitalization || 12,
        });
      }
    }
  }, [bondId, getBond]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (formData.nominalValue <= 0) {
      newErrors.nominalValue = 'El valor nominal debe ser mayor a 0';
    }

    if (formData.couponRate < 0) {
      newErrors.couponRate = 'La tasa de cupón no puede ser negativa';
    }

    if (formData.maturityPeriods <= 0) {
      newErrors.maturityPeriods = 'Los períodos de vencimiento deben ser mayor a 0';
    }

    if (formData.marketRate < 0) {
      newErrors.marketRate = 'La tasa de mercado no puede ser negativa';
    }

    if (formData.gracePeriods < 0) {
      newErrors.gracePeriods = 'Los períodos de gracia no pueden ser negativos';
    }

    if (formData.gracePeriods >= formData.maturityPeriods) {
      newErrors.gracePeriods = 'Los períodos de gracia deben ser menores a los períodos totales';
    }

    if (formData.interestType === 'nominal' && formData.capitalization <= 0) {
      newErrors.capitalization = 'La capitalización debe ser mayor a 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (bondId) {
      updateBond(bondId, formData);
    } else {
      addBond(formData);
    }
    
    onSave();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nombre del bono */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del Bono *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ej: Bono Corporativo ABC"
              />
              {errors.name && (
                <div className="flex items-center mt-1 text-red-600">
                  <AlertCircle size={16} className="mr-1" />
                  <span className="text-sm">{errors.name}</span>
                </div>
              )}
            </div>

            {/* Valor nominal */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Valor Nominal *
              </label>
              <input
                type="number"
                name="nominalValue"
                value={formData.nominalValue}
                onChange={handleChange}
                min="0"
                step="0.01"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.nominalValue ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.nominalValue && (
                <div className="flex items-center mt-1 text-red-600">
                  <AlertCircle size={16} className="mr-1" />
                  <span className="text-sm">{errors.nominalValue}</span>
                </div>
              )}
            </div>

            {/* Tasa de cupón */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tasa de Cupón (decimal) *
              </label>
              <input
                type="number"
                name="couponRate"
                value={formData.couponRate}
                onChange={handleChange}
                min="0"
                step="0.001"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.couponRate ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ej: 0.10 para 10%"
              />
              {errors.couponRate && (
                <div className="flex items-center mt-1 text-red-600">
                  <AlertCircle size={16} className="mr-1" />
                  <span className="text-sm">{errors.couponRate}</span>
                </div>
              )}
            </div>

            {/* Períodos de vencimiento */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Períodos de Vencimiento *
              </label>
              <input
                type="number"
                name="maturityPeriods"
                value={formData.maturityPeriods}
                onChange={handleChange}
                min="1"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.maturityPeriods ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.maturityPeriods && (
                <div className="flex items-center mt-1 text-red-600">
                  <AlertCircle size={16} className="mr-1" />
                  <span className="text-sm">{errors.maturityPeriods}</span>
                </div>
              )}
            </div>

            {/* Frecuencia de pagos */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Frecuencia de Pagos *
              </label>
              <select
                name="frequency"
                value={formData.frequency}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={1}>Anual</option>
                <option value={2}>Semestral</option>
                <option value={4}>Trimestral</option>
                <option value={12}>Mensual</option>
              </select>
            </div>

            {/* Tasa de mercado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tasa de Mercado (decimal) *
              </label>
              <input
                type="number"
                name="marketRate"
                value={formData.marketRate}
                onChange={handleChange}
                min="0"
                step="0.001"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.marketRate ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ej: 0.12 para 12%"
              />
              {errors.marketRate && (
                <div className="flex items-center mt-1 text-red-600">
                  <AlertCircle size={16} className="mr-1" />
                  <span className="text-sm">{errors.marketRate}</span>
                </div>
              )}
            </div>

            {/* Períodos de gracia */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Períodos de Gracia
              </label>
              <input
                type="number"
                name="gracePeriods"
                value={formData.gracePeriods}
                onChange={handleChange}
                min="0"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.gracePeriods ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.gracePeriods && (
                <div className="flex items-center mt-1 text-red-600">
                  <AlertCircle size={16} className="mr-1" />
                  <span className="text-sm">{errors.gracePeriods}</span>
                </div>
              )}
            </div>

            {/* Tipo de gracia */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Gracia
              </label>
              <select
                name="graceType"
                value={formData.graceType}
                onChange={handleChange}
                disabled={formData.gracePeriods === 0}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              >
                <option value="none">Sin gracia</option>
                <option value="partial">Gracia parcial</option>
                <option value="total">Gracia total</option>
              </select>
            </div>

            {/* Moneda */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Moneda
              </label>
              <select
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="PEN">Soles (PEN)</option>
                <option value="USD">Dólares (USD)</option>
                <option value="EUR">Euros (EUR)</option>
              </select>
            </div>

            {/* Tipo de interés */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Interés
              </label>
              <select
                name="interestType"
                value={formData.interestType}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="effective">Efectiva</option>
                <option value="nominal">Nominal</option>
              </select>
            </div>

            {/* Capitalización (solo para tasa nominal) */}
            {formData.interestType === 'nominal' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Capitalización *
                </label>
                <select
                  name="capitalization"
                  value={formData.capitalization}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.capitalization ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value={1}>Anual</option>
                  <option value={2}>Semestral</option>
                  <option value={4}>Trimestral</option>
                  <option value={12}>Mensual</option>
                  <option value={360}>Diaria</option>
                </select>
                {errors.capitalization && (
                  <div className="flex items-center mt-1 text-red-600">
                    <AlertCircle size={16} className="mr-1" />
                    <span className="text-sm">{errors.capitalization}</span>
                  </div>
                )}
              </div>
            )}
          </div>          {/* Botones de acción */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors flex items-center"
            >
              <Save size={16} className="mr-2" />
              {bondId ? 'Actualizar' : 'Guardar'}
            </button>
          </div>
        </form>
  );
};

export default BondForm;
