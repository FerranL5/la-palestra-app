"use client";

import { useAppContext } from '@/context/AppContext';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import './concert.css';

export default function ConcertPage() {
  const params = useParams();
  const { obtenirConcert, obtenirGrup, obtenirEsdeveniment, usuariActual, esPreferit, afegirPreferit, eliminarPreferit } = useAppContext();
  
  const concert = obtenirConcert(params.id);
  
  if (!concert) {
    return (
      <>
        <Navbar />
        <main className="concert-page">
          <div className="container">
            <div className="empty-state">
              <h2>Concert no trobat</h2>
              <p>El concert que busques no existeix o ha estat eliminat.</p>
              <Link href="/" className="btn btn-primary">
                Tornar a l&apos;inici
              </Link>
            </div>
          </div>
        </main>
      </>
    );
  }

  const grup = obtenirGrup(concert.grupId);
  const esdeveniment = concert.esdevenimentId ? obtenirEsdeveniment(concert.esdevenimentId) : null;
  const grupEsPreferit = usuariActual && grup ? esPreferit(grup.id) : false;

  // Formatar la data completa
  const formatarDataCompleta = (data) => {
    const date = new Date(data + 'T00:00:00');
    const opcions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('ca-ES', opcions);
  };

  const handleTogglePreferit = async () => {
    if (!usuariActual) {
      alert('Has d\'iniciar sessió per afegir grups als preferits');
      return;
    }

    if (grupEsPreferit) {
      await eliminarPreferit(grup.id);
    } else {
      await afegirPreferit(grup.id);
    }
  };

  return (
    <>
      <Navbar />
      
      <main className="concert-page">
        {/* Hero amb imatge del concert */}
        <div className="concert-hero">
          <div className="concert-hero-overlay"></div>
          <img 
            src={concert.imatge || '/img/no-image.jpg'} 
            alt={concert.titol}
            className="concert-hero-img"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/img/no-image.jpg';
            }}
          />
          <div className="concert-hero-content container">
            <div className="concert-hero-badges">
              {esdeveniment && (
                <Link href={`/esdeveniment/${esdeveniment.id}`} className="badge badge-primary">
                  🎪 {esdeveniment.nom}
                </Link>
              )}
              {grup && (
                <span className="badge badge-success">
                  {grup.genere}
                </span>
              )}
            </div>
            <h1 className="concert-hero-title">{concert.titol}</h1>
          </div>
        </div>

        <div className="container">
          <div className="concert-content">
            {/* Columna esquerra - Informació principal */}
            <div className="concert-main">
              {/* Informació del grup */}
              {grup && (
                <section className="concert-section grup-info">
                  <div className="grup-info-header">
                    <div>
                      <h2>🎤 Artista</h2>
                      <Link href={`/grup/${grup.id}`} className="grup-name">
                        {grup.nom}
                      </Link>
                      <p className="grup-genre">{grup.genere} • {grup.paisOrigen}</p>
                    </div>
                    {usuariActual && (
                      <button 
                        className={`btn btn-sm ${grupEsPreferit ? 'btn-danger' : 'btn-outline'}`}
                        onClick={handleTogglePreferit}
                      >
                        {grupEsPreferit ? '❤️ Als preferits' : '🤍 Afegir a preferits'}
                      </button>
                    )}
                  </div>
                </section>
              )}

              {/* Informació de l'esdeveniment si pertany a un */}
              {esdeveniment && (
                <section className="concert-section esdeveniment-info">
                  <h2>🎪 Part del festival {esdeveniment.nom}</h2>
                  <Link href={`/esdeveniment/${esdeveniment.id}`} className="btn btn-secondary btn-sm">
                    Veure programa complet del festival
                  </Link>
                </section>
              )}
            </div>

            {/* Columna dreta - Detalls del concert */}
            <aside className="concert-sidebar">
              <div className="concert-details-card">
                <h3>📍 Detalls del concert</h3>
                
                <div className="concert-details">
                  <div className="concert-detail-item">
                    <div className="concert-detail-icon">📅</div>
                    <div>
                      <div className="concert-detail-label">Data</div>
                      <div className="concert-detail-value">{formatarDataCompleta(concert.data)}</div>
                    </div>
                  </div>

                  <div className="concert-detail-item">
                    <div className="concert-detail-icon">🕐</div>
                    <div>
                      <div className="concert-detail-label">Hora</div>
                      <div className="concert-detail-value">{concert.hora}</div>
                    </div>
                  </div>

                  <div className="concert-detail-item">
                    <div className="concert-detail-icon">📍</div>
                    <div>
                      <div className="concert-detail-label">Lloc</div>
                      <div className="concert-detail-value">{concert.lloc}</div>
                      <div className="concert-detail-sublabel">{concert.ciutat}</div>
                    </div>
                  </div>

                  <div className="concert-detail-item">
                    <div className="concert-detail-icon">🎫</div>
                    <div>
                      <div className="concert-detail-label">Preu</div>
                      <div className="concert-detail-value">
                        {concert.preu === 0 ? 'Gratuït' : `${concert.preu}€`}
                      </div>
                    </div>
                  </div>
                </div>

                {concert.preu > 0 && (
                  <button className="btn btn-primary btn-lg concert-buy-btn">
                    Comprar entrades
                  </button>
                )}
              </div>

              {/* Tornar enrere */}
              <Link href="/" className="btn btn-outline concert-back-btn">
                ← Tornar als concerts
              </Link>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}
