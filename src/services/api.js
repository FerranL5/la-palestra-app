const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';
const API_ORIGIN = API_URL.replace(/\/api\/?$/, '');

const DEFAULT_IMAGE = '/img/no-image.jpg';

const normalizeImage = (value) => {
  if (!value) {
    return DEFAULT_IMAGE;
  }

  if (String(value).startsWith('http')) {
    return value;
  }

  if (String(value).startsWith('/uploads/')) {
    return `${API_ORIGIN}${value}`;
  }

  if (String(value).startsWith('/')) {
    return value;
  }

  return `/img/${value}`;
};

async function request(endpoint, options = {}) {
  const isFormData = options.body instanceof FormData;
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Error carregant ${endpoint}: ${response.status}`);
  }

  if (response.status === 204) {
    return null;
  }

  const text = await response.text();
  if (!text) {
    return null;
  }

  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    return text;
  }

  return JSON.parse(text);
}

const getValue = (item, ...keys) => {
  for (const key of keys) {
    if (item?.[key] !== undefined && item?.[key] !== null) {
      return item[key];
    }
  }

  return undefined;
};

const toDate = (value) => {
  if (!value) {
    return '';
  }

  return String(value).split('T')[0];
};

const toTime = (value) => {
  if (!value || !String(value).includes('T')) {
    return '';
  }

  return String(value).split('T')[1]?.slice(0, 5) || '';
};

const normalizeGrup = (grup) => ({
  id: getValue(grup, 'id', 'Id'),
  nom: getValue(grup, 'nomGrup', 'NomGrup', 'nom', 'Nom') || 'Grup sense nom',
  descripcio: getValue(grup, 'descripcio', 'Descripcio') || 'Sense descripcio disponible.',
  genere: getValue(grup, 'genere', 'Genere') || 'Musica',
  imatge: normalizeImage(getValue(grup, 'img', 'Img', 'imatge', 'Imatge')),
  paisOrigen: getValue(grup, 'regio', 'Regio', 'paisOrigen', 'PaisOrigen') || 'Sense regio',
  oientsMensuals: getValue(grup, 'oientsMensuals', 'OientsMensuals') || 0,
  discograficaId: getValue(grup, 'discografica', 'Discografica'),
  usuariId: getValue(grup, 'idUsuari', 'IdUsuari'),
});

const normalizeEsdeveniment = (esdeveniment) => ({
  id: getValue(esdeveniment, 'id', 'Id'),
  nom: getValue(esdeveniment, 'nomEsdeveniment', 'NomEsdeveniment', 'nom', 'Nom') || 'Esdeveniment sense nom',
  descripcio: getValue(esdeveniment, 'descripcio', 'Descripcio') || 'Sense descripcio disponible.',
  dataInici: toDate(getValue(esdeveniment, 'dataInici', 'DataInici')),
  dataFi: toDate(getValue(esdeveniment, 'dataFi', 'DataFi') || getValue(esdeveniment, 'dataInici', 'DataInici')),
  lloc: getValue(esdeveniment, 'espai', 'Espai', 'lloc', 'Lloc') || 'Espai pendent',
  ciutat: getValue(esdeveniment, 'poblacio', 'Poblacio', 'ciutat', 'Ciutat') || 'Poblacio pendent',
  imatge: normalizeImage(getValue(esdeveniment, 'img', 'Img', 'imatge', 'Imatge')),
  preu: getValue(esdeveniment, 'preu', 'Preu') || 0,
  linkEntrades: getValue(esdeveniment, 'linkEntrades', 'LinkEntrades') || '',
});

const normalizeConcert = (concert, grupsById, esdevenimentsById) => {
  const grupId = getValue(concert, 'grup', 'Grup', 'grupId', 'GrupId');
  const esdevenimentId = getValue(concert, 'esdeveniment', 'Esdeveniment', 'esdevenimentId', 'EsdevenimentId');
  const dataConcert = getValue(concert, 'dataConcert', 'DataConcert', 'data', 'Data');
  const grup = grupsById.get(grupId);
  const esdeveniment = esdevenimentId ? esdevenimentsById.get(esdevenimentId) : null;
  const espai = getValue(concert, 'espai', 'Espai', 'lloc', 'Lloc') || 'Espai pendent';

  return {
    id: getValue(concert, 'id', 'Id'),
    grupId,
    titol: getValue(concert, 'titol', 'Titol') || `${grup?.nom || 'Concert'} - ${esdeveniment?.nom || espai}`,
    data: toDate(dataConcert),
    hora: getValue(concert, 'hora', 'Hora') || toTime(dataConcert) || 'Hora pendent',
    lloc: espai,
    ciutat: getValue(concert, 'poblacio', 'Poblacio', 'ciutat', 'Ciutat') || 'Poblacio pendent',
    preu: getValue(concert, 'preu', 'Preu') || 0,
    descripcio: getValue(concert, 'descripcio', 'Descripcio') || '',
    imatge: normalizeImage(getValue(concert, 'img', 'Img', 'imatge', 'Imatge') || grup?.imatge),
    esdevenimentId,
    linkEntrades: getValue(concert, 'linkEntrades', 'LinkEntrades') || '',
  };
};

const normalizeUsuari = (usuari) => ({
  ...usuari,
  id: getValue(usuari, 'id', 'Id'),
  nomUsuari: getValue(usuari, 'nomUsuari', 'NomUsuari'),
  email: getValue(usuari, 'email', 'Email'),
  notificacions: Boolean(getValue(usuari, 'notificacions', 'Notificacions')),
  verificat: getValue(usuari, 'verificat', 'Verificat'),
  grupsPreferits: (getValue(usuari, 'grups', 'Grups') || []).map(grup => getValue(grup, 'id', 'Id')),
});

export async function getAppData() {
  const [grupsApi, concertsApi, esdevenimentsApi] = await Promise.all([
    request('/Grup'),
    request('/Concert'),
    request('/Esdeveniment'),
  ]);

  const grups = grupsApi.map(normalizeGrup);
  const esdeveniments = esdevenimentsApi.map(normalizeEsdeveniment);
  const grupsById = new Map(grups.map((grup) => [grup.id, grup]));
  const esdevenimentsById = new Map(esdeveniments.map((esdeveniment) => [esdeveniment.id, esdeveniment]));
  const concerts = concertsApi.map((concert) => normalizeConcert(concert, grupsById, esdevenimentsById));

  return {
    grups,
    concerts,
    esdeveniments,
  };
}

export async function getUsuaris() {
  return request('/Usuari');
}

export async function getUsuari(id) {
  return normalizeUsuari(await request(`/Usuari/${id}`));
}

export async function loginUsuari({ email, contrasenya }) {
  const params = new URLSearchParams({
    email,
    contrasenya,
  });

  return normalizeUsuari(await request(`/Usuari/Login?${params.toString()}`));
}

export async function getAdministradors() {
  return await request('/Administrador');
}

export async function getDiscografiques() {
  return request('/Discografica');
}

export async function createUsuari({ nom, email, contrasenya }) {
  return normalizeUsuari(await request('/Usuari', {
    method: 'POST',
    body: JSON.stringify({
      nomUsuari: nom,
      email,
      contrasenya,
      notificacions: true,
      verificat: 0,
      usRestingit: 0,
      restingitFins: null,
    }),
  }));
}

export async function updateNotificacionsUsuari(usuariId, notificacions) {
  return normalizeUsuari(await request(`/Usuari/${usuariId}/notificacions`, {
    method: 'PUT',
    body: JSON.stringify({ notificacions }),
  }));
}

export async function addPreferitUsuari(usuariId, grupId) {
  return normalizeUsuari(await request(`/Usuari/${usuariId}/preferits/${grupId}`, {
    method: 'POST',
  }));
}

export async function removePreferitUsuari(usuariId, grupId) {
  return normalizeUsuari(await request(`/Usuari/${usuariId}/preferits/${grupId}`, {
    method: 'DELETE',
  }));
}

export async function createEsdeveniment(esdeveniment) {
  return request('/Esdeveniment', {
    method: 'POST',
    body: JSON.stringify(esdeveniment),
  });
}

const uploadImage = (endpoint, file) => {
  const formData = new FormData();
  formData.append('imatge', file);

  return request(endpoint, {
    method: 'POST',
    body: formData,
  });
};

export async function uploadEsdevenimentImage(file) {
  return uploadImage('/Esdeveniment/imatge', file);
}

export async function uploadPropostaEsdevenimentImage(file) {
  return uploadImage('/PropostesEsdeveniment/imatge', file);
}

export async function uploadGrupImage(grupId, file) {
  return uploadImage(`/Grup/${grupId}/imatge`, file);
}

export async function createConcert(concert) {
  return request('/Concert', {
    method: 'POST',
    body: JSON.stringify(concert),
  });
}

export async function createPropostaConcert(concert) {
  console.log('Enviant proposta de concert:', concert);
  return request('/PropostesConcert', {
    method: 'POST',
    body: JSON.stringify(concert),
  });
}

export async function createPropostaEsdeveniment(esdeveniment) {
  return request('/PropostesEsdeveniment', {
    method: 'POST',
    body: JSON.stringify(esdeveniment),
  });
}

export async function getPropostesConcert() {
  return request('/PropostesConcert');
}

export async function getPropostesEsdeveniment() {
  return request('/PropostesEsdeveniment');
}

export async function verificarPropostaConcert(id) {
  return request(`/PropostesConcert/verificar/${id}`, {
    method: 'POST',
  });
}

export async function verificarPropostaEsdeveniment(id) {
  return request(`/PropostesEsdeveniment/verificar/${id}`, {
    method: 'POST',
  });
}

export async function eliminarPropostaConcert(id) {
  return request(`/PropostesConcert/${id}`, {
    method: 'DELETE',
  });
}

export async function eliminarPropostaEsdeveniment(id) {
  return request(`/PropostesEsdeveniment/${id}`, {
    method: 'DELETE',
  });
}

export async function actualitzarOientsMensuals() {
  return request('/Grup/OientsMensuals');
}

export async function actualitzarMesGrups() {
  return request('/Grup/MesGrups');
}

export async function actualitzarSpotifyIds() {
  return request('/Grup/SpotifyId');
}
