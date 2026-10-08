import { create } from "zustand";
import { getMyProfile, type ProfileResponse } from "../api/profile";

interface ProfileState {
  profile: ProfileResponse | null;
  loading: boolean;
  error: string | null;

  fetchProfile: () => Promise<void>;
  clearProfile: () => void;
}

export const useProfileStore = create<ProfileState>((set) => ({
  profile: null,
  loading: false,
  error: null,

  fetchProfile: async () => {
    set({
      loading: true,
      error: null,
    });

    try {
      const profile = await getMyProfile();

      set({
        profile,
        loading: false,
      });
    } catch (error) {
      set({
        profile: null,
        loading: false,
        error:
          error instanceof Error
            ? error.message
            : "프로필을 불러오지 못했습니다.",
      });
    }
  },

  clearProfile: () => {
    set({
      profile: null,
      error: null,
    });
  },
}));
