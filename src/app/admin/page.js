"use client";

import { useEffect, useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import {
  actualitzarMesGrups,
  actualitzarOientsMensuals,
  actualitzarSpotifyIds,
  eliminarPropostaConcert,
  eliminarPropostaEsdeveniment,
  getPropostesConcert,
  getPropostesEsdeveniment,
  verificarPropostaConcert,
  verificarPropostaEsdeveniment,
} from '@/services/api';
import Navbar from '@/components/Navbar';
import './admin.css';

const valor = (item, ...keys) => {
  for (const key of keys) {
    if (item?.[key] !== undefined && item?.[key] !== null) {
      return item[key];
    }
  }

  return undefined;
};

const formatData = (data) => String(data || '').split('T')[0];

export default function AdminPage() {
  const { usuariActual, grups, obtenirGrup, refrescarDades } = useAppContext();
  const [propostesConcert, setPropostesConcert] = useState([]);
  const [propostesEsdeveniment, setPropostesEsdeveniment] = useState([]);
  const [missatge, setMissatge] = useState(null);
  const [carregant, setCarregant] = useState(false);
  const [executant, setExecutant] = useState(false);

  const carregarPropostes = async () => {
    const [concerts, esdeveniments] = await Promise.all([
      getPropostesConcert(),
      getPropostesEsdeveniment(),
    ]);
    setPropostesConcert(concerts || []);
    setPropostesEsdeveniment(esdeveniments || []);
  };

  useEffect(() => {
    const carregar = async () => {
      try {
        await carregarPropostes();
      } catch (error) {
        setMissatge({ tipus: 'error', text: error.message || 'No s\'han pogut carregar les propostes' });
      } finally {
        setCarregant(false);
      }
    };

    if (usuariActual?.rol !== 'administrador') {
      return;
    }

    carregar();
  }, [usuariActual]);

  const executarAccio = async (accio, textExit) => {
    try {
      setExecutant(true);
      setMissatge(null);
      await accio();
      await Promise.all([carregarPropostes(), refrescarDades()]);
      setMissatge({ tipus: 'success', text: textExit });
    } catch (error) {
      setMissatge({ tipus: 'error', text: error.message || 'No s\'ha pogut completar l\'acció' });
    } finally {
      setExecutant(false);
    }
  };

  const concertsSolts = propostesConcert.filter(proposta => !valor(proposta, 'propostaEsdeveniment', 'PropostaEsdeveniment'));

  if (!usuariActual || usuariActual.rol !== 'administrador') {
    return (
      <>
        <Navbar />
        <main className="admin-page container">
          <div className="empty-state">
            <h2>Accés restringit</h2>
            <p>Només els administradors poden revisar propostes.</p>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="admin-page container">
        <header className="admin-header">
          <div>
            <h1>Administració</h1>
            <p className="text-muted">Valida propostes i actualitza les dades dels artistes.</p>
          </div>
        </header>

      {missatge && (
        <div className={`alert alert-${missatge.tipus === 'error' ? 'error' : 'success'}`}>
          {missatge.text}
        </div>
      )}

      <section className="admin-panel">
        <h2>Actualització de dades</h2>
        <div className="admin-actions">
          <button
            className="btn btn-secondary"
            disabled={executant}
            onClick={() => executarAccio(actualitzarOientsMensuals, 'Oients mensuals actualitzats')}
          >
            Actualitzar oients mensuals
          </button>
          <button
            className="btn btn-secondary"
            disabled={executant}
            onClick={() => executarAccio(actualitzarMesGrups, 'Artistes importats de MusicBrainz')}
          >
            Importar més artistes
          </button>
          <button
            className="btn btn-secondary"
            disabled={executant}
            onClick={() => executarAccio(actualitzarSpotifyIds, 'Spotify IDs actualitzats')}
          >
            Actualitzar Spotify IDs
          </button>
        </div>
      </section>

      <section className="admin-panel">
        <h2>Propostes de festivals</h2>
        {carregant ? (
          <p>Carregant propostes...</p>
        ) : propostesEsdeveniment.length === 0 ? (
          <p className="text-muted">No hi ha propostes de festivals pendents.</p>
        ) : (
          <div className="admin-list">
            {propostesEsdeveniment.map(proposta => {
              const id = valor(proposta, 'id', 'Id');
              const concertsProposta = propostesConcert.filter(concert => valor(concert, 'propostaEsdeveniment', 'PropostaEsdeveniment') === id);
              return (
                <article className="admin-item" key={id}>
                  <div>
                    <h3>{valor(proposta, 'nomEsdeveniment', 'NomEsdeveniment')}</h3>
                    <p>{formatData(valor(proposta, 'dataInici', 'DataInici'))} - {formatData(valor(proposta, 'dataFi', 'DataFi'))}</p>
                    <p>{valor(proposta, 'espai', 'Espai')} · {valor(proposta, 'poblacio', 'Poblacio')}</p>
                    <p className="text-muted">{concertsProposta.length} concerts proposats</p>
                  </div>
                  <div className="admin-item-actions">
                    <button
                      className="btn btn-primary btn-sm"
                      disabled={executant}
                      onClick={() => executarAccio(() => verificarPropostaEsdeveniment(id), 'Festival validat')}
                    >
                      Validar
                    </button>
                    <button
                      className="btn btn-outline btn-sm"
                      disabled={executant}
                      onClick={() => executarAccio(() => eliminarPropostaEsdeveniment(id), 'Proposta rebutjada')}
                    >
                      Rebutjar
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section className="admin-panel">
        <h2>Propostes de concerts</h2>
        {carregant ? (
          <p>Carregant propostes...</p>
        ) : concertsSolts.length === 0 ? (
          <p className="text-muted">No hi ha propostes de concerts pendents.</p>
        ) : (
          <div className="admin-list">
            {concertsSolts.map(proposta => {
              const id = valor(proposta, 'id', 'Id');
              const grupId = valor(proposta, 'grup', 'Grup');
              const grup = obtenirGrup(grupId) || grups.find(item => item.id === grupId);
              return (
                <article className="admin-item" key={id}>
                  <div>
                    <h3>{grup?.nom || 'Grup pendent'}</h3>
                    <p>{formatData(valor(proposta, 'dataConcert', 'DataConcert'))}</p>
                    <p>{valor(proposta, 'espai', 'Espai')} · {valor(proposta, 'poblacio', 'Poblacio')}</p>
                  </div>
                  <div className="admin-item-actions">
                    <button
                      className="btn btn-primary btn-sm"
                      disabled={executant}
                      onClick={() => executarAccio(() => verificarPropostaConcert(id), 'Concert validat')}
                    >
                      Validar
                    </button>
                    <button
                      className="btn btn-outline btn-sm"
                      disabled={executant}
                      onClick={() => executarAccio(() => eliminarPropostaConcert(id), 'Proposta rebutjada')}
                    >
                      Rebutjar
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
      </main>
    </>
  );
}
