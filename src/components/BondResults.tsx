import React from 'react';
import type { BondResults, BondData } from '../types';
import { TrendingUp, Clock, Target, DollarSign } from 'lucide-react';

interface BondResultsProps {
  bondData: BondData;
  results: BondResults;
}

const BondResults: React.FC<BondResultsProps> = ({ bondData, results }) => {
  const formatCurrency = (value: number) => {
    const symbol = bondData.currency === 'PEN' ? 'S/.' : bondData.currency === 'USD' ? '$' : '€';
    return `${symbol} ${value.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(4)}%`;
  };

  const getFrequencyText = (frequency: number) => {
    switch (frequency) {
      case 1: return 'Anual';
      case 2: return 'Semestral';
      case 4: return 'Trimestral';
      case 12: return 'Mensual';
      default: return `${frequency} veces por año`;
    }
  };

  const getGraceTypeText = (type: string) => {
    switch (type) {
      case 'total': return 'Gracia Total';
      case 'partial': return 'Gracia Parcial';
      default: return 'Sin Gracia';
    }
  };

  return (
    <div className="space-y-6">
      {/* Información del Bono */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Información del Bono</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-600">Nombre</p>
            <p className="font-medium">{bondData.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Valor Nominal</p>
            <p className="font-medium">{formatCurrency(bondData.nominalValue)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Tasa de Cupón</p>
            <p className="font-medium">{formatPercentage(bondData.couponRate)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Períodos</p>
            <p className="font-medium">{bondData.maturityPeriods}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Frecuencia</p>
            <p className="font-medium">{getFrequencyText(bondData.frequency)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Tasa de Mercado</p>
            <p className="font-medium">{formatPercentage(bondData.marketRate)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Períodos de Gracia</p>
            <p className="font-medium">{bondData.gracePeriods}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Tipo de Gracia</p>
            <p className="font-medium">{getGraceTypeText(bondData.graceType)}</p>
          </div>
        </div>
      </div>

      {/* Indicadores Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow p-6 text-white">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 mr-3" />
            <div>
              <p className="text-sm opacity-90">Precio del Bono</p>
              <p className="text-2xl font-bold">{formatCurrency(results.presentValue)}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow p-6 text-white">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 mr-3" />
            <div>
              <p className="text-sm opacity-90">TREA</p>
              <p className="text-2xl font-bold">{formatPercentage(results.trea)}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg shadow p-6 text-white">
          <div className="flex items-center">
            <Target className="h-8 w-8 mr-3" />
            <div>
              <p className="text-sm opacity-90">TCEA</p>
              <p className="text-2xl font-bold">{formatPercentage(results.tcea)}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg shadow p-6 text-white">
          <div className="flex items-center">
            <Clock className="h-8 w-8 mr-3" />
            <div>
              <p className="text-sm opacity-90">Duración</p>
              <p className="text-2xl font-bold">{results.duration.toFixed(4)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Métricas Adicionales */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Métricas Financieras</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600">{results.modifiedDuration.toFixed(4)}</p>
            <p className="text-sm text-gray-600 mt-1">Duración Modificada</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600">{results.convexity.toFixed(4)}</p>
            <p className="text-sm text-gray-600 mt-1">Convexidad</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-600">{formatCurrency(results.maxMarketPrice)}</p>
            <p className="text-sm text-gray-600 mt-1">Precio Máximo del Mercado</p>
          </div>
        </div>
      </div>

      {/* Tabla de Flujo de Caja */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Flujo de Caja - Método Americano</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Período
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cupón
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amortización
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pago Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Saldo Pendiente
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {results.cashFlow.map((item, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.period}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(item.coupon)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(item.capitalPayment)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatCurrency(item.totalPayment)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(item.outstandingBalance)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-100">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                  TOTAL
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                  {formatCurrency(results.cashFlow.reduce((sum, item) => sum + item.coupon, 0))}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                  {formatCurrency(results.cashFlow.reduce((sum, item) => sum + item.capitalPayment, 0))}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                  {formatCurrency(results.cashFlow.reduce((sum, item) => sum + item.totalPayment, 0))}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                  -
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BondResults;
