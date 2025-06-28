import React, { useState } from 'react';
import { AlertCircle, User, KeyRound } from 'lucide-react';
import backgroundImage from '../assets/164ca665-b3af-401e-8434-96a0b40608c9 1.png';
import logo from '../assets/Logo.png';

// Import useAuth from your main context file
// IMPORTANT: Adjust this path if your AppContext.tsx is located differently
import { useAuth } from '../context/AppContext';

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth(); // Use the useAuth hook from AppContext

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!username || !password) {
            setError('Por favor, ingrese usuario y contraseña.');
            return;
        }

        const success = login(username, password);
        if (!success) {
            setError('Credenciales incorrectas. Intente de nuevo.');
            setPassword('');
        }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center p-4 font-sans"
             style={{
                 backgroundImage: `url(${backgroundImage})`,
                 backgroundSize: 'cover',
                 backgroundPosition: 'center',
                 backgroundRepeat: 'no-repeat',
                 backgroundAttachment: 'fixed',
             }}>

            {/* "Flow Box" fuera, arriba a la izquierda */}
            <div className="absolute top-8 left-8 z-20">
                <div className="flex items-center gap-3 text-white">
                    <img
                        src={logo}
                        alt="Logo"
                        className="w-16 h-16"
                    />
                    <h1 className="text-4xl font-bold">Flow Box</h1>
                </div>
            </div>

            {/* "Sign in to your adventure!" fuera, abajo a la izquierda */}
            <div className="absolute bottom-8 left-8 z-20 text-white">
                <h2 className="text-4xl md:text-5xl font-black leading-tight text-white">
                    SIGN IN TO YOUR<br />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#28F09D] to-purple-600">
            ADVENTURE!
          </span>
                </h2>
                <div className="w-24 h-1.5 bg-[#28F09D] mt-4"></div>
            </div>

            {/* Login Box/Form */}
            <div className="w-full max-w-6xl flex flex-col md:flex-row bg-transparent rounded-2xl shadow-2xl overflow-hidden z-10">

                {/* Left Side (formerly for text/logo, now just for potential overlay) */}
                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-between text-white relative bg-transparent">
                    {/* Subtle overlay for readability if needed, otherwise remove */}
                    <div className="absolute inset-0 bg-black bg-opacity-10"></div>
                </div>

                {/* Right Side - Form */}
                <div className="w-full md:w-1/2 p-8 md:p-12 flex items-center justify-center bg-transparent">
                    <div className="w-full max-w-md">
                        <h2 className="text-8xl font-bold text-white mb-2">SIGN IN</h2> {/* Corrected "SING IN" to "SIGN IN" */}
                        <p className="text-gray-400 mb-8">Inicia sesión con tu usuario y contraseña</p>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Usuario (admin / usuario)"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full bg-[#0D1117] bg-opacity-70 border border-gray-700 text-white rounded-lg pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#28F09D]"
                                />
                            </div>

                            <div className="relative">
                                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="password"
                                    placeholder="Contraseña (admin123 / usuario123)"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-[#0D1117] bg-opacity-70 border border-gray-700 text-white rounded-lg pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#28F09D]"
                                />
                            </div>

                            {error && (
                                <div className="flex items-center space-x-2 text-red-400 bg-red-900/30 p-3 rounded-lg">
                                    <AlertCircle size={20} />
                                    <span>{error}</span>
                                </div>
                            )}

                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#161B22] focus:ring-blue-500"
                            >
                                Iniciar Sesión
                            </button>
                        </form>

                        <div className="text-center text-gray-400 mt-8 text-sm">
                            Al registrarte, aceptas nuestros <a href="#" className="text-[#28F09D] hover:underline">Términos y Condiciones</a>.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;