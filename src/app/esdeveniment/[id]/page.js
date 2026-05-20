"use client";

import { useAppContext } from '@/context/AppContext';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import './esdeveniment.css';
import Navbar from '@/components/Navbar';

export default function EsdevenimentPage() {
  const params = useParams();
  const { obtenirEsdeveniment, obtenirConcertsEsdeveniment, obtenirGrup } = useAppContext();
  
  const esdeveniment = obtenirEsdeveniment(params.id);
  const concerts = obtenirConcertsEsdeveniment(params.id);

  if (!esdeveniment) {
    return (
      <>
        <Navbar />
         <div className="esdeveniment-page">
          <div className="container">
            <div className="empty-state">
              <h2>Esdeveniment no trobat</h2>
              <p>L&apos;esdeveniment que cerques no existeix.</p>
              <Link href="/" className="btn btn-primary mt-3">
                Tornar a l&apos;inici
              </Link>
            </div>
          </div>
        </div>
      </>
      
    );
  }

  // Formatar dates
  const formatData = (data) => {
    const date = new Date(data);
    return date.toLocaleDateString('ca-ES', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const dataInici = formatData(esdeveniment.dataInici);
  const dataFi = formatData(esdeveniment.dataFi);

  // Ordenar concerts per data i hora
  const concertsOrdenats = [...concerts].sort((a, b) => {
    if (a.data === b.data) {
      return a.hora.localeCompare(b.hora);
    }
    return a.data.localeCompare(b.data);
  });

  return (
    <>
      <Navbar />

      <div className="esdeveniment-page">
        {/* Header de l'esdeveniment */}
        <div 
          className="esdeveniment-header"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url(${esdeveniment.imatge || '/img/no-image.jpg'})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          <div className="container">
            <div className="esdeveniment-header-content">
              <div className="esdeveniment-header-info">
                <div className="esdeveniment-meta">
                  <span className="badge badge-primary">
                    📅 {dataInici} - {dataFi}
                  </span>
                  <span className="badge badge-secondary">
                    📍 {esdeveniment.ciutat}
                  </span>
                </div>
                <div className="esdeveniment-detalls">
                  <div className="detall-item">
                    <strong>Lloc:</strong> {esdeveniment.lloc}
                  </div>
                  <div className="detall-item">
                    <strong>Ciutat:</strong> {esdeveniment.ciutat}
                  </div>
                  <div className="detall-item">
                    <strong>Concerts:</strong> {concerts.length}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Llista de concerts */}
        <div className="container">
          <div className="esdeveniments-concerts-section">
            <h2 className="section-title">Concerts del Festival</h2>

            {concertsOrdenats.length > 0 ? (
              <div className="concerts-list">
                {concertsOrdenats.map((concert) => {
                  const grup = obtenirGrup(concert.grupId);
                  const dataConcert = new Date(concert.data);
                  const diaSetmana = dataConcert.toLocaleDateString('ca-ES', { weekday: 'long' });
                  const dia = dataConcert.toLocaleDateString('ca-ES', { 
                    day: 'numeric', 
                    month: 'long' 
                  });

                  return (
                    <div key={concert.id} className="concert-item">
                      <div className="concert-item-data">
                        <div className="concert-dia-setmana">{diaSetmana}</div>
                        <div className="concert-dia">{dia}</div>
                        <div className="concert-hora">{concert.hora}</div>
                      </div>

                      <div className="concert-item-info">
                        <Link 
                          href={`/concert/${concert.id}`} 
                          className="concert-item-title"
                        >
                          {concert.titol}
                        </Link>
                        
                        <div className="concert-item-grup">
                          <Link href={`/grup/${grup?.id}`}>
                            🎤 {grup?.nom}
                          </Link>
                          <span className="concert-genere">{grup?.genere}</span>
                        </div>

                        <div className="concert-item-lloc">
                          📍 {concert.lloc}
                        </div>
                      </div>

                      <div className="concert-item-accio">
                        <Link 
                          href={`/concert/${concert.id}`}
                          className="btn btn-primary btn-sm"
                        >
                          Veure detalls
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="empty-state">
                <p>Aquest esdeveniment encara no té concerts programats.</p>
              </div>
            )}
          </div>

          {/* Botó per tornar */}
          <div className="text-center mt-4 mb-4">
            <Link href="/" className="btn btn-secondary">
              ← Tornar a concerts
            </Link>
          </div>
        </div>
      </div>
    </>

    
  );
}
