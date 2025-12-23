import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export function HomePage() {
  const { user } = useAuth();

  return (
    <div className="main">

      <div className="card">
        {!user ? (
          <>
            <p className="sub">Сначала зайдите или зарегистрируйтесь.</p>
            <div className="row" style={{ marginTop: 12 }}>
              <Link className="btn" to="/login">Вход</Link>
              <Link className="btn" to="/signup">Регистрация</Link>
            </div>
          </>
        ) : (
          <>
            <p className="sub">Вы вошли как <b>{user.username}</b>.</p>
            <div className="row" style={{ marginTop: 12 }}>
              <Link className="btn" to="/profile">Открыть профиль</Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
