"use client";

import type { SiteChatbotOptionDto } from "@/shared/services/site_service/model/siteget.dto";
import ChatOptionTile from "./ChatOptionTile";

interface ChatHomeProps {
  welcomeMessage: string;
  options: SiteChatbotOptionDto[];
  primaryColor: string;
  onSelect: (option: SiteChatbotOptionDto) => void;
}

// Primera pantalla del chatbot: saludo + lista de opciones (ListTiles).
export default function ChatHome({ welcomeMessage, options, primaryColor, onSelect }: ChatHomeProps) {
  return (
    <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-gray-50 p-4">
      <p className="mb-4 whitespace-pre-wrap text-sm leading-relaxed text-gray-700">{welcomeMessage}</p>

      <div className="space-y-2">
        {options.map((option) => (
          <ChatOptionTile key={option.id} option={option} primaryColor={primaryColor} onSelect={onSelect} />
        ))}
      </div>
    </div>
  );
}
