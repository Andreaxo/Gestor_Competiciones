// components/manuales/ManualesSidebar.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Settings, 
  LogIn, 
  Trophy, 
  Target, 
  Users, 
  FileText, 
  Calendar 
} from 'lucide-react';

const ManualesSidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/manuales', label: 'Inicio', icon: Home },
    { path: '/manuales/requisitos', label: 'Requisitos del Sistema', icon: Settings },
    { path: '/manuales/acceso', label: 'Acceso al Sistema', icon: LogIn },
    { path: '/manuales/competiciones', label: 'Módulo de Competiciones', icon: Trophy },
    { path: '/manuales/habilidades', label: 'Módulo de Habilidades', icon: Target },
    { path: '/manuales/usuarios', label: 'Módulo de Usuarios', icon: Users },
    { path: '/manuales/documentos', label: 'Documentos', icon: FileText },
    { path: '/manuales/eventos', label: 'Eventos', icon: Calendar },
  ];

  return (
    <aside className="manuales-sidebar">
      <nav className="manuales-sidebar-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || 
                          (item.path === '/manuales' && location.pathname === '/manuales/');
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`manuales-nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default ManualesSidebar;
