"use client";

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { useAppContext } from '@/context/AppContext';
import './buscar.css';

export default function SearchPage() {
  const { cercar, obtenirGrup } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const results = searchTerm.trim() ? cercar(searchTerm) : { grups: [], concerts: [] };

  return (
    <>
      <Navbar />
      <main className="buscar-page">
        <section className="buscar-hero">
          <div className="container">
            <h1>Buscar</h1>
            <p>Troba grups i concerts de La Palestra</p>
            <form className="buscar-form" onSubmit={(e) => e.preventDefault()}>
              <input
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Nom del grup, ciutat o concert..."
                className="buscar-input"
              />
              <button type="submit" className="buscar-btn">Buscar</button>
            </form>
          </div>
        </section>

        <div className="container buscar-results">
          {!searchTerm.trim() ? (
            <div className="buscar-empty">
              <span className="buscar-empty-icon">🔎</span>
              <h3>Escriu una cerca</h3>
              <p>Pots buscar per grup, genere, ciutat o titol del concert.</p>
            </div>
          ) : results.grups.length === 0 && results.concerts.length === 0 ? (
            <div className="buscar-empty">
              <span className="buscar-empty-icon">🎵</span>
              <h3>No hi ha resultats</h3>
              <p>Prova amb una altra paraula clau.</p>
            </div>
          ) : (
            <>
              <section className="buscar-section">
                <div className="buscar-section-header">
                  <h2>Grups</h2>
                  <span className="buscar-count">{results.grups.length}</span>
                </div>
                <div className="buscar-grups-grid">
                  {results.grups.map((grup) => (
                    <Link key={grup.id} href={`/grup/${grup.id}`} className="buscar-grup-card">
                      <span className="buscar-grup-name">{grup.nom}</span>
                      <span className="buscar-grup-genre">{grup.genere}</span>
                    </Link>
                  ))}
                </div>
              </section>

              <section className="buscar-section">
                <div className="buscar-section-header">
                  <h2>Concerts</h2>
                  <span className="buscar-count">{results.concerts.length}</span>
                </div>
                <div className="buscar-concerts-list">
                  {results.concerts.map((concert) => {
                    const grup = obtenirGrup(concert.grupId);

                    return (
                      <Link key={concert.id} href={`/concert/${concert.id}`} className="buscar-concert-item">
                        <div className="buscar-concert-info">
                          <span className="buscar-concert-title">{concert.titol}</span>
                          <span className="buscar-concert-artist">{grup?.nom || 'Grup pendent'}</span>
                          <span className="buscar-concert-details">{concert.lloc}</span>
                        </div>
                        <div className="buscar-concert-meta">
                          <span className="buscar-concert-date">{concert.data}</span>
                          <span className="buscar-concert-location">{concert.ciutat}</span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </section>
            </>
          )}
        </div>
      </main>
    </>
  );
}
