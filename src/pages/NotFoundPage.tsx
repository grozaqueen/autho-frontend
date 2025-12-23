import React from "react";
import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div className="main">
      <div className="card">
        <h1 className="h1">404</h1>
        <p className="sub">Страница не найдена.</p>
        <div className="row" style={{ marginTop: 12 }}>
          <Link className="btn" to="/">На главную</Link>
        </div>
      </div>
    </div>
  );
}
