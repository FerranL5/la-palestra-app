"use client";

import Link from 'next/link';
import { useAppContext } from '@/context/AppContext';
import './EsdevenimentCard.css';

export default function EsdevenimentCard({ esdeveniment }) {
  const { obtenirConcertsEsdeveniment } = useAppContext();
  
  const concerts = obtenirConcertsEsdeveniment(esdeveniment.id);

  // Formatar la data
  const formatarData = (data) => {
    const date = new Date(data + 'T00:00:00');
    const opcions = { 
      day: 'numeric',
      month: 'short'
    };
    return date.toLocaleDateString('ca-ES', opcions);
  };

  // Calcular la durada de l'esdeveniment
  const calcularDurada = () => {
    const dataInici = new Date(esdeveniment.dataInici);
    const dataFi = new Date(esdeveniment.dataFi);
    const diferenciaDies = Math.ceil((dataFi - dataInici) / (1000 * 60 * 60 * 24)) + 1;
    
    if (diferenciaDies === 1) {
      return '1 dia';
    } else {
      return `${diferenciaDies} dies`;
    }
  };

  return (
    <div className="esdeveniment-card">
      <Link href={`/esdeveniment/${esdeveniment.id}`}>
        {/* Imatge de l'esdeveniment */}
        <div className="esdeveniment-card-img-wrapper">
          <img 
            src={esdeveniment.imatge || '/img/no-image.jpg'} 
            alt={esdeveniment.nom}
            className="esdeveniment-card-img"
            onError={(e) => {
              e.target.onerror = null; // Evita bucle infinit
              e.target.src = '/img/no-image.jpg';
            }}
          />
          
          {/* Badge de festival */}
          <span className="esdeveniment-card-badge">
            🎪 FESTIVAL
          </span>
        </div>

        {/* Contingut de l'esdeveniment */}
        <div className="esdeveniment-card-body">
          <h3 className="esdeveniment-card-title">{esdeveniment.nom}</h3>
          
          <p className="esdeveniment-card-description">
            {esdeveniment.descripcio.length > 120 
              ? `${esdeveniment.descripcio.substring(0, 120)}...` 
              : esdeveniment.descripcio
            }
          </p>

          {/* Informació de l'esdeveniment */}
          <div className="esdeveniment-card-info">
            <div className="esdeveniment-card-info-item">
              <span className="esdeveniment-card-icon">📅</span>
              <span>
                {formatarData(esdeveniment.dataInici)} - {formatarData(esdeveniment.dataFi)}
              </span>
            </div>
            
            <div className="esdeveniment-card-info-item">
              <span className="esdeveniment-card-icon">⏱️</span>
              <span>{calcularDurada()}</span>
            </div>
            
            <div className="esdeveniment-card-info-item">
              <span className="esdeveniment-card-icon">📍</span>
              <span>{esdeveniment.ciutat}</span>
            </div>
            
            <div className="esdeveniment-card-info-item">
              <span className="esdeveniment-card-icon">🎵</span>
              <span>{concerts.length} concerts</span>
            </div>
          </div>

          {/* Botó per veure més */}
          <div className="esdeveniment-card-btn">
            <span className="btn btn-primary btn-sm">
              Veure programa complet
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}
