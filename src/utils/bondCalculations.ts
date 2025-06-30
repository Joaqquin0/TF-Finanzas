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
  
  // En el método americano, el capital se paga SOLO en el último período
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
      // Períodos normales: siempre se pagan intereses
      coupon = couponPayment;
      
      // MÉTODO AMERICANO: Capital solo en el último período
      if (period === maturityPeriods) {
        capitalPayment = nominalValue;
        outstandingBalance = 0;
      } else {
        capitalPayment = 0;
        // El saldo pendiente sigue siendo el valor nominal hasta el último período
      }
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
export const calculateTCEA = (bondData: BondData, cashFlow: CashFlowItem[], emissionPrice: number): number => {
  // TCEA es la TIR desde la perspectiva del emisor
  // Flujo del emisor: +Valor recibido inicialmente, -pagos futuros
  
  // Usamos el método de Newton-Raphson para encontrar la TIR del emisor
  let rate = 0.1; // Tasa inicial del 10%
  const tolerance = 1e-10;
  const maxIterations = 100;
  
  for (let i = 0; i < maxIterations; i++) {
    let npv = emissionPrice; // Flujo inicial positivo (el emisor recibe dinero)
    let npvDerivative = 0;
    
    cashFlow.forEach((item, index) => {
      const period = index + 1;
      const periodRate = rate / bondData.frequency;
      const factor = Math.pow(1 + periodRate, period);
      
      // VPN: resta los pagos que hace el emisor (flujos negativos para el emisor)
      npv -= item.totalPayment / factor;
      
      // Derivada del VPN respecto a la tasa
      npvDerivative += (period * item.totalPayment) / (bondData.frequency * factor * (1 + periodRate));
    });
    
    // Si el VPN es suficientemente pequeño, hemos encontrado la solución
    if (Math.abs(npv) < tolerance) break;
    
    // Actualizar la tasa usando Newton-Raphson
    rate = rate - npv / npvDerivative;
    
    // Evitar tasas negativas extremas
    if (rate < -0.99) rate = -0.99;
  }
  
  // Convertir la tasa periódica a efectiva anual
  return Math.pow(1 + rate / bondData.frequency, bondData.frequency) - 1;
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
export const calculateMaxMarketPrice = (cashFlow: CashFlowItem[], couponRate: number, frequency: number): number => {
  // El precio máximo del mercado se calcula usando la tasa cupón como tasa de descuento
  // Representa el escenario donde el mercado estaría dispuesto a pagar más (menor exigencia de rendimiento)
  return calculatePresentValue(cashFlow, couponRate, frequency);
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
  
  // TCEA: Costo para el emisor (asume emisión a valor nominal)
  const tcea = calculateTCEA(bondData, cashFlow, bondData.nominalValue);
  
  // TREA: Rendimiento para el inversionista (basado en precio de mercado)
  const trea = calculateTREA(cashFlow, presentValue, bondData.frequency);
  
  // Precio máximo del mercado usando la tasa cupón como descuento
  let effectiveCouponRate = bondData.couponRate;
  if (bondData.interestType === 'nominal' && bondData.capitalization) {
    effectiveCouponRate = nominalToEffective(bondData.couponRate, bondData.capitalization);
  }
  const maxMarketPrice = calculateMaxMarketPrice(cashFlow, effectiveCouponRate, bondData.frequency);
  
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
