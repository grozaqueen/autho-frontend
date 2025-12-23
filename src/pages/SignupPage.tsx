import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export function SignupPage() {
  const { signup, error } = useAuth();
  const nav = useNavigate();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  return (
    <div className="main">
      <div className="card">
        <h1 className="h1">Регистрация</h1>
        <form
          className="form"
          onSubmit={async (e) => {
            e.preventDefault();
            setLocalError(null);
            if (password !== repeatPassword) {
              setLocalError("Пароли не совпадают");
              return;
            }
            setBusy(true);
            try {
              await signup(email, username, password, repeatPassword);
              nav("/profile");
            } catch (e2) {
              setLocalError(e2 instanceof Error ? e2.message : "Ошибка регистрации");
            } finally {
              setBusy(false);
            }
          }}
        >
          <label className="label">
            Email
            <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
          </label>

          <label className="label">
            Username
            <input className="input" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </label>

          <label className="label">
            Пароль
            <input className="input" value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
          </label>

          <label className="label">
            Повтор пароля
            <input className="input" value={repeatPassword} onChange={(e) => setRepeatPassword(e.target.value)} type="password" required />
          </label>

          <div className="row">
            <button className="btn" type="submit" disabled={busy}>
              {busy ? "Создаём..." : "Создать аккаунт"}
            </button>
            <Link className="pill" to="/login">Уже есть аккаунт? Вход</Link>
          </div>

          {(localError || error) ? <div className="alert">{localError || error}</div> : null}
        </form>
      </div>
    </div>
  );
}
