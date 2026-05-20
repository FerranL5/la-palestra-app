"use client";

import { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { useRouter } from 'next/navigation';
import {
  createConcert,
  createEsdeveniment,
  createPropostaConcert,
  createPropostaEsdeveniment,
  uploadEsdevenimentImage,
  uploadPropostaEsdevenimentImage,
} from '@/services/api';
import './crear.css';

function GrupSearchInput({ id, value, grups, onChange }) {
  const grupSeleccionat = grups.find(grup => String(grup.id) === String(value));
  const [text, setText] = useState(grupSeleccionat ? `${grupSeleccionat.nom} - ${grupSeleccionat.genere}` : '');
  const datalistId = `${id}-opcions`;

  const handleChange = (e) => {
    const nouText = e.target.value;
    setText(nouText);

    const grupTrobat = grups.find(grup => `${grup.nom} - ${grup.genere}` === nouText);
    onChange(grupTrobat ? String(grupTrobat.id) : '');
  };

  const handleBlur = () => {
    if (!value) {
      setText('');
      return;
    }

    const grupActual = grups.find(grup => String(grup.id) === String(value));
    setText(grupActual ? `${grupActual.nom} - ${grupActual.genere}` : '');
  };

  return (
    <>
      <input
        type="search"
        id={id}
        value={text}
        onChange={handleChange}
        onBlur={handleBlur}
        className="form-control"
        list={datalistId}
        placeholder="Escriu el nom del grup"
        autoComplete="off"
        required
      />
      <datalist id={datalistId}>
        {grups.map(grup => (
          <option key={grup.id} value={`${grup.nom} - ${grup.genere}`} />
        ))}
      </datalist>
    </>
  );
}

export default function CrearPage() {
  const { usuariActual, grups, refrescarDades } = useAppContext();
  const router = useRouter();

  const [tipusFormulari, setTipusFormulari] = useState('concert'); // 'concert' o 'esdeveniment'
  const [missatge, setMissatge] = useState(null);
  const [enviant, setEnviant] = useState(false);

  // Estats del formulari de concert
  const [concertData, setConcertData] = useState({
    grupId: '',
    titol: '',
    data: '',
    hora: '',
    lloc: '',
    ciutat: '',
    preu: '',
    descripcio: ''
  });

  const concertEsdevenimentBuit = {
    grupId: '',
    data: '',
    hora: '',
    preu: ''
  };

  // Estats del formulari d'esdeveniment
  const [esdevenimentData, setEsdevenimentData] = useState({
    nom: '',
    descripcio: '',
    dataInici: '',
    dataFi: '',
    lloc: '',
    ciutat: '',
    preu: '',
    imatge: null
  });
  const [concertsEsdeveniment, setConcertsEsdeveniment] = useState([{ ...concertEsdevenimentBuit }]);

  const obtenirIdCreat = (resposta) => resposta?.id ?? resposta?.Id;
  const esAdmin = usuariActual.rol === 'administrador';
  const usuariVerificat = Boolean(usuariActual.verificat);
  const potCrearConcertDirecte = (grupId) => esAdmin || usuariActual.grupsGestionats?.includes(Number(grupId));

  const construirDataConcert = (data, hora) => `${data}T${hora || '00:00'}:00`;

  const obtenirPreuConcert = (concert, preuPerDefecte = null) => {
    if (concert.preu !== '') {
      return Number(concert.preu);
    }

    if (preuPerDefecte !== null && preuPerDefecte !== '') {
      return Number(preuPerDefecte);
    }

    return null;
  };

  const crearPayloadConcert = (concert, esdevenimentId = null, opcions = {}) => ({
    poblacio: opcions.ciutat ?? concert.ciutat,
    esdeveniment: esdevenimentId,
    preu: obtenirPreuConcert(concert, opcions.preuPerDefecte),
    linkEntrades: null,
    grup: Number(concert.grupId),
    dataConcert: construirDataConcert(concert.data, concert.hora),
    img: null,
    espai: opcions.lloc ?? concert.lloc,
    usuariCreat: usuariActual.id,
  });

  const crearPayloadPropostaConcert = (concert, propostaEsdevenimentId = null, opcions = {}) => ({
    poblacio: opcions.ciutat ?? concert.ciutat,
    propostaEsdeveniment: propostaEsdevenimentId,
    preu: obtenirPreuConcert(concert, opcions.preuPerDefecte),
    linkEntrades: null,
    grup: Number(concert.grupId),
    dataConcert: construirDataConcert(concert.data, concert.hora),
    img: null,
    espai: opcions.lloc ?? concert.lloc,
    usuariProposat: usuariActual.id,
  });

  const crearPayloadPropostaEsdeveniment = (img = null) => ({
    nomEsdeveniment: esdevenimentData.nom,
    poblacio: esdevenimentData.ciutat,
    preu: esdevenimentData.preu === '' ? null : Number(esdevenimentData.preu),
    linkEntrades: null,
    dataInici: construirDataConcert(esdevenimentData.dataInici, '00:00'),
    dataFi: construirDataConcert(esdevenimentData.dataFi, '23:59'),
    img,
    espai: esdevenimentData.lloc,
    usuariProposat: usuariActual.id,
  });

  // Comprovar si l'usuari està autenticat
  if (!usuariActual) {
    return (
      <div className="container">
        <div className="crear-page">
          <div className="empty-state">
            <h2>Accés restringit</h2>
            <p>Has d&apos;iniciar sessió per crear concerts o esdeveniments.</p>
            <button 
              onClick={() => router.push('/login')}
              className="btn btn-primary mt-3"
            >
              Iniciar sessió
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Handlers per al formulari de concert
  const handleConcertChange = (e) => {
    const { name, value } = e.target;
    setConcertData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleConcertGrupChange = (grupId) => {
    setConcertData(prev => ({
      ...prev,
      grupId,
    }));
  };

  const handleConcertSubmit = async (e) => {
    e.preventDefault();

    // Validacions bàsiques
    if (!concertData.grupId || !concertData.titol || !concertData.data || 
        !concertData.hora || !concertData.lloc || !concertData.ciutat) {
      setMissatge({ tipus: 'error', text: 'Si us plau, omple tots els camps obligatoris' });
      return;
    }

    try {
      setEnviant(true);
      setMissatge(null);
      const directe = potCrearConcertDirecte(concertData.grupId);
      if (!directe && !usuariVerificat) {
        setMissatge({ tipus: 'error', text: 'Has de verificar el teu compte abans de proposar concerts.' });
        return;
      }

      if (directe) {
        await createConcert(crearPayloadConcert(concertData));
      } else {
        await createPropostaConcert(crearPayloadPropostaConcert(concertData));
      }
      await refrescarDades();

      setMissatge({
        tipus: 'success',
        text: directe ? 'Concert creat correctament!' : 'Proposta de concert enviada correctament!',
      });
      setConcertData({
        grupId: '',
        titol: '',
        data: '',
        hora: '',
        lloc: '',
        ciutat: '',
        preu: '',
        descripcio: ''
      });

      setTimeout(() => {
        router.push('/');
      }, 1200);
    } catch (error) {
      setMissatge({ tipus: 'error', text: error.message || 'No s\'ha pogut crear el concert' });
    } finally {
      setEnviant(false);
    }
  };

  // Handlers per al formulari d'esdeveniment
  const handleEsdevenimentChange = (e) => {
    const { name, value, files, type } = e.target;
    setEsdevenimentData(prev => ({
      ...prev,
      [name]: type === 'file' ? files?.[0] || null : value
    }));
  };

  const handleConcertEsdevenimentChange = (index, e) => {
    const { name, value } = e.target;
    setConcertsEsdeveniment(prev => prev.map((concert, concertIndex) => (
      concertIndex === index ? { ...concert, [name]: value } : concert
    )));
  };

  const handleConcertEsdevenimentGrupChange = (index, grupId) => {
    setConcertsEsdeveniment(prev => prev.map((concert, concertIndex) => (
      concertIndex === index ? { ...concert, grupId } : concert
    )));
  };

  const afegirConcertEsdeveniment = () => {
    setConcertsEsdeveniment(prev => [...prev, { ...concertEsdevenimentBuit }]);
  };

  const eliminarConcertEsdeveniment = (index) => {
    setConcertsEsdeveniment(prev => prev.filter((_, concertIndex) => concertIndex !== index));
  };

  const handleEsdevenimentSubmit = async (e) => {
    e.preventDefault();

    // Validacions bàsiques
    if (!esdevenimentData.nom || !esdevenimentData.dataInici || 
        !esdevenimentData.dataFi || !esdevenimentData.lloc || !esdevenimentData.ciutat) {
      setMissatge({ tipus: 'error', text: 'Si us plau, omple tots els camps obligatoris' });
      return;
    }

    // Validar que la data d'inici sigui anterior a la data de fi
    if (esdevenimentData.dataInici > esdevenimentData.dataFi) {
      setMissatge({ tipus: 'error', text: 'La data d\'inici ha de ser anterior a la data de fi' });
      return;
    }

    if (concertsEsdeveniment.length === 0) {
      setMissatge({ tipus: 'error', text: 'Afegeix com a mínim un concert a l\'esdeveniment' });
      return;
    }

    const concertInvalid = concertsEsdeveniment.some(concert => (
      !concert.grupId || !concert.data || !concert.hora
    ));

    if (concertInvalid) {
      setMissatge({ tipus: 'error', text: 'Omple tots els camps obligatoris dels concerts de l\'esdeveniment' });
      return;
    }

    const concertForaDates = concertsEsdeveniment.some(concert => (
      concert.data < esdevenimentData.dataInici || concert.data > esdevenimentData.dataFi
    ));

    if (concertForaDates) {
      setMissatge({ tipus: 'error', text: 'Tots els concerts han d\'estar dins les dates de l\'esdeveniment' });
      return;
    }

    try {
      setEnviant(true);
      setMissatge(null);

      if (!esAdmin && !usuariVerificat) {
        setMissatge({ tipus: 'error', text: 'Has de verificar el teu compte abans de proposar festivals.' });
        return;
      }

      let esdevenimentId = null;
      let imatgeRuta = null;
      if (esdevenimentData.imatge) {
        const imatgePujada = esAdmin
          ? await uploadEsdevenimentImage(esdevenimentData.imatge)
          : await uploadPropostaEsdevenimentImage(esdevenimentData.imatge);
        imatgeRuta = imatgePujada?.img ?? imatgePujada?.Img ?? null;
      }

      if (esAdmin) {
        const esdevenimentCreat = await createEsdeveniment({
          nomEsdeveniment: esdevenimentData.nom,
          poblacio: esdevenimentData.ciutat,
          preu: esdevenimentData.preu === '' ? null : Number(esdevenimentData.preu),
          linkEntrades: null,
          dataInici: construirDataConcert(esdevenimentData.dataInici, '00:00'),
          dataFi: construirDataConcert(esdevenimentData.dataFi, '23:59'),
          img: imatgeRuta,
          espai: esdevenimentData.lloc,
          usuariCreat: usuariActual.id,
        });

        esdevenimentId = obtenirIdCreat(esdevenimentCreat);
        if (!esdevenimentId) {
          throw new Error('L\'API no ha retornat l\'identificador de l\'esdeveniment creat');
        }

        await Promise.all(concertsEsdeveniment.map(concert => (
          createConcert(crearPayloadConcert(concert, esdevenimentId, {
            ciutat: esdevenimentData.ciutat,
            lloc: esdevenimentData.lloc,
            preuPerDefecte: esdevenimentData.preu,
          }))
        )));
      } else {
        const propostaCreat = await createPropostaEsdeveniment(crearPayloadPropostaEsdeveniment(imatgeRuta));

        console.log('Resposta API:', propostaCreat);

        // L'API retorna id: 0 perquè encara no s'ha guardat
        // Necessites obtenir l'ID real després de la resposta
        const propostaEsdevenimentId = propostaCreat?.id;

        // Comprovació més segura per id === 0
        if (propostaEsdevenimentId === undefined || propostaEsdevenimentId === null) {
          console.error('Resposta completa de l\'API:', propostaCreat);
          throw new Error('L\'API no ha retornat l\'identificador de la proposta d\'esdeveniment');
        }

        // Si l'id és 0, potser l'API encara no l'ha processat
        if (propostaEsdevenimentId === 0) {
          console.warn('L\'API ha retornat id: 0. Pot ser que necessitis esperar o fer una petició GET després de crear.');
        }

        await Promise.all(concertsEsdeveniment.map(concert => 
          createPropostaConcert(crearPayloadPropostaConcert(concert, propostaEsdevenimentId, {
            ciutat: esdevenimentData.ciutat,
            lloc: esdevenimentData.lloc,
            preuPerDefecte: esdevenimentData.preu,
          }))
        ));
      }
      await refrescarDades();

      setMissatge({
        tipus: 'success',
        text: esAdmin ? 'Esdeveniment i concerts creats correctament!' : 'Proposta d\'esdeveniment enviada correctament!',
      });
      setEsdevenimentData({
        nom: '',
        descripcio: '',
        dataInici: '',
        dataFi: '',
        lloc: '',
        ciutat: '',
        preu: '',
        imatge: null
      });
      setConcertsEsdeveniment([{ ...concertEsdevenimentBuit }]);

      if (esdevenimentId) {
        setTimeout(() => {
          router.push(`/esdeveniment/${esdevenimentId}`);
        }, 1200);
      }
    } catch (error) {
      setMissatge({ tipus: 'error', text: error.message || 'No s\'ha pogut crear l\'esdeveniment' });
    } finally {
      setEnviant(false);
    }
  };

  return (
    <div className="container">
      <div className="crear-page">
        <h1>Crear Concert o Esdeveniment</h1>
        <p className="text-muted">
          {esAdmin
            ? 'Pots crear concerts i esdeveniments directament.'
            : usuariVerificat
              ? 'Pots crear concerts directes dels teus grups gestionats i proposar la resta.'
              : 'Verifica el teu compte per poder enviar propostes de concerts o festivals.'}
        </p>

        {/* Selector de tipus de formulari */}
        <div className="tipus-selector">
          <button
            className={`tipus-btn ${tipusFormulari === 'concert' ? 'active' : ''}`}
            onClick={() => {
              setTipusFormulari('concert');
              setMissatge(null);
            }}
          >
            🎸 Crear Concert
          </button>
          <button
            className={`tipus-btn ${tipusFormulari === 'esdeveniment' ? 'active' : ''}`}
            onClick={() => {
              setTipusFormulari('esdeveniment');
              setMissatge(null);
            }}
          >
            🎪 Crear Esdeveniment/Festival
          </button>
        </div>

        {/* Missatges */}
        {missatge && (
          <div className={`alert alert-${missatge.tipus === 'error' ? 'error' : 'success'}`}>
            {missatge.text}
          </div>
        )}

        {/* Formulari de Concert */}
        {tipusFormulari === 'concert' && (
          <form onSubmit={handleConcertSubmit} className="crear-form">
            <div className="form-group">
              <label className="form-label" htmlFor="grupId">
                Grup Musical <span className="required">*</span>
              </label>
              <GrupSearchInput
                key={`concert-${concertData.grupId || 'sense-grup'}`}
                id="grupId"
                value={concertData.grupId}
                grups={grups}
                onChange={handleConcertGrupChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="titol">
                Títol del concert <span className="required">*</span>
              </label>
              <input
                type="text"
                id="titol"
                name="titol"
                value={concertData.titol}
                onChange={handleConcertChange}
                className="form-control"
                placeholder="Ex: Txarango - Gira 2025"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="data">
                  Data <span className="required">*</span>
                </label>
                <input
                  type="date"
                  id="data"
                  name="data"
                  value={concertData.data}
                  onChange={handleConcertChange}
                  className="form-control"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="hora">
                  Hora <span className="required">*</span>
                </label>
                <input
                  type="time"
                  id="hora"
                  name="hora"
                  value={concertData.hora}
                  onChange={handleConcertChange}
                  className="form-control"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="lloc">
                Lloc <span className="required">*</span>
              </label>
              <input
                type="text"
                id="lloc"
                name="lloc"
                value={concertData.lloc}
                onChange={handleConcertChange}
                className="form-control"
                placeholder="Ex: Palau Sant Jordi"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="ciutat">
                Ciutat <span className="required">*</span>
              </label>
              <input
                type="text"
                id="ciutat"
                name="ciutat"
                value={concertData.ciutat}
                onChange={handleConcertChange}
                className="form-control"
                placeholder="Ex: Barcelona"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="preu">
                Preu (€)
              </label>
              <input
                type="number"
                id="preu"
                name="preu"
                value={concertData.preu}
                onChange={handleConcertChange}
                className="form-control"
                placeholder="0 si és gratuït"
                min="0"
                step="0.01"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="descripcio">
                Descripció
              </label>
              <textarea
                id="descripcio"
                name="descripcio"
                value={concertData.descripcio}
                onChange={handleConcertChange}
                className="form-control"
                rows="4"
                placeholder="Descripció del concert, informació addicional..."
              ></textarea>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary btn-lg">
                {enviant ? 'Creant...' : 'Crear Concert'}
              </button>
              <button 
                type="button" 
                onClick={() => router.push('/')}
                className="btn btn-secondary"
                disabled={enviant}
              >
                Cancel·lar
              </button>
            </div>
          </form>
        )}

        {/* Formulari d'Esdeveniment */}
        {tipusFormulari === 'esdeveniment' && (
          <form onSubmit={handleEsdevenimentSubmit} className="crear-form">
            <div className="form-group">
              <label className="form-label" htmlFor="nom">
                Nom de l&apos;esdeveniment <span className="required">*</span>
              </label>
              <input
                type="text"
                id="nom"
                name="nom"
                value={esdevenimentData.nom}
                onChange={handleEsdevenimentChange}
                className="form-control"
                placeholder="Ex: Canet Rock 2025"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="descripcio">
                Descripció <span className="required">*</span>
              </label>
              <textarea
                id="descripcio"
                name="descripcio"
                value={esdevenimentData.descripcio}
                onChange={handleEsdevenimentChange}
                className="form-control"
                rows="4"
                placeholder="Descripció de l'esdeveniment o festival..."
                required
              ></textarea>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="dataInici">
                  Data d&apos;inici <span className="required">*</span>
                </label>
                <input
                  type="date"
                  id="dataInici"
                  name="dataInici"
                  value={esdevenimentData.dataInici}
                  onChange={handleEsdevenimentChange}
                  className="form-control"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="dataFi">
                  Data de fi <span className="required">*</span>
                </label>
                <input
                  type="date"
                  id="dataFi"
                  name="dataFi"
                  value={esdevenimentData.dataFi}
                  onChange={handleEsdevenimentChange}
                  className="form-control"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="lloc">
                Lloc <span className="required">*</span>
              </label>
              <input
                type="text"
                id="lloc"
                name="lloc"
                value={esdevenimentData.lloc}
                onChange={handleEsdevenimentChange}
                className="form-control"
                placeholder="Ex: Platja de Canet de Mar"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="ciutat">
                Ciutat <span className="required">*</span>
              </label>
              <input
                type="text"
                id="ciutat"
                name="ciutat"
                value={esdevenimentData.ciutat}
                onChange={handleEsdevenimentChange}
                className="form-control"
                placeholder="Ex: Canet de Mar"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="preu-esdeveniment">
                Preu del festival (€)
              </label>
              <input
                type="number"
                id="preu-esdeveniment"
                name="preu"
                value={esdevenimentData.preu}
                onChange={handleEsdevenimentChange}
                className="form-control"
                placeholder="0 si és gratuït"
                min="0"
                step="0.01"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="imatge-esdeveniment">
                Foto del festival
              </label>
              <input
                type="file"
                id="imatge-esdeveniment"
                name="imatge"
                onChange={handleEsdevenimentChange}
                className="form-control"
                accept="image/png,image/jpeg,image/webp,image/gif"
              />
              {esdevenimentData.imatge && (
                <p className="text-muted file-selected">{esdevenimentData.imatge.name}</p>
              )}
            </div>

            <div className="concerts-esdeveniment">
              <div className="concerts-esdeveniment-header">
                <div>
                  <h2>Concerts de l&apos;esdeveniment</h2>
                  <p className="text-muted">Aquests concerts es crearan vinculats al nou esdeveniment.</p>
                </div>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={afegirConcertEsdeveniment}
                  disabled={enviant}
                >
                  Afegir concert
                </button>
              </div>

              {concertsEsdeveniment.map((concert, index) => (
                <div className="concert-esdeveniment-item" key={index}>
                  <div className="concert-esdeveniment-title">
                    <h3>Concert {index + 1}</h3>
                    {concertsEsdeveniment.length > 1 && (
                      <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        onClick={() => eliminarConcertEsdeveniment(index)}
                        disabled={enviant}
                      >
                        Eliminar
                      </button>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor={`concert-grup-${index}`}>
                      Grup Musical <span className="required">*</span>
                    </label>
                    <GrupSearchInput
                      key={`concert-esdeveniment-${index}-${concert.grupId || 'sense-grup'}`}
                      id={`concert-grup-${index}`}
                      value={concert.grupId}
                      grups={grups}
                      onChange={(grupId) => handleConcertEsdevenimentGrupChange(index, grupId)}
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label" htmlFor={`concert-data-${index}`}>
                        Data <span className="required">*</span>
                      </label>
                      <input
                        type="date"
                        id={`concert-data-${index}`}
                        name="data"
                        value={concert.data}
                        min={esdevenimentData.dataInici}
                        max={esdevenimentData.dataFi}
                        onChange={(e) => handleConcertEsdevenimentChange(index, e)}
                        className="form-control"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor={`concert-hora-${index}`}>
                        Hora <span className="required">*</span>
                      </label>
                      <input
                        type="time"
                        id={`concert-hora-${index}`}
                        name="hora"
                        value={concert.hora}
                        onChange={(e) => handleConcertEsdevenimentChange(index, e)}
                        className="form-control"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor={`concert-preu-${index}`}>
                      Preu (€)
                    </label>
                    <input
                      type="number"
                      id={`concert-preu-${index}`}
                      name="preu"
                      value={concert.preu}
                      onChange={(e) => handleConcertEsdevenimentChange(index, e)}
                      className="form-control"
                      placeholder="En blanc: mateix preu que el festival"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary btn-lg">
                {enviant ? 'Creant...' : 'Crear Esdeveniment'}
              </button>
              <button 
                type="button" 
                onClick={() => router.push('/')}
                className="btn btn-secondary"
                disabled={enviant}
              >
                Cancel·lar
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
