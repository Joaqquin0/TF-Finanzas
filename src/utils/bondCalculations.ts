import type { BondData, CashFlowItem, BondResults } from '../types';

// Función para convertir tasa nominal a efectiva
export const nominalToEffective = (nominalRate: number, capitalization: number): number => {
  return Math.pow(1 + nominalRate / capitalization, capitalization) - 1;
};

// Función para convertir tasa efectiva a nominal
export const effectiveToNominal = (effectiveRate: number, capitalization: number): number => {
  return capitalization * (Math.pow(1 + effectiveRate, 1 / capitalization) - 1);
};

// Función para calcular el flujo de caja del bono americano
export const calculateAmericanBondCashFlow = (bondData: BondData): CashFlowItem[] => {
  const cashFlow: CashFlowItem[] = [];
  const { nominalValue, couponRate, maturityPeriods, frequency, gracePeriods, graceType } = bondData;
  
  // Calcular el cupón por período
  const couponPayment = (nominalValue * couponRate) / frequency;
  
  // Calcular el pago de capital por período (método americano)
  const capitalPaymentPerPeriod = nominalValue / maturityPeriods;
  
  let outstandingBalance = nominalValue;
  
  for (let period = 1; period <= maturityPeriods; period++) {
    let coupon = 0;
    let capitalPayment = 0;
    
    // Aplicar período de gracia
    if (period <= gracePeriods) {
      if (graceType === 'total') {
        // Gracia total: no se paga nada
        coupon = 0;
        capitalPayment = 0;
      } else if (graceType === 'partial') {
        // Gracia parcial: solo se pagan intereses
        coupon = couponPayment;
        capitalPayment = 0;
      }
    } else {
      // Períodos normales
      coupon = couponPayment;
      capitalPayment = capitalPaymentPerPeriod;
      outstandingBalance -= capitalPayment;
    }
    
    const totalPayment = coupon + capitalPayment;
    
    cashFlow.push({
      period,
      coupon,
      capitalPayment,
      totalPayment,
      outstandingBalance: Math.max(0, outstandingBalance),
    });
  }
  
  return cashFlow;
};

// Función para calcular el valor presente de los flujos de caja
export const calculatePresentValue = (cashFlow: CashFlowItem[], marketRate: number, frequency: number): number => {
  const periodRate = marketRate / frequency;
  return cashFlow.reduce((pv, item, index) => {
    const period = index + 1;
    return pv + item.totalPayment / Math.pow(1 + periodRate, period);
  }, 0);
};

// Función para calcular la duración
export const calculateDuration = (cashFlow: CashFlowItem[], marketRate: number, frequency: number, presentValue: number): number => {
  const periodRate = marketRate / frequency;
  const weightedTime = cashFlow.reduce((sum, item, index) => {
    const period = index + 1;
    const pv = item.totalPayment / Math.pow(1 + periodRate, period);
    return sum + (period * pv);
  }, 0);
  
  return (weightedTime / presentValue) / frequency; // Convertir a años
};

// Función para calcular la duración modificada
export const calculateModifiedDuration = (duration: number, marketRate: number, frequency: number): number => {
  return duration / (1 + marketRate / frequency);
};

// Función para calcular la convexidad
export const calculateConvexity = (cashFlow: CashFlowItem[], marketRate: number, frequency: number, presentValue: number): number => {
  const periodRate = marketRate / frequency;
  const convexitySum = cashFlow.reduce((sum, item, index) => {
    const period = index + 1;
    const pv = item.totalPayment / Math.pow(1 + periodRate, period);
    return sum + (period * (period + 1) * pv);
  }, 0);
  
  return (convexitySum / presentValue) / Math.pow(frequency, 2);
};

// Función para calcular TCEA (Tasa de Coste Efectivo Anual)
export const calculateTCEA = (bondData: BondData, emissionPrice: number): number => {
  const { nominalValue, maturityPeriods, frequency } = bondData;
  const yearsToMaturity = maturityPeriods / frequency;
  
  // TCEA = (Precio de Emisión / Valor Nominal)^(1/años) - 1
  // Representa el costo financiero anual para el emisor
  return Math.pow(emissionPrice / nominalValue, 1 / yearsToMaturity) - 1;
};

// Función para calcular TREA (Tasa de Rendimiento Efectivo Anual)
export const calculateTREA = (cashFlow: CashFlowItem[], investmentAmount: number, frequency: number): number => {
  // Usamos el método de Newton-Raphson para encontrar la TIR (Tasa Interna de Retorno)
  let rate = 0.1; // Tasa inicial del 10%
  const tolerance = 1e-10;
  const maxIterations = 100;
  
  for (let i = 0; i < maxIterations; i++) {
    // Calculamos el VPN y su derivada
    let npv = -investmentAmount; // Flujo inicial negativo (inversión)
    let npvDerivative = 0;
    
    cashFlow.forEach((item, index) => {
      const period = index + 1;
      const periodRate = rate / frequency;
      const factor = Math.pow(1 + periodRate, period);
      
      // VPN: suma de flujos descontados
      npv += item.totalPayment / factor;
      
      // Derivada del VPN respecto a la tasa
      npvDerivative -= (period * item.totalPayment) / (frequency * factor * (1 + periodRate));
    });
    
    // Si el VPN es suficientemente pequeño, hemos encontrado la solución
    if (Math.abs(npv) < tolerance) break;
    
    // Actualizar la tasa usando Newton-Raphson: x_{n+1} = x_n - f(x_n)/f'(x_n)
    rate = rate - npv / npvDerivative;
    
    // Evitar tasas negativas extremas
    if (rate < -0.99) rate = -0.99;
  }
  
  // Convertir la tasa periódica a efectiva anual
  return Math.pow(1 + rate / frequency, frequency) - 1;
};

// Función para calcular el precio máximo del mercado
export const calculateMaxMarketPrice = (cashFlow: CashFlowItem[], marketRate: number, frequency: number): number => {
  // El precio máximo es el valor presente usando la tasa de mercado
  return calculatePresentValue(cashFlow, marketRate, frequency);
};

// Función principal para calcular todos los resultados del bono
export const calculateBondResults = (bondData: BondData): BondResults => {
  // Ajustar tasa de mercado si es necesario
  let effectiveMarketRate = bondData.marketRate;
  if (bondData.interestType === 'nominal' && bondData.capitalization) {
    effectiveMarketRate = nominalToEffective(bondData.marketRate, bondData.capitalization);
  }
  
  const cashFlow = calculateAmericanBondCashFlow(bondData);
  const presentValue = calculatePresentValue(cashFlow, effectiveMarketRate, bondData.frequency);
  const duration = calculateDuration(cashFlow, effectiveMarketRate, bondData.frequency, presentValue);
  const modifiedDuration = calculateModifiedDuration(duration, effectiveMarketRate, bondData.frequency);
  const convexity = calculateConvexity(cashFlow, effectiveMarketRate, bondData.frequency, presentValue);
  
  // TCEA: Costo para el emisor (usa el precio de emisión = present value)
  const tcea = calculateTCEA(bondData, presentValue);
  
  // TREA: Rendimiento para el inversionista (TIR de los flujos)
  const trea = calculateTREA(cashFlow, presentValue, bondData.frequency);
  
  const maxMarketPrice = calculateMaxMarketPrice(cashFlow, effectiveMarketRate, bondData.frequency);
  
  return {
    cashFlow,
    presentValue,
    duration,
    modifiedDuration,
    convexity,
    tcea,
    trea,
    maxMarketPrice,
  };
};
