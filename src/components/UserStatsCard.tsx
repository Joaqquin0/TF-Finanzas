import React from 'react';
import { getUserStats } from '../utils/localStorage';
import { Users, UserCheck, Building, DollarSign, Calendar, TrendingUp } from 'lucide-react';

const UserStatsCard: React.FC = () => {
  const stats = getUserStats();

  const statsCards = [
    {
      title: 'Total Usuarios',
      value: stats.total,
      icon: Users,
      color: 'bg-blue-500',
      textColor: 'text-blue-600'
    },
    {
      title: 'Emisores',
      value: stats.emisores,
      icon: Building,
      color: 'bg-purple-500',
      textColor: 'text-purple-600'
    },
    {
      title: 'Inversores',
      value: stats.inversores,
      icon: DollarSign,
      color: 'bg-green-500',
      textColor: 'text-green-600'
    },
    {
      title: 'Activos Hoy',
      value: stats.activeToday,
      icon: UserCheck,
      color: 'bg-orange-500',
      textColor: 'text-orange-600'
    },
    {
      title: 'Nuevos Este Mes',
      value: stats.registeredThisMonth,
      icon: Calendar,
      color: 'bg-indigo-500',
      textColor: 'text-indigo-600'
    },
    {
      title: 'Crecimiento',
      value: `+${Math.round((stats.registeredThisMonth / Math.max(stats.total - stats.registeredThisMonth, 1)) * 100)}%`,
      icon: TrendingUp,
      color: 'bg-pink-500',
      textColor: 'text-pink-600'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <Users className="mr-2" size={20} />
        Estadísticas de Usuarios
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statsCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div key={index} className="text-center">
              <div className={`${card.color} w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2`}>
                <Icon className="text-white" size={20} />
              </div>
              <div className={`text-2xl font-bold ${card.textColor}`}>
                {card.value}
              </div>
              <div className="text-sm text-gray-600">
                {card.title}
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-600 text-center">
          La plataforma cuenta con <strong>{stats.total}</strong> usuarios registrados, 
          de los cuales <strong>{stats.activeToday}</strong> han accedido hoy.
        </p>
      </div>
    </div>
  );
};

export default UserStatsCard;
