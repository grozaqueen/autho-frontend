import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export function LoginPage() {
  const { login, error } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  return (
    <div className="main">
      <div className="card">
        <h1 className="h1">Вход</h1>

        <form
          className="form"
          onSubmit={async (e) => {
            e.preventDefault();
            setLocalError(null);
            setBusy(true);
            try {
              await login(email, password);
              nav("/profile");
            } catch (e2) {
              setLocalError(e2 instanceof Error ? e2.message : "Ошибка входа");
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
            Пароль
            <input className="input" value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
          </label>

          <div className="row">
            <button className="btn" type="submit" disabled={busy}>
              {busy ? "Входим..." : "Войти"}
            </button>
            <Link className="pill" to="/signup">Нет аккаунта? Регистрация</Link>
          </div>

          {(localError || error) ? <div className="alert">{localError || error}</div> : null}
        </form>
      </div>
    </div>
  );
}
