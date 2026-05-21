"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import './ranking.css';
import Navbar from '@/components/Navbar';

export default function RankingPage() {
  const [grups, setGrups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [regioSeleccionada, setRegioSeleccionada] = useState('Totes');

  // Carregar dades de l'API
  useEffect(() => {
    const carregarRanking = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/Grup/Ranking/${regioSeleccionada}`);
        
        if (!response.ok) {
          throw new Error('Error al carregar el ranking');
        }

        const data = await response.json();
        setGrups(data);
      } catch (err) {
        console.error('Error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    carregarRanking();
  }, [regioSeleccionada]);

  // Formatar nombre amb separadors de milers
  const formatarNumero = (numero) => {
    return new Intl.NumberFormat('ca-ES').format(numero);
  };

  // Obtenir el color de la posició (podis)
  const getColorPosicio = (posicio) => {
    if (posicio === 1) return 'posicio-1'; // Or
    if (posicio === 2) return 'posicio-2'; // Plata
    if (posicio === 3) return 'posicio-3'; // Bronze
    return '';
  };

  // Obtenir l'emoji de la posició
  const getEmojiPosicio = (posicio) => {
    if (posicio === 1) return '🥇';
    if (posicio === 2) return '🥈';
    if (posicio === 3) return '🥉';
    return posicio;
  };

  return (

    <>

      <Navbar />
    
        <div className="container">
        <div className="ranking-page">
          <div className="ranking-header">
            <h1>🏆 Rànking de Grups</h1>
            <p className="text-muted">
              Classificació dels grups segons els oients mensuals a Spotify
            </p>
          </div>

          {/* Filtres per regió */}
          <div className="ranking-filters">
            <label className="filter-label">Filtrar per regió:</label>
            <div className="filter-buttons">
              <button
                className={`filter-btn ${regioSeleccionada === 'Totes' ? 'active' : ''}`}
                onClick={() => setRegioSeleccionada('Totes')}
              >
                🌍 Totes
              </button>
              <button
                className={`filter-btn ${regioSeleccionada === 'Catalunya' ? 'active' : ''}`}
                onClick={() => setRegioSeleccionada('Catalunya')}
              >
                🏴 Catalunya
              </button>
              <button
                className={`filter-btn ${regioSeleccionada === 'Pais Valencia' ? 'active' : ''}`}
                onClick={() => setRegioSeleccionada('Pais Valencia')}
              >
                🦇 País Valencià
              </button>
              <button
                className={`filter-btn ${regioSeleccionada === 'Illes Balears' ? 'active' : ''}`}
                onClick={() => setRegioSeleccionada('Illes Balears')}
              >
                🏝️ Illes Balears
              </button>
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div className="text-center mt-4">
              <div className="spinner"></div>
              <p className="mt-2">Carregant ranking...</p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="alert alert-error">
              <strong>Error:</strong> {error}
            </div>
          )}

          {/* Taula de ranking */}
          {!loading && !error && (
            <>
              {grups.length > 0 ? (
                <div className="ranking-table-container">
                  <table className="ranking-table">
                    <thead>
                      <tr>
                        <th className="col-posicio">Posició</th>
                        <th className="col-grup">Grup</th>
                        <th className="col-regio">Regió</th>
                        <th className="col-oients">Oients Mensuals</th>
                      </tr>
                    </thead>
                    <tbody>
                      {grups.map((grup, index) => {
                        const posicio = index + 1;
                        return (
                          <tr key={grup.id} className="ranking-row">
                            <td className={`col-posicio ${getColorPosicio(posicio)}`}>
                              <span className="posicio-numero">
                                {getEmojiPosicio(posicio)}
                              </span>
                            </td>
                            <td className="col-grup">
                              <span className="grup-nom">{grup.nomGrup}</span>
                            </td>
                            <td className="col-regio">
                              <span className="badge badge-secondary">
                                {grup.regio}
                              </span>
                            </td>
                            <td className="col-oients">
                              <span className="oients-numero">
                                {formatarNumero(grup.oientsMensuals)}
                              </span>
                              <span className="oients-label">oients/mes</span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="empty-state">
                  <h3>No hi ha grups disponibles</h3>
                  <p>No s&apos;han trobat grups per la regió seleccionada.</p>
                </div>
              )}

              {/* Informació addicional */}
              {grups.length > 0 && (
                <div className="ranking-info">
                  <p>
                    Mostrant <strong>{grups.length}</strong> {grups.length === 1 ? 'grup' : 'grups'}
                    {regioSeleccionada !== 'Totes' && ` de ${regioSeleccionada}`}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

    </>


  );
}
