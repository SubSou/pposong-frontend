import { create } from "zustand";

export type OnlineUser = {
  userId: number;
  username: string;
  profileImageUrl: string | null;
};

type OnlineUserState = {
  users: OnlineUser[];
  setUsers: (users: OnlineUser[]) => void;
  clearUsers: () => void;
};

export const useOnlineUserStore = create<OnlineUserState>((set) => ({
  users: [],

  setUsers: (users) => {
    set({ users });
  },

  clearUsers: () => {
    set({ users: [] });
  },
}));
