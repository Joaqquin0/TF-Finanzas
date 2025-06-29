import type { BondData, AppConfig } from '../types';

// Claves para LocalStorage
export const localStorageKeys = {
  BONDS: 'finanzas_bonds',
  CONFIG: 'finanzas_config'
} as const;

// Funciones para gestionar bonos en LocalStorage
export const saveBondsToLocalStorage = (bonds: BondData[]): void => {
  try {
    localStorage.setItem(localStorageKeys.BONDS, JSON.stringify(bonds));
  } catch (error) {
    console.error('Error saving bonds to localStorage:', error);
  }
};

export const loadBondsFromLocalStorage = (): BondData[] => {
  try {
    const saved = localStorage.getItem(localStorageKeys.BONDS);
    if (!saved) return [];
    
    const bonds = JSON.parse(saved);
    // Convertir strings de fecha de vuelta a objetos Date
    return bonds.map((bond: any) => ({
      ...bond,
      createdAt: new Date(bond.createdAt),
      updatedAt: new Date(bond.updatedAt)
    }));
  } catch (error) {
    console.error('Error loading bonds from localStorage:', error);
    return [];
  }
};

// Funciones para gestionar configuración en LocalStorage
export const saveConfigToLocalStorage = (config: AppConfig): void => {
  try {
    localStorage.setItem(localStorageKeys.CONFIG, JSON.stringify(config));
  } catch (error) {
    console.error('Error saving config to localStorage:', error);
  }
};

export const loadConfigFromLocalStorage = (): AppConfig | null => {
  try {
    const saved = localStorage.getItem(localStorageKeys.CONFIG);
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.error('Error loading config from localStorage:', error);
    return null;
  }
};

// Función para limpiar localStorage (útil para reset)
export const clearLocalStorage = (): void => {
  try {
    localStorage.removeItem(localStorageKeys.BONDS);
    localStorage.removeItem(localStorageKeys.CONFIG);
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
};

// Función para exportar datos (backup)
export const exportLocalStorageData = () => {
  try {
    const bonds = loadBondsFromLocalStorage();
    const config = loadConfigFromLocalStorage();
    
    const exportData = {
      bonds,
      config,
      exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `finanzas_backup_${new Date().toISOString().split('T')[0]}.json`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error exporting data:', error);
  }
};
