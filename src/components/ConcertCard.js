"use client";

import Link from 'next/link';
import { useAppContext } from '@/context/AppContext';
import './ConcertCard.css';

export default function ConcertCard({ concert }) {
  const { obtenirGrup, obtenirEsdeveniment, usuariActual, esPreferit } = useAppContext();
  
  const grup = obtenirGrup(concert.grupId);
  const esdeveniment = concert.esdevenimentId ? obtenirEsdeveniment(concert.esdevenimentId) : null;

  // Formatar la data
  const formatarData = (data) => {
    const date = new Date(data + 'T00:00:00');
    const opcions = { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('ca-ES', opcions);
  };

  // Comprovar si el grup del concert és preferit
  const grupEsPreferit = usuariActual && grup ? esPreferit(grup.id) : false;

  return (
    <div className="concert-card">
      {/* Imatge del concert */}
      <div className="concert-card-img-wrapper">
        <img 
          src={concert.imatge || '/img/no-image.jpg'} 
          alt={concert.titol}
          className="concert-card-img"
          onError={(e) => {
            e.target.onerror = null; // Evita bucle infinit
            e.target.src = '/img/no-image.jpg';
          }}
        />
        {grupEsPreferit && (
          <span className="concert-card-badge badge-success">
            ⭐
          </span>
        )}
        {esdeveniment && (
          <span className="concert-card-badge badge-primary">
            🎪
          </span>
        )}
      </div>

      {/* Contingut del concert */}
      <div className="concert-card-body">
        <h3 className="concert-card-title">{concert.titol}</h3>
        
        {/* Informació del grup */}
        {grup && (
          <Link href={`/grup/${grup.id}`} className="concert-card-grup">
            🎤 {grup.nom}
          </Link>
        )}

        {/* Detalls del concert */}
        <div className="concert-card-details">
          <div className="concert-card-detail">
            <span className="concert-card-icon">📅</span>
            <span>{formatarData(concert.data)}</span>
          </div>
          
          <div className="concert-card-detail">
            <span className="concert-card-icon">🕐</span>
            <span>{concert.hora}</span>
          </div>
          
          <div className="concert-card-detail">
            <span className="concert-card-icon">📍</span>
            <span>{concert.ciutat}</span>
          </div>
          
          <div className="concert-card-detail">
            <span className="concert-card-icon">🎫</span>
            <span>
              {concert.preu === 0 ? 'Gratuït' : `${concert.preu}€`}
            </span>
          </div>
        </div>

        {/* Botó per veure més */}
        <Link href={`/concert/${concert.id}`} className="btn btn-primary btn-sm concert-card-btn">
          Veure detalls
        </Link>
      </div>
    </div>
  );
}
