"use client";

import Link from 'next/link';
import { useAppContext } from '@/context/AppContext';
import './GrupCard.css';

export default function GrupCard({ grup }) {
  const { usuariActual, esPreferit, afegirPreferit, eliminarPreferit, obtenirConcertsGrup } = useAppContext();
  
  const grupEsPreferit = usuariActual ? esPreferit(grup.id) : false;
  
  // Obtenir el nombre de concerts futurs del grup
  const concertsFuturs = obtenirConcertsGrup(grup.id).filter(c => {
    const avui = new Date().toISOString().split('T')[0];
    return c.data >= avui;
  });

  const handleTogglePreferit = async (e) => {
    e.preventDefault();
    
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
    <div className="grup-card">
      <Link href={`/grup/${grup.id}`}>
        {/* Imatge del grup */}
        <div className="grup-card-img-wrapper">
          <img 
            src={grup.imatge || '/img/no-image.jpg'} 
            alt={grup.nom}
            className="grup-card-img"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/img/no-image.jpg';
            }}
          />
          
          {/* Badge de gènere */}
          <span className="grup-card-genre badge">
            {grup.genere}
          </span>

          {/* Botó de preferit */}
          {usuariActual && (
            <button 
              className={`grup-card-fav ${grupEsPreferit ? 'active' : ''}`}
              onClick={handleTogglePreferit}
              title={grupEsPreferit ? 'Eliminar de preferits' : 'Afegir a preferits'}
            >
              {grupEsPreferit ? '❤️' : '🤍'}
            </button>
          )}
        </div>

        {/* Contingut del grup */}
        <div className="grup-card-body">
          <h3 className="grup-card-title">{grup.nom}</h3>
          
          <p className="grup-card-description">
            {grup.descripcio.length > 100 
              ? `${grup.descripcio.substring(0, 100)}...` 
              : grup.descripcio
            }
          </p>

          {/* Informació addicional */}
          <div className="grup-card-info">
            <div className="grup-card-info-item">
              <span className="grup-card-icon">🌍</span>
              <span>{grup.paisOrigen}</span>
            </div>
            
            {concertsFuturs.length > 0 && (
              <div className="grup-card-info-item">
                <span className="grup-card-icon">🎸</span>
                <span>
                  {concertsFuturs.length} concert{concertsFuturs.length !== 1 ? 's' : ''} pròxim{concertsFuturs.length !== 1 ? 's' : ''}
                </span>
              </div>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
