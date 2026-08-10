import { create } from "zustand";
// import { getHomeSections } from "@/features/home/services/getHomeSections.core.service";
// import type { HomeSectionDto } from "@/features/home/dtos/getHomeSections.dto";
import { HttpError } from "@/shared/api/http/httpClient";
import { notify } from "@/shared/lib/notify";

type HomeState = {
  // sections: HomeSectionDto[];
  isLoading: boolean;
  error: string | null;
  fetchSections: () => Promise<void>;
};

export const useHomeStore = create<HomeState>((set) => ({
  sections: [],
  isLoading: false,
  error: null,

  fetchSections: async () => {
    set({ isLoading: true, error: null });

    try {
      // const sections = await getHomeSections();
      // set({ sections, isLoading: false });
      
      set({ isLoading: false });
    } catch (err) {
      const message = err instanceof HttpError ? err.message : "No se pudo cargar la informacion del home";
      set({ error: message, isLoading: false });
      notify.error(message);
    }
  },
}));
