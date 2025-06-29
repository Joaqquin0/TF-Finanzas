import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, BondData, AppConfig } from '../types';
import { 
  loadBondsFromLocalStorage, 
  saveBondsToLocalStorage, 
  loadConfigFromLocalStorage, 
  saveConfigToLocalStorage 
} from '../utils/localStorage';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

interface AppContextType {
  bonds: BondData[];
  config: AppConfig;
  addBond: (bond: Omit<BondData, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateBond: (id: string, bond: Partial<BondData>) => void;
  deleteBond: (id: string) => void;
  getBond: (id: string) => BondData | undefined;
  updateConfig: (config: Partial<AppConfig>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const AppContext = createContext<AppContextType | undefined>(undefined);

// Usuarios de ejemplo (en producción esto vendría de una base de datos)
const defaultUsers: User[] = [
  {
    id: '1',
    username: 'emisor',
    password: 'emisor123',
    name: 'Empresa Emisora',
    role: 'emisor',
  },
  {
    id: '2',
    username: 'inversor',
    password: 'inversor123',
    name: 'Inversor Demo',
    role: 'inversor',
  },
  {
    id: '3',
    username: 'admin',
    password: 'admin123',
    name: 'Administrador',
    role: 'emisor', // Admin tiene permisos de emisor
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Verificar si hay una sesión guardada
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (username: string, password: string): boolean => {
    const foundUser = defaultUsers.find(
      u => u.username === username && u.password === password
    );

    if (foundUser) {
      const userWithoutPassword = { ...foundUser, password: '' };
      setUser(userWithoutPassword);
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      return true;
    }

    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Cargar datos del localStorage al inicializar
  const [bonds, setBonds] = useState<BondData[]>(() => loadBondsFromLocalStorage());
  const [config, setConfig] = useState<AppConfig>(() => {
    const savedConfig = loadConfigFromLocalStorage();
    return savedConfig || {
      currency: 'PEN',
      interestType: 'effective',
      capitalization: 12,
    };
  });

  // Guardar bonos en localStorage cada vez que cambien
  useEffect(() => {
    saveBondsToLocalStorage(bonds);
  }, [bonds]);

  // Guardar configuración en localStorage cada vez que cambie
  useEffect(() => {
    saveConfigToLocalStorage(config);
  }, [config]);

  const saveBonds = (newBonds: BondData[]) => {
    setBonds(newBonds);
  };

  const saveConfig = (newConfig: AppConfig) => {
    setConfig(newConfig);
  };

  const addBond = (bondData: Omit<BondData, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newBond: BondData = {
      ...bondData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const newBonds = [...bonds, newBond];
    saveBonds(newBonds);
  };

  const updateBond = (id: string, updates: Partial<BondData>) => {
    const newBonds = bonds.map(bond =>
      bond.id === id
        ? { ...bond, ...updates, updatedAt: new Date() }
        : bond
    );
    saveBonds(newBonds);
  };

  const deleteBond = (id: string) => {
    const newBonds = bonds.filter(bond => bond.id !== id);
    saveBonds(newBonds);
  };

  const getBond = (id: string) => {
    return bonds.find(bond => bond.id === id);
  };

  const updateConfig = (updates: Partial<AppConfig>) => {
    const newConfig = { ...config, ...updates };
    saveConfig(newConfig);
  };

  const value = {
    bonds,
    config,
    addBond,
    updateBond,
    deleteBond,
    getBond,
    updateConfig,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
