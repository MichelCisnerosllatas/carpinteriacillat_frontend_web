// features/testimony/ui/testimony-quick-form/QuickFormAccountButton.tsx
//
// Avatar redondo de la cuenta de Google ya elegida (formulario rápido).
// Click = cambiar de cuenta. Si la foto no carga, muestra la inicial del nombre.
"use client";

import { useState } from "react";
import type { GoogleUser } from "@/features/google-auth/store/google-auth.store";
import { loginWithGoogle } from "@/features/google-auth/lib/login-with-google";

type Props = {
    user: GoogleUser;
    disabled: boolean;
};

export default function QuickFormAccountButton({ user, disabled }: Props) {
    const [photoFailed, setPhotoFailed] = useState(false);
    const initial = (user.name ?? user.email ?? "?").trim().charAt(0).toUpperCase();

    return (
        <button
            type="button"
            onClick={loginWithGoogle}
            disabled={disabled}
            title={`${user.email} (cambiar cuenta)`}
            aria-label={`Cuenta ${user.email}. Cambiar cuenta`}
            className="inline-flex size-11 flex-none cursor-pointer items-center justify-center overflow-hidden rounded-full border border-il-neutro-200 bg-il-amarillo-100 text-sm font-bold text-il-neutro-900 transition-transform hover:scale-105 disabled:cursor-not-allowed"
        >
            {user.photoUrl && !photoFailed ? (
                // referrerPolicy: sin esto las fotos de googleusercontent suelen no cargar.
                // eslint-disable-next-line @next/next/no-img-element
                <img
                    src={user.photoUrl}
                    alt=""
                    referrerPolicy="no-referrer"
                    onError={() => setPhotoFailed(true)}
                    className="size-full object-cover"
                />
            ) : (
                initial
            )}
        </button>
    );
}
