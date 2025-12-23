import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export function NavBar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  return (
    <div className="nav">
      <Link className="brand" to="/">Autho</Link>

      <div className="navLinks">
        {!user ? (
          <>
            <NavLink className="pill" to="/login">Вход</NavLink>
            <NavLink className="pill" to="/signup">Регистрация</NavLink>
          </>
        ) : (
          <>
            <NavLink className="pill" to="/profile">Профиль</NavLink>
            <button
              className="btn btnDanger"
              onClick={async () => {
                await logout();
                nav("/login");
              }}
            >
              Выйти
            </button>
          </>
        )}
      </div>
    </div>
  );
}
