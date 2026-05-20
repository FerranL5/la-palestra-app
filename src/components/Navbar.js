"use client";

import Link from 'next/link';
import { useAppContext } from '@/context/AppContext';
import { useState } from 'react';
import './Navbar.css';

export default function Navbar() {
  const { usuariActual, logout } = useAppContext();
  const [menuObert, setMenuObert] = useState(false);

  const tancarMenu = () => {
    setMenuObert(false);
  };

  const handleLogout = () => {
    logout();
    tancarMenu();
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          {/* Logo */}
          <Link href="/" className="navbar-logo" onClick={tancarMenu}>
            La Palestra
          </Link>

          {/* Botó hamburguesa per a mòbil */}
          <button 
            className="navbar-toggle"
            onClick={() => setMenuObert(!menuObert)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          {/* Links de navegació */}
          <div className={`navbar-links ${menuObert ? 'active' : ''}`}>
            <Link href="/" onClick={tancarMenu}>
              Concerts
            </Link>
            
            <Link href="/buscar" onClick={tancarMenu}>
              Buscar
            </Link>

            <Link href="/ranking" onClick={tancarMenu}>
              Rànking
            </Link>

            {usuariActual ? (
              <>
                <Link href="/preferits" onClick={tancarMenu}>
                  Preferits
                </Link>

                <Link href="/perfil" onClick={tancarMenu}>
                  Perfil
                </Link>

                <Link href="/crear" onClick={tancarMenu}>
                  Crear
                </Link>

                {usuariActual.rol === 'administrador' && (
                  <Link href="/admin" onClick={tancarMenu}>
                    Admin
                  </Link>
                )}

                <div className="navbar-user">
                  <span className="navbar-username">
                    Hola, {usuariActual.nom}
                  </span>
                  <button 
                    onClick={handleLogout} 
                    className="btn btn-sm btn-outline navbar-logout"
                  >
                    Tancar sessió
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link href="/login" onClick={tancarMenu}>
                  Iniciar sessió
                </Link>

                <Link href="/registre" onClick={tancarMenu}>
                  <button className="btn btn-sm btn-primary">
                    Registrar-se
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
