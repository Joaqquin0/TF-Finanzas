import type { BondData, AppConfig, User } from '../types';

// Claves para LocalStorage
export const localStorageKeys = {
  BONDS: 'finanzas_bonds',
  CONFIG: 'finanzas_config',
  USERS: 'finanzas_users',
  CURRENT_USER: 'finanzas_current_user'
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

// Funciones para gestionar usuarios en LocalStorage
export const saveUsersToLocalStorage = (users: User[]): void => {
  try {
    localStorage.setItem(localStorageKeys.USERS, JSON.stringify(users));
  } catch (error) {
    console.error('Error saving users to localStorage:', error);
  }
};

export const loadUsersFromLocalStorage = (): User[] => {
  try {
    const saved = localStorage.getItem(localStorageKeys.USERS);
    if (!saved) return [];
    
    const users = JSON.parse(saved);
    // Convertir strings de fecha de vuelta a objetos Date
    return users.map((user: any) => ({
      ...user,
      createdAt: new Date(user.createdAt),
      lastLogin: user.lastLogin ? new Date(user.lastLogin) : undefined
    }));
  } catch (error) {
    console.error('Error loading users from localStorage:', error);
    return [];
  }
};

export const saveCurrentUserToLocalStorage = (user: User): void => {
  try {
    localStorage.setItem(localStorageKeys.CURRENT_USER, JSON.stringify(user));
  } catch (error) {
    console.error('Error saving current user to localStorage:', error);
  }
};

export const loadCurrentUserFromLocalStorage = (): User | null => {
  try {
    const saved = localStorage.getItem(localStorageKeys.CURRENT_USER);
    if (!saved) return null;
    
    const user = JSON.parse(saved);
    return {
      ...user,
      createdAt: new Date(user.createdAt),
      lastLogin: user.lastLogin ? new Date(user.lastLogin) : undefined
    };
  } catch (error) {
    console.error('Error loading current user from localStorage:', error);
    return null;
  }
};

export const removeCurrentUserFromLocalStorage = (): void => {
  try {
    localStorage.removeItem(localStorageKeys.CURRENT_USER);
  } catch (error) {
    console.error('Error removing current user from localStorage:', error);
  }
};

// Función para validar credenciales
export const validateUserCredentials = (username: string, password: string): User | null => {
  const users = loadUsersFromLocalStorage();
  const user = users.find(u => u.username === username && u.password === password);
  
  if (user) {
    // Actualizar último login
    user.lastLogin = new Date();
    const updatedUsers = users.map(u => u.id === user.id ? user : u);
    saveUsersToLocalStorage(updatedUsers);
    saveCurrentUserToLocalStorage(user);
  }
  
  return user || null;
};

// Función para registrar nuevo usuario
export const registerUser = (userData: Omit<User, 'id' | 'createdAt'>): { success: boolean; message: string; user?: User } => {
  try {
    const users = loadUsersFromLocalStorage();
    
    // Verificar si el username ya existe
    if (users.some(u => u.username === userData.username)) {
      return { success: false, message: 'El nombre de usuario ya existe' };
    }
    
    // Verificar si el email ya existe
    if (users.some(u => u.email === userData.email)) {
      return { success: false, message: 'El email ya está registrado' };
    }
    
    // Crear nuevo usuario
    const newUser: User = {
      ...userData,
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date()
    };
    
    // Agregar a la lista
    users.push(newUser);
    saveUsersToLocalStorage(users);
    
    return { success: true, message: 'Usuario registrado exitosamente', user: newUser };
  } catch (error) {
    console.error('Error registering user:', error);
    return { success: false, message: 'Error al registrar usuario' };
  }
};

// Función para verificar si un username está disponible
export const isUsernameAvailable = (username: string): boolean => {
  const users = loadUsersFromLocalStorage();
  return !users.some(u => u.username === username);
};

// Función para verificar si un email está disponible
export const isEmailAvailable = (email: string): boolean => {
  const users = loadUsersFromLocalStorage();
  return !users.some(u => u.email === email);
};

// Función para limpiar localStorage (útil para reset)
export const clearLocalStorage = (): void => {
  try {
    localStorage.removeItem(localStorageKeys.BONDS);
    localStorage.removeItem(localStorageKeys.CONFIG);
    localStorage.removeItem(localStorageKeys.USERS);
    localStorage.removeItem(localStorageKeys.CURRENT_USER);
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
};

// Función para exportar datos (backup)
export const exportLocalStorageData = () => {
  try {
    const bonds = loadBondsFromLocalStorage();
    const config = loadConfigFromLocalStorage();
    const users = loadUsersFromLocalStorage();
    
    const exportData = {
      bonds,
      config,
      users: users.map(user => ({ ...user, password: '***' })), // No exportar passwords
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

// Función para actualizar perfil de usuario
export const updateUserProfile = (userId: string, updates: Partial<User>): { success: boolean; message: string; user?: User } => {
  try {
    const users = loadUsersFromLocalStorage();
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      return { success: false, message: 'Usuario no encontrado' };
    }
    
    // Verificar si se está cambiando el username y ya existe
    if (updates.username && updates.username !== users[userIndex].username) {
      const usernameExists = users.some(u => u.username === updates.username && u.id !== userId);
      if (usernameExists) {
        return { success: false, message: 'El nombre de usuario ya existe' };
      }
    }
    
    // Verificar si se está cambiando el email y ya existe
    if (updates.email && updates.email !== users[userIndex].email) {
      const emailExists = users.some(u => u.email === updates.email && u.id !== userId);
      if (emailExists) {
        return { success: false, message: 'El email ya está registrado' };
      }
    }
    
    // Actualizar usuario
    const updatedUser: User = {
      ...users[userIndex],
      ...updates
    };
    
    users[userIndex] = updatedUser;
    saveUsersToLocalStorage(users);
    
    // Si es el usuario actual, actualizar también la sesión
    const currentUser = loadCurrentUserFromLocalStorage();
    if (currentUser && currentUser.id === userId) {
      saveCurrentUserToLocalStorage(updatedUser);
    }
    
    return { success: true, message: 'Perfil actualizado exitosamente', user: updatedUser };
  } catch (error) {
    console.error('Error updating user profile:', error);
    return { success: false, message: 'Error al actualizar perfil' };
  }
};
