// Tipos de datos para la aplicación de bonos
export interface User {
  id: string;
  username: string;
  password: string;
  name: string;
}

export interface BondData {
  id: string;
  name: string;
  nominalValue: number; // Valor nominal
  couponRate: number; // Tasa de cupón
  maturityPeriods: number; // Número de períodos hasta vencimiento
  frequency: number; // Frecuencia de pagos (1=anual, 2=semestral, 4=trimestral, 12=mensual)
  marketRate: number; // Tasa de mercado
  gracePeriods: number; // Períodos de gracia
  graceType: 'total' | 'partial' | 'none'; // Tipo de gracia
  currency: 'PEN' | 'USD' | 'EUR';
  interestType: 'effective' | 'nominal';
  capitalization?: number; // Solo para tasa nominal
  createdAt: Date;
  updatedAt: Date;
}

export interface CashFlowItem {
  period: number;
  coupon: number;
  capitalPayment: number;
  totalPayment: number;
  outstandingBalance: number;
}

export interface BondResults {
  cashFlow: CashFlowItem[];
  presentValue: number; // Precio del bono
  duration: number; // Duración
  modifiedDuration: number; // Duración modificada
  convexity: number; // Convexidad
  tcea: number; // Tasa de Coste Efectivo Anual (emisor)
  trea: number; // Tasa de Rendimiento Efectivo Anual (inversor)
  maxMarketPrice: number; // Precio máximo del mercado
}

export interface AppConfig {
  currency: 'PEN' | 'USD' | 'EUR';
  interestType: 'effective' | 'nominal';
  capitalization: number;
}
