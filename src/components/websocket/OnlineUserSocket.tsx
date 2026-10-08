import { useEffect } from "react";
import { useOnlineUserStore } from "../../stores/onlineUserStore";

function OnlineUserSocket() {
  const setUsers = useOnlineUserStore((state) => state.setUsers);

  const clearUsers = useOnlineUserStore((state) => state.clearUsers);

  useEffect(() => {
    const token = sessionStorage.getItem("accessToken");

    if (!token) {
      return;
    }

    const socket = new WebSocket(
      `ws://localhost:8080/ws/online?token=${encodeURIComponent(token)}`,
    );

    socket.onopen = () => {
      console.log("WebSocket connected");
    };

    socket.onmessage = (event) => {
      const users = JSON.parse(event.data);

      console.log("Online users:", users);

      setUsers(users);
    };

    socket.onclose = () => {
      console.log("WebSocket disconnected");
      clearUsers();
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      socket.close();
    };
  }, [setUsers, clearUsers]);

  return null;
}

export default OnlineUserSocket;
