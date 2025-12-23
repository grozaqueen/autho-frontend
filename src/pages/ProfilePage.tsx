import React, { useState } from "react";
import { useAuth } from "../auth/AuthContext";

type Banner = { kind: "ok" | "err"; text: string } | null;

export function ProfilePage() {
  const { user, refresh } = useAuth();
  const [busy, setBusy] = useState(false);
  const [banner, setBanner] = useState<Banner>(null);

  if (!user) return null;

  return (
    <div className="main">
      <div className="card">
        <h1 className="h1">Профиль</h1>

        <div className="kv">
          <div className="k">username</div><div>{user.username}</div>
          <div className="k">city</div><div>{user.city || "—"}</div>
        </div>

        {banner ? (
          <div
            className="alert"
            style={
              banner.kind === "ok"
                ? { borderColor: "rgba(45,212,191,0.35)", background: "rgba(45,212,191,0.08)" }
                : undefined
            }
          >
            {banner.text}
          </div>
        ) : null}

      </div>
    </div>
  );
}
