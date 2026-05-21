"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { sha256 } from '@/utils/sha256';
import './login.css';

export default function LoginPage() {
  const router = useRouter();
  const { login, usuariActual } = useAppContext();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Si ja hi ha un usuari autenticat, redirigir a home
  if (usuariActual) {
    setTimeout(() => router.push('/'), 1000);
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validacions bàsiques
    if (!email.trim()) {
      setError('El correu electrònic és obligatori');
      setLoading(false);
      return;
    }

    if (!password.trim()) {
      setError('La contrasenya és obligatòria');
      setLoading(false);
      return;
    }

    try {
      const contrasenyaHash = await sha256(password);
      const resultat = await login(email.trim(), contrasenyaHash);

      if (resultat.success) {
        router.push('/');
      }
    } catch (err) {
      setError(err.message || 'Credencials incorrectes');
    } finally {
      setLoading(false);
    }
  };

  return (
    <> 
      <Navbar />
      
      <main className="login-page">
        <div className="login-container">
          <div className="login-card">
            <div className="login-header">
              <h1>🎵 Inicia sessió</h1>
              <p>Connecta&apos;t per gestionar els teus concerts preferits</p>
            </div>

            {error && (
              <div className="login-error">
                <span>⚠️</span>
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="email">Correu electrònic</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="exemple@email.com"
                  disabled={loading}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Contrasenya</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={loading}
                  required
                />
              </div>

              <button 
                type="submit" 
                className="btn btn-primary btn-lg login-btn"
                disabled={loading}
              >
                {loading ? 'Carregant...' : 'Iniciar sessió'}
              </button>
            </form>

            <div className="login-divider">o</div>

            <div className="login-register">
              <p>No tens compte?</p>
              <Link href="/registre" className="btn btn-outline btn-lg">
                Crear un compte
              </Link>
            </div>

            <div className="login-demo">
              <p className="demo-title">🎬 Usuaris de prova:</p>
              <div className="demo-users">
                <div className="demo-user">
                  <code>usuari1@email.com</code>
                  <code>password123</code>
                </div>
                <div className="demo-user">
                  <code>usuari2@email.com</code>
                  <code>password456</code>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
