import { io, Socket } from "socket.io-client";

import { getSocketBaseUrl } from "@/constants/api";
import { getAccessToken } from "@/services/api/tokenStorage";

let socket: Socket | null = null;
let connectPromise: Promise<Socket> | null = null;

export async function getFeedbackSocket(): Promise<Socket> {
  if (socket?.connected) return socket;
  if (connectPromise) return connectPromise;

  connectPromise = (async () => {
    const token = await getAccessToken();
    if (!token) {
      throw new Error("Chưa đăng nhập");
    }

    socket?.disconnect();
    socket = io(getSocketBaseUrl(), {
      auth: { token },
      extraHeaders: {
        Authorization: `Bearer ${token}`,
      },
      transports: ["websocket"],
      autoConnect: true,
      reconnection: true,
    });

    await new Promise<void>((resolve, reject) => {
      if (!socket) {
        reject(new Error("Không khởi tạo được feedback socket"));
        return;
      }

      const onConnect = () => {
        cleanup();
        resolve();
      };
      const onError = (error: Error) => {
        cleanup();
        reject(error);
      };
      const cleanup = () => {
        socket?.off("connect", onConnect);
        socket?.off("connect_error", onError);
      };

      socket.on("connect", onConnect);
      socket.on("connect_error", onError);
    });

    return socket;
  })();

  try {
    return await connectPromise;
  } finally {
    connectPromise = null;
  }
}

export function disconnectFeedbackSocket() {
  socket?.disconnect();
  socket = null;
  connectPromise = null;
}
