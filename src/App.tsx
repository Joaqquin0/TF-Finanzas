// src/App.tsx
import React, { useState } from 'react';
import { AuthProvider, AppProvider, useAuth } from './context/AppContext';
import Login from './components/Login';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import BondsList from './components/BondsList';
import Configuration from './components/Configuration';
import './App.css';

const AppContent: React.FC = () => {
    const { isAuthenticated } = useAuth();
    const [currentView, setCurrentView] = useState('dashboard');
    const [sidebarWidth, setSidebarWidth] = useState('ml-64'); // Estado para el ancho de la barra lateral

    if (!isAuthenticated) {
        return <Login />;
    }

    const handleToggleCollapse = (isCollapsed: boolean) => {
        setSidebarWidth(isCollapsed ? 'ml-20' : 'ml-64');
    };

    const renderView = () => {
        switch (currentView) {
            case 'bonds':
                return <BondsList />;
            case 'config':
                return <Configuration />;
            default:
                return <Dashboard />;
        }
    };

    return (
        <div className="min-h-screen flex">
            <Navbar currentView={currentView} onViewChange={setCurrentView} onToggleCollapse={handleToggleCollapse} />
            {/* Aquí aplicamos el color de fondo directamente al main */}
            <main
                className={`flex-1 p-6 transition-all duration-300 ease-in-out ${sidebarWidth}`}
                style={{ backgroundColor: 'rgba(11, 23, 57, 1)' }} // <-- ¡NUEVO COLOR DE FONDO AQUÍ!
            >
                {renderView()}
            </main>
        </div>
    );
};

function App() {
    return (
        <AuthProvider>
            <AppProvider>
                <AppContent />
            </AppProvider>
        </AuthProvider>
    );
}

export default App;