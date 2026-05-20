"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { useAppContext } from '@/context/AppContext';
import './registre.css';

const sha256 = async (text) => {
  const encodedText = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', encodedText);

  return Array.from(new Uint8Array(hashBuffer))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
};

export default function RegistrationPage() {
  const { registrar } = useAppContext();
  const router = useRouter();
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [registrant, setRegistrant] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Les contrasenyes no coincideixen');
      return;
    }

    setRegistrant(true);
    try {
      const contrasenyaHash = await sha256(password);
      const resultat = await registrar(nom.trim(), email.trim(), contrasenyaHash);
      if (!resultat.success) {
        setError(resultat.error);
        return;
      }

      setSuccess('Registre completat. Revisa el teu correu i verifica el compte abans de proposar concerts o festivals.');
      setTimeout(() => router.push('/'), 2500);
    } catch (err) {
      setError(err.message || 'No s\'ha pogut registrar l\'usuari. Comprova que l\'API estigui engegada.');
    } finally {
      setRegistrant(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="registration-container">
        <form className="registre" onSubmit={handleSubmit}>
          <h2>Registre</h2>
          <label htmlFor="nom">Nom</label>
          <input id="nom" value={nom} onChange={(e) => setNom(e.target.value)} required />

          <label htmlFor="email">Email</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

          <label htmlFor="password">Contrasenya</label>
          <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

          <label htmlFor="confirmPassword">Confirma la contrasenya</label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          {error && <div className="validation-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <button className="btn btn-primary" type="submit" disabled={registrant}>
            {registrant ? 'Registrant...' : 'Registrar-me'}
          </button>
          <p>Ja tens compte? <Link href="/login">Inicia sessio</Link></p>
        </form>
      </main>
    </>
  );
}
