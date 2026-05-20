"use client";

import Link from 'next/link';
import { useAppContext } from '@/context/AppContext';
import ConcertCard from '@/components/ConcertCard';
import Navbar from '@/components/Navbar';
import './preferits.css';

export default function PreferitsPage() {
  const { obtenirConcertsPreferits, usuariActual } = useAppContext();
  const concertsPreferits = obtenirConcertsPreferits();

  return (
    <>
      <Navbar />
      <main className="preferits-page">
        <section className="preferits-hero">
          <div className="container">
            <h1>Preferits</h1>
            <p>Concerts dels grups que segueixes</p>
          </div>
        </section>

        <div className="container preferits-content">
          {!usuariActual ? (
            <div className="empty-state">
              <span className="empty-state-icon">🔐</span>
              <h2>Inicia sessio</h2>
              <p>Has d&apos;iniciar sessio per veure els teus concerts preferits.</p>
              <Link href="/login" className="btn btn-primary">Iniciar sessio</Link>
            </div>
          ) : concertsPreferits.length === 0 ? (
            <div className="empty-state">
              <span className="empty-state-icon">♡</span>
              <h2>No tens concerts preferits</h2>
              <p>Afegeix grups als preferits per veure aqui els seus propers concerts.</p>
              <Link href="/buscar" className="btn btn-primary">Buscar grups</Link>
            </div>
          ) : (
            <section className="preferits-section">
              <div className="preferits-section-header">
                <h2>Propers concerts</h2>
                <span className="preferits-count">{concertsPreferits.length}</span>
              </div>
              <div className="preferits-grid">
                {concertsPreferits.map((concert) => (
                  <ConcertCard key={concert.id} concert={concert} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </>
  );
}
