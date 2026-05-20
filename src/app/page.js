"use client";

import { useAppContext } from '@/context/AppContext';
import ConcertCard from '@/components/ConcertCard';
import Navbar from '@/components/Navbar';
import { useState } from 'react';
import './page.css';

export default function Home() {
  const { obtenirConcertsFuturs, esdeveniments } = useAppContext();
  const [filtre, setFiltre] = useState('tots'); // tots, esdeveniments, individuals
  
  const concertsFuturs = obtenirConcertsFuturs();

  // Filtrar concerts segons l'opció seleccionada
  const concertsFiltrats = concertsFuturs.filter(concert => {
    if (filtre === 'esdeveniments') {
      return concert.esdevenimentId !== null && concert.esdevenimentId !== undefined;
    } else if (filtre === 'individuals') {
      return concert.esdevenimentId === null || concert.esdevenimentId === undefined;
    }
    return true; // tots
  });

  return (
    <>
      <Navbar />
      
      <main className="home-page">
        <div className="container">
          {/* Hero Section */}
          <section className="hero">
            <h1>La Palestra</h1>
            <p className="hero-subtitle">
              Troba, crea i afegeix concerts al teu calendari musical. Explora els esdeveniments més destacats i no et perdis cap concert del teu grup preferit!
            </p>
          </section>

          {/* Filtres */}
          <section className="filters">
            <div className="filters-buttons">
              <button 
                className={`btn ${filtre === 'tots' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setFiltre('tots')}
              >
                Tots els concerts
              </button>
              <button 
                className={`btn ${filtre === 'esdeveniments' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setFiltre('esdeveniments')}
              >
                Només festivals
              </button>
              <button 
                className={`btn ${filtre === 'individuals' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setFiltre('individuals')}
              >
                Concerts individuals
              </button>
            </div>
            
            <p className="filters-count">
              {concertsFiltrats.length} concert{concertsFiltrats.length !== 1 ? 's' : ''} {filtre === 'tots' ? 'propers' : filtre === 'esdeveniments' ? 'de festivals' : 'individuals'}
            </p>
          </section>

          {/* Esdeveniments destacats */}
          {filtre === 'tots' && esdeveniments.length > 0 && (
            <section className="featured-events">
              <h2>🎪 Festivals destacats</h2>
              <div className="events-carousel">
                {esdeveniments.slice(0, 3).map(esdeveniment => {
                  const formatarData = (data) => {
                    const date = new Date(data + 'T00:00:00');
                    const opcions = { day: 'numeric', month: 'short' };
                    return date.toLocaleDateString('ca-ES', opcions);
                  };

                  return (
                    <a 
                      href={`/esdeveniment/${esdeveniment.id}`} 
                      key={esdeveniment.id}
                      className="event-highlight"
                    >
                      <div className="event-highlight-img">
                        <img 
                          src={esdeveniment.imatge || '/img/no-image.jpg'} 
                          alt={esdeveniment.nom}
                          onError={(e) => {
                            e.target.onerror = null; // Evita bucle infinit
                            e.target.src = '/img/no-image.jpg';
                          }}
                        />
                      </div>
                      <div className="event-highlight-info">
                        <h3>{esdeveniment.nom}</h3>
                        <p>
                          <span>📅 {formatarData(esdeveniment.dataInici)} - {formatarData(esdeveniment.dataFi)}</span>
                        </p>
                        <p>
                          <span>📍 {esdeveniment.ciutat}</span>
                        </p>
                      </div>
                    </a>
                  );
                })}
              </div>
            </section>
          )}

          {/* Llista de concerts */}
          <section className="concerts-section">
            <h2>
              {filtre === 'tots' ? 'Tots els concerts' : 
               filtre === 'esdeveniments' ? 'Concerts de festivals' : 
               'Concerts individuals'}
            </h2>
            
            {concertsFiltrats.length > 0 ? (
              <div className="concerts-grid">
                {concertsFiltrats.map(concert => (
                  <ConcertCard key={concert.id} concert={concert} />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <h3>No s&apos;han trobat concerts</h3>
                <p>No hi ha concerts disponibles amb aquest filtre.</p>
              </div>
            )}
          </section>
        </div>
      </main>
    </>
  );
}
