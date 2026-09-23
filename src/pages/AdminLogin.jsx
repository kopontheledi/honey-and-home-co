import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

import { auth } from '../lib/firebase';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  async function submit(event) {
    event.preventDefault();

    try {
      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      navigate('/admin');
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <section className="auth-card">
      <h1>Admin login</h1>

      <form onSubmit={submit}>
        <label>
          Email

          <input
            type="email"
            required
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
          />
        </label>

        <label>
          Password

          <input
            type="password"
            required
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
          />
        </label>

        <button className="button">
          Sign in
        </button>

        {error && (
          <p>{error}</p>
        )}
      </form>
    </section>
  );
}