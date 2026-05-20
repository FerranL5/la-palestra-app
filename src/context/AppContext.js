"use client";

import { useCallback, createContext, useContext, useState, useEffect } from 'react';
import {
  addPreferitUsuari,
  createUsuari,
  getAdministradors,
  getAppData,
  getDiscografiques,
  getUsuari,
  getUsuaris,
  loginUsuari,
  removePreferitUsuari,
  updateNotificacionsUsuari,
} from '@/services/api';

// Crear el context
const AppContext = createContext();

// Hook personalitzat per utilitzar el context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext ha de ser utilitzat dins d\'un AppProvider');
  }
  return context;
};

// Provider del context
export const AppProvider = ({ children }) => {
  // Estats globals
  const [usuariActual, setUsuariActual] = useState(null);
  const [grupsPreferits, setGrupsPreferits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [grups, setGrups] = useState([]);
  const [concerts, setConcerts] = useState([]);
  const [esdeveniments, setEsdeveniments] = useState([]);

  const carregarDadesApp = useCallback(async () => {
    const dades = await getAppData();
    setGrups(dades.grups);
    setConcerts(dades.concerts);
    setEsdeveniments(dades.esdeveniments);
  }, []);

  // Carregar dades de localStorage quan es munta el component
  useEffect(() => {
    const carregarDades = async () => {
      try {
        const usuariGuardat = localStorage.getItem('usuariActual');
        if (usuariGuardat) {
          const usuari = JSON.parse(usuariGuardat);
          const usuariApi = await getUsuari(usuari.id);
          const usuariActualitzat = {
            ...usuari,
            notificacions: usuariApi.notificacions,
            grupsPreferits: usuariApi.grupsPreferits || usuari.grupsPreferits || [],
          };
          setUsuariActual(usuariActualitzat);
          setGrupsPreferits(usuariActualitzat.grupsPreferits);
          localStorage.setItem('usuariActual', JSON.stringify(usuariActualitzat));
        }

        await carregarDadesApp();
      } catch (err) {
        setError(err.message || 'No s\'han pogut carregar les dades de l\'API');
      } finally {
        setLoading(false);
      }
    };

    carregarDades();
  }, [carregarDadesApp]);

  // Funció de login
  const login = async (email, contrasenya) => {
    const usuari = await loginUsuari({ email, contrasenya });
    const [dades, administradors, discografiques] = await Promise.all([
      getAppData(),
      getAdministradors(),
      getDiscografiques(),
    ]);
    const admin = administradors.find(a => (a.idUsuari ?? a.IdUsuari) === usuari.id);
    const grupPropi = dades.grups.find(grup => grup.usuariId === usuari.id);
    const discografica = discografiques.find(d => (d.idUsuari ?? d.IdUsuari) === usuari.id);
    const grupsDiscografica = discografica
      ? dades.grups.filter(grup => grup.discograficaId === (discografica.id ?? discografica.Id))
      : [];

    let rol = 'usuari';
    if (admin) {
      rol = 'administrador';
    } else if (discografica) {
      rol = 'discografica';
    } else if (grupPropi) {
      rol = 'grup';
    }

    const usuariSensePassword = {
      id: usuari.id,
      nom: usuari.nomUsuari,
      email: usuari.email,
      verificat: Boolean(usuari.verificat ?? usuari.Verificat),
      notificacions: Boolean(usuari.notificacions ?? usuari.Notificacions),
      rol,
      administradorId: admin?.id ?? admin?.Id ?? null,
      grupId: grupPropi?.id ?? null,
      discograficaId: discografica?.id ?? discografica?.Id ?? null,
      grupsGestionats: rol === 'administrador'
        ? dades.grups.map(grup => grup.id)
        : rol === 'discografica'
          ? grupsDiscografica.map(grup => grup.id)
          : grupPropi
            ? [grupPropi.id]
            : [],
      grupsPreferits: usuari.grupsPreferits || [],
    };

    setUsuariActual(usuariSensePassword);
    setGrupsPreferits(usuariSensePassword.grupsPreferits);
    setGrups(dades.grups);
    setConcerts(dades.concerts);
    setEsdeveniments(dades.esdeveniments);
    localStorage.setItem('usuariActual', JSON.stringify(usuariSensePassword));

    return { success: true, usuari: usuariSensePassword };
  };

  // Funció de logout
  const logout = () => {
    setUsuariActual(null);
    setGrupsPreferits([]);
    localStorage.removeItem('usuariActual');
  };

  // Funció per afegir un grup als preferits
  const afegirPreferit = async (grupId) => {
    if (!usuariActual) {
      return { success: false, error: 'Has d\'iniciar sessió' };
    }

    if (grupsPreferits.includes(grupId)) {
      return { success: false, error: 'Aquest grup ja està als preferits' };
    }

    const usuariApi = await addPreferitUsuari(usuariActual.id, grupId);
    const nouGrupsPreferits = usuariApi.grupsPreferits || [...grupsPreferits, grupId];
    setGrupsPreferits(nouGrupsPreferits);

    // Actualitzar usuari al localStorage
    const usuariActualitzat = { ...usuariActual, grupsPreferits: nouGrupsPreferits };
    setUsuariActual(usuariActualitzat);
    localStorage.setItem('usuariActual', JSON.stringify(usuariActualitzat));

    return { success: true };
  };

  // Funció per eliminar un grup dels preferits
  const eliminarPreferit = async (grupId) => {
    if (!usuariActual) {
      return { success: false, error: 'Has d\'iniciar sessió' };
    }

    const usuariApi = await removePreferitUsuari(usuariActual.id, grupId);
    const nouGrupsPreferits = usuariApi.grupsPreferits || grupsPreferits.filter(id => id !== grupId);
    setGrupsPreferits(nouGrupsPreferits);

    // Actualitzar usuari al localStorage
    const usuariActualitzat = { ...usuariActual, grupsPreferits: nouGrupsPreferits };
    setUsuariActual(usuariActualitzat);
    localStorage.setItem('usuariActual', JSON.stringify(usuariActualitzat));

    return { success: true };
  };

  const actualitzarNotificacions = async (notificacions) => {
    if (!usuariActual) {
      return { success: false, error: 'Has d\'iniciar sessió' };
    }

    const usuariApi = await updateNotificacionsUsuari(usuariActual.id, notificacions);
    const usuariActualitzat = {
      ...usuariActual,
      notificacions: usuariApi.notificacions,
      grupsPreferits: usuariApi.grupsPreferits || usuariActual.grupsPreferits,
    };

    setUsuariActual(usuariActualitzat);
    setGrupsPreferits(usuariActualitzat.grupsPreferits);
    localStorage.setItem('usuariActual', JSON.stringify(usuariActualitzat));

    return { success: true, usuari: usuariActualitzat };
  };

  // Funció per comprovar si un grup és preferit
  const esPreferit = (grupId) => {
    return grupsPreferits.includes(grupId);
  };

  // Funció per obtenir un grup per ID
  const obtenirGrup = (id) => {
    return grups.find(g => g.id === parseInt(id));
  };

  // Funció per obtenir un concert per ID
  const obtenirConcert = (id) => {
    return concerts.find(c => c.id === parseInt(id));
  };

  // Funció per obtenir un esdeveniment per ID
  const obtenirEsdeveniment = (id) => {
    return esdeveniments.find(e => e.id === parseInt(id));
  };

  // Funció per obtenir concerts d'un grup
  const obtenirConcertsGrup = (grupId) => {
    return concerts.filter(c => c.grupId === parseInt(grupId));
  };

  // Funció per obtenir concerts d'un esdeveniment
  const obtenirConcertsEsdeveniment = (esdevenimentId) => {
    return concerts.filter(c => c.esdevenimentId === parseInt(esdevenimentId));
  };

  // Funció per obtenir concerts futurs ordenats per data
  const obtenirConcertsFuturs = () => {
    const avui = new Date().toISOString().split('T')[0];
    return concerts
      .filter(c => c.data >= avui)
      .sort((a, b) => a.data.localeCompare(b.data));
  };

  // Funció per obtenir concerts dels grups preferits
  const obtenirConcertsPreferits = () => {
    if (!usuariActual || grupsPreferits.length === 0) {
      return [];
    }

    const avui = new Date().toISOString().split('T')[0];
    return concerts
      .filter(c => grupsPreferits.includes(c.grupId) && c.data >= avui)
      .sort((a, b) => a.data.localeCompare(b.data));
  };

  // Funció de cerca (grups i concerts)
  const cercar = (query) => {
    const queryLower = query.toLowerCase();

    const grupsResultat = grups.filter(g =>
      g.nom.toLowerCase().includes(queryLower) ||
      g.genere.toLowerCase().includes(queryLower)
    );

    const concertsResultat = concerts.filter(c => {
      const grup = obtenirGrup(c.grupId);
      return c.titol.toLowerCase().includes(queryLower) ||
             c.ciutat.toLowerCase().includes(queryLower) ||
             grup?.nom.toLowerCase().includes(queryLower);
    });

    return {
      grups: grupsResultat,
      concerts: concertsResultat
    };
  };

  // Funció per registrar un nou usuari a l'API
  const registrar = async (nom, email, contrasenya) => {
    const usuarisApi = await getUsuaris();
    const existeix = usuarisApi.some(u => u.email?.toLowerCase() === email.toLowerCase());
    if (existeix) {
      return { success: false, error: 'Aquest email ja està registrat' };
    }

    const usuariCreat = await createUsuari({ nom, email, contrasenya });
    const usuariSensePassword = {
      id: usuariCreat.id,
      nom: usuariCreat.nomUsuari || nom,
      email: usuariCreat.email || email,
      rol: 'usuari',
      verificat: Boolean(usuariCreat.verificat ?? usuariCreat.Verificat),
      notificacions: Boolean(usuariCreat.notificacions ?? usuariCreat.Notificacions),
      administradorId: null,
      grupId: null,
      discograficaId: null,
      grupsGestionats: [],
      grupsPreferits: [],
    };

    setUsuariActual(usuariSensePassword);
    setGrupsPreferits([]);
    localStorage.setItem('usuariActual', JSON.stringify(usuariSensePassword));

    return {
      success: true,
      message: 'Registre completat! Sessió iniciada.',
      usuari: usuariSensePassword,
    };
  };

  // Valor del context que es proporcionarà als components fills
const value = {
  grups,
  concerts,
  esdeveniments,
  usuariActual,
  grupsPreferits,
  loading,
  error,

  login,
  logout,
  registrar,

  afegirPreferit,
  eliminarPreferit,
  actualitzarNotificacions,
  esPreferit,

  obtenirGrup,
  obtenirConcert,
  obtenirEsdeveniment,
  obtenirConcertsGrup,
  obtenirConcertsEsdeveniment,
  obtenirConcertsFuturs,
  obtenirConcertsPreferits,

  cercar,
  refrescarDades: carregarDadesApp,
};

  // if (loading) {
  //   return <div>Carregant...</div>;
  // }

  // if (error) {
  //   return <div>Error carregant les dades: {error}</div>;
  // }

  return (
    <AppContext.Provider value={value}>
      {loading ? <div>Carregant...</div> : children}
    </AppContext.Provider>
  );
};
