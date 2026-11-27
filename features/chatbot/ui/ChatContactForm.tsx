"use client";

// features/chatbot/ui/ChatContactForm.tsx
//
// Mini formulario de datos de contacto que aparece ANTES de poder escribir en el chat.
//
// ¿Cuándo aparece? Solo si en el intranet está activado "Pedir datos de contacto"
// (Sitio Web → ChatBot → Configuración → Comportamiento = `require_contact_data`). Hoy viene
// apagado: el chat es anónimo (el visitante solo se identifica con un uuid del navegador, ver
// lib/chatStorage.ts). Si lo activas:
//   - acá se pide nombre + teléfono (correo opcional) y se guarda con PATCH /visitors/{token};
//   - el backend además lo EXIGE: rechaza mensajes con 422 si faltan, así que no se puede
//     saltar desde el navegador.
// Para pedir más campos (ej. distrito): agrégalos acá, en UpdateVisitorRequestDto
// (types/chat.types.ts) y en la tabla/validación chatbot_visitor del backend.

import { useState, type FormEvent } from "react";
import type { ChatVisitor, UpdateVisitorRequestDto } from "../types/chat.types";

interface ChatContactFormProps {
  primaryColor: string;
  initial: ChatVisitor | null;
  isSaving: boolean;
  error: string | null;
  onSubmit: (data: UpdateVisitorRequestDto) => void;
}

const inputClass =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-gray-500";

export default function ChatContactForm({ primaryColor, initial, isSaving, error, onSubmit }: ChatContactFormProps) {
  const [name, setName] = useState(initial?.name ?? "");
  const [phone, setPhone] = useState(initial?.phone ?? "");
  const [email, setEmail] = useState(initial?.email ?? "");

  const canSubmit = name.trim().length > 1 && phone.replace(/\D/g, "").length >= 6 && !isSaving;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    onSubmit({
      name: name.trim(),
      phone: phone.trim(),
      ...(email.trim() ? { email: email.trim() } : {}),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="shrink-0 space-y-2 border-t border-gray-200 bg-white p-3">
      <p className="text-xs text-gray-600">Antes de continuar, déjanos tus datos para poder ayudarte mejor.</p>

      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nombre *" aria-label="Nombre" maxLength={120} autoComplete="name" className={inputClass} />
      <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Teléfono / celular *" aria-label="Teléfono" maxLength={30} inputMode="tel" autoComplete="tel" className={inputClass} />
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Correo (opcional)" aria-label="Correo" type="email" maxLength={150} autoComplete="email" className={inputClass} />

      {error && <p className="text-xs text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={!canSubmit}
        className="w-full rounded-lg py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-40"
        style={{ backgroundColor: primaryColor }}
      >
        {isSaving ? "Guardando..." : "Continuar"}
      </button>
    </form>
  );
}
