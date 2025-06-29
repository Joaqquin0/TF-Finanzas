import type { BondData, CashFlowItem } from '../types';

export const exportCashFlowToCSV = (
  bondData: BondData, 
  cashFlow: CashFlowItem[], 
  results: any
): void => {
  try {
    const headers = [
      'Período',
      'Cupón',
      'Pago de Capital',
      'Pago Total',
      'Saldo Pendiente'
    ];

    // Información del bono
    const bondInfo = [
      ['INFORMACIÓN DEL BONO'],
      ['Nombre', bondData.name],
      ['Valor Nominal', bondData.nominalValue.toString()],
      ['Tasa Cupón', `${(bondData.couponRate * 100).toFixed(4)}%`],
      ['Períodos', bondData.maturityPeriods.toString()],
      ['Frecuencia', bondData.frequency.toString()],
      ['Tasa de Mercado', `${(bondData.marketRate * 100).toFixed(4)}%`],
      ['Períodos de Gracia', bondData.gracePeriods.toString()],
      ['Tipo de Gracia', bondData.graceType],
      ['Moneda', bondData.currency],
      ['Tipo de Interés', bondData.interestType],
      ...(bondData.capitalization ? [['Capitalización', bondData.capitalization.toString()]] : []),
      [''],
    ];

    // Resultados principales
    const resultsInfo = [
      ['RESULTADOS FINANCIEROS'],
      ['TCEA (Costo Emisor)', results.tcea ? `${(results.tcea * 100).toFixed(4)}%` : 'N/A'],
      ['TREA (Rentabilidad Inversor)', results.trea ? `${(results.trea * 100).toFixed(4)}%` : 'N/A'],
      ['Precio del Bono', results.presentValue ? results.presentValue.toFixed(2) : 'N/A'],
      ['Precio Máximo Mercado', results.maxMarketPrice ? results.maxMarketPrice.toFixed(2) : 'N/A'],
      ['Duración', results.duration ? results.duration.toFixed(4) : 'N/A'],
      ['Duración Modificada', results.modifiedDuration ? results.modifiedDuration.toFixed(4) : 'N/A'],
      ['Convexidad', results.convexity ? results.convexity.toFixed(4) : 'N/A'],
      [''],
    ];

    // Tabla de flujo de caja
    const cashFlowTable = [
      ['FLUJO DE CAJA'],
      headers,
      ...cashFlow.map(item => [
        item.period.toString(),
        item.coupon.toFixed(2),
        item.capitalPayment.toFixed(2),
        item.totalPayment.toFixed(2),
        item.outstandingBalance.toFixed(2)
      ])
    ];

    // Combinar todas las secciones
    const csvContent = [
      ...bondInfo,
      ...resultsInfo,
      ...cashFlowTable
    ];

    // Convertir a CSV
    const csv = csvContent.map(row => 
      row.map(cell => 
        // Escapar comas y comillas en los valores
        typeof cell === 'string' && (cell.includes(',') || cell.includes('"')) 
          ? `"${cell.replace(/"/g, '""')}"` 
          : cell
      ).join(',')
    ).join('\n');

    // Crear y descargar el archivo
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `bono_${bondData.name.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
    }
  } catch (error) {
    console.error('Error exporting to CSV:', error);
    alert('Error al exportar a CSV. Por favor, intente nuevamente.');
  }
};

export const exportBondSummaryToCSV = (bonds: BondData[]): void => {
  try {
    const headers = [
      'Nombre',
      'Valor Nominal',
      'Tasa Cupón (%)',
      'Períodos',
      'Frecuencia',
      'Tasa Mercado (%)',
      'Períodos Gracia',
      'Tipo Gracia',
      'Moneda',
      'Tipo Interés',
      'Fecha Creación'
    ];

    const csvContent = [
      ['RESUMEN DE BONOS'],
      ['Fecha de Exportación', new Date().toLocaleString('es-PE')],
      ['Total de Bonos', bonds.length.toString()],
      [''],
      headers,
      ...bonds.map(bond => [
        bond.name,
        bond.nominalValue.toString(),
        (bond.couponRate * 100).toFixed(4),
        bond.maturityPeriods.toString(),
        bond.frequency.toString(),
        (bond.marketRate * 100).toFixed(4),
        bond.gracePeriods.toString(),
        bond.graceType,
        bond.currency,
        bond.interestType,
        new Date(bond.createdAt).toLocaleDateString('es-PE')
      ])
    ];

    const csv = csvContent.map(row => 
      row.map(cell => 
        typeof cell === 'string' && (cell.includes(',') || cell.includes('"')) 
          ? `"${cell.replace(/"/g, '""')}"` 
          : cell
      ).join(',')
    ).join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `resumen_bonos_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
    }
  } catch (error) {
    console.error('Error exporting summary to CSV:', error);
    alert('Error al exportar resumen a CSV. Por favor, intente nuevamente.');
  }
};
