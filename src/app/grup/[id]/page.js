"use client";

import { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import Navbar from '@/components/Navbar';
import ConcertCard from '@/components/ConcertCard';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { uploadGrupImage } from '@/services/api';
import './grup.css';

export default function GrupPage() {
  const params = useParams();
  const { obtenirGrup, concerts, usuariActual, esPreferit, afegirPreferit, eliminarPreferit, refrescarDades } = useAppContext();
  const [imatgePerfil, setImatgePerfil] = useState(null);
  const [missatgeImatge, setMissatgeImatge] = useState(null);
  const [pujantImatge, setPujantImatge] = useState(false);

  const grup = obtenirGrup(params.id);

  if (!grup) {
    return (
      <>
        <Navbar />
        <main className="grup-page">
          <div className="container">
            <div className="empty-state">
              <h2>Grup no trobat</h2>
              <p>El grup que busques no existeix o ha estat eliminat.</p>
              <Link href="/" className="btn btn-primary">
                Tornar a l&apos;inici
              </Link>
            </div>
          </div>
        </main>
      </>
    );
  }

  const ara = new Date();

  const concertsFuturs = concerts
    .filter((c) => String(c.grupId) === String(grup.id) && new Date(c.data) >= ara)
    .sort((a, b) => new Date(a.data) - new Date(b.data));

  const concertsPassats = concerts
    .filter((c) => String(c.grupId) === String(grup.id) && new Date(c.data) < ara)
    .sort((a, b) => new Date(b.data) - new Date(a.data));

  const grupEsPreferit = usuariActual ? esPreferit(grup.id) : false;
  const potEditarImatge = usuariActual?.rol === 'administrador' || usuariActual?.grupsGestionats?.includes(Number(grup.id));

  const handleTogglePreferit = async () => {
    if (!usuariActual) {
      alert("Has d'iniciar sessió per afegir grups als preferits");
      return;
    }
    if (grupEsPreferit) {
      await eliminarPreferit(grup.id);
    } else {
      await afegirPreferit(grup.id);
    }
  };

  const handleSubmitImatge = async (e) => {
    e.preventDefault();

    if (!imatgePerfil) {
      setMissatgeImatge({ tipus: 'error', text: 'Selecciona una imatge abans de guardar.' });
      return;
    }

    try {
      setPujantImatge(true);
      setMissatgeImatge(null);
      await uploadGrupImage(grup.id, imatgePerfil);
      await refrescarDades();
      setImatgePerfil(null);
      setMissatgeImatge({ tipus: 'success', text: 'Foto del grup actualitzada.' });
    } catch (error) {
      setMissatgeImatge({ tipus: 'error', text: error.message || 'No s\'ha pogut pujar la imatge.' });
    } finally {
      setPujantImatge(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="grup-page">
        {/* Hero amb imatge del grup */}
        <div className="grup-hero">
          <div className="grup-hero-overlay"></div>
          <img
            src={grup.imatge || '/img/no-image.jpg'}
            alt={grup.nom}
            className="grup-hero-img"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/img/no-image.jpg';
            }}
          />
          <div className="grup-hero-content container">
            <div className="grup-hero-badges">
              <span className="badge badge-primary">{grup.genere}</span>
              {grup.paisOrigen && (
                <span className="badge badge-success">📍 {grup.paisOrigen}</span>
              )}
            </div>
            <h1 className="grup-hero-title">{grup.nom}</h1>
            {grup.anyFormacio && (
              <p className="grup-hero-subtitle">Formats el {grup.anyFormacio}</p>
            )}
          </div>
        </div>

        <div className="container">
          <div className="grup-content">
            {/* Columna esquerra - Informació principal */}
            <div className="grup-main">
              {/* Propers concerts */}
              <section className="grup-section">
                <h2>🎤 Propers concerts ({concertsFuturs.length})</h2>
                {concertsFuturs.length > 0 ? (
                  <div className="concerts-list">
                    {concertsFuturs.map((concert) => (
                      <ConcertCard key={concert.id} concert={concert} />
                    ))}
                  </div>
                ) : (
                  <p className="concerts-empty">
                    No hi ha concerts programats de moment. Segueix el grup per no perdre cap novetat.
                  </p>
                )}
              </section>

              {/* Concerts passats */}
              {concertsPassats.length > 0 && (
                <section className="grup-section grup-section--passats">
                  <h2>📼 Concerts passats ({concertsPassats.length})</h2>
                  <div className="concerts-list">
                    {concertsPassats.map((concert) => (
                      <ConcertCard key={concert.id} concert={concert} />
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Columna dreta - Detalls del grup */}
            <aside className="grup-sidebar">
              <div className="grup-details-card">
                <h3>ℹ️ Informació del grup</h3>

                <div className="grup-details">
                  <div className="grup-detail-item">
                    <div className="grup-detail-icon">🎵</div>
                    <div>
                      <div className="grup-detail-label">Gènere</div>
                      <div className="grup-detail-value">{grup.genere}</div>
                    </div>
                  </div>

                  {grup.paisOrigen && (
                    <div className="grup-detail-item">
                      <div className="grup-detail-icon">🌍</div>
                      <div>
                        <div className="grup-detail-label">Origen</div>
                        <div className="grup-detail-value">{grup.paisOrigen}</div>
                      </div>
                    </div>
                  )}

                  {grup.anyFormacio && (
                    <div className="grup-detail-item">
                      <div className="grup-detail-icon">📅</div>
                      <div>
                        <div className="grup-detail-label">Any de formació</div>
                        <div className="grup-detail-value">{grup.anyFormacio}</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Xarxes socials */}
                {grup.xarxes && (
                  <div className="grup-xarxes">
                    {grup.xarxes.instagram && (
                      <a
                        href={grup.xarxes.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="xarxa-link"
                      >
                        📸 Instagram
                      </a>
                    )}
                    {grup.xarxes.spotify && (
                      <a
                        href={grup.xarxes.spotify}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="xarxa-link"
                      >
                        🎧 Spotify
                      </a>
                    )}
                    {grup.xarxes.web && (
                      <a
                        href={grup.xarxes.web}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="xarxa-link"
                      >
                        🌐 Web oficial
                      </a>
                    )}
                  </div>
                )}

                {/* Botó preferit */}
                <button
                  className={`btn btn-lg grup-preferit-btn ${grupEsPreferit ? 'btn-danger' : 'btn-primary'}`}
                  onClick={handleTogglePreferit}
                >
                  {grupEsPreferit ? '❤️ Als preferits' : '🤍 Afegir a preferits'}
                </button>
              </div>

              {potEditarImatge && (
                <form className="grup-image-form" onSubmit={handleSubmitImatge}>
                  <h3>Foto de perfil</h3>
                  {missatgeImatge && (
                    <div className={`alert alert-${missatgeImatge.tipus === 'error' ? 'error' : 'success'}`}>
                      {missatgeImatge.text}
                    </div>
                  )}
                  <input
                    type="file"
                    className="form-control"
                    accept="image/png,image/jpeg,image/webp,image/gif"
                    onChange={(e) => setImatgePerfil(e.target.files?.[0] || null)}
                    disabled={pujantImatge}
                  />
                  {imatgePerfil && (
                    <p className="text-muted file-selected">{imatgePerfil.name}</p>
                  )}
                  <button className="btn btn-primary grup-image-submit" type="submit" disabled={pujantImatge}>
                    {pujantImatge ? 'Guardant...' : 'Guardar foto'}
                  </button>
                </form>
              )}

              {/* Tornar enrere */}
              <Link href="/" className="btn btn-outline grup-back-btn">
                ← Tornar als concerts
              </Link>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}
