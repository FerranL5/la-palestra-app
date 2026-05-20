"use client";

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { useAppContext } from '@/context/AppContext';
import './perfil.css';

export default function PerfilPage() {
  const { usuariActual, actualitzarNotificacions } = useAppContext();
  const [missatge, setMissatge] = useState(null);
  const [guardant, setGuardant] = useState(false);

  const handleNotificacionsChange = async (e) => {
    const notificacions = e.target.checked;

    try {
      setGuardant(true);
      setMissatge(null);
      await actualitzarNotificacions(notificacions);
      setMissatge({ tipus: 'success', text: 'Preferencies de notificacions actualitzades.' });
    } catch (error) {
      setMissatge({ tipus: 'error', text: error.message || 'No s\'han pogut actualitzar les notificacions.' });
    } finally {
      setGuardant(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="perfil-page container">
        {!usuariActual ? (
          <div className="empty-state">
            <h1>Perfil</h1>
            <p>Has d&apos;iniciar sessio per editar les teves preferencies.</p>
            <Link href="/login" className="btn btn-primary">Iniciar sessio</Link>
          </div>
        ) : (
          <section className="perfil-panel">
            <div>
              <h1>Perfil</h1>
              <p className="text-muted">{usuariActual.email}</p>
            </div>

            {missatge && (
              <div className={`alert alert-${missatge.tipus === 'error' ? 'error' : 'success'}`}>
                {missatge.text}
              </div>
            )}

            <label className="perfil-toggle">
              <input
                type="checkbox"
                checked={Boolean(usuariActual.notificacions)}
                onChange={handleNotificacionsChange}
                disabled={guardant}
              />
              <span>
                <strong>Rebre correus de nous concerts i esdeveniments</strong>
                <small>Quan un grup dels teus preferits tingui una novetat publicada.</small>
              </span>
            </label>
          </section>
        )}
      </main>
    </>
  );
}
