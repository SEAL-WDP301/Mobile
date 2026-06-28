import { io, Socket } from "socket.io-client";
import { getSocketBaseUrl } from "@/constants/api";
import { getAccessToken } from "./api/tokenStorage";

type ChatSocket = Socket;

let socket: ChatSocket | null = null;
let connectPromise: Promise<ChatSocket> | null = null;

export async function getChatSocket(): Promise<ChatSocket> {
  if (socket?.connected) return socket;
  if (connectPromise) return connectPromise;

  connectPromise = (async () => {
    const token = await getAccessToken();
    if (!token) {
      throw new Error("Chưa đăng nhập");
    }

    if (socket) {
      socket.disconnect();
      socket = null;
    }

    socket = io(`${getSocketBaseUrl()}/chat`, {
      auth: { token },
      extraHeaders: {
        Authorization: `Bearer ${token}`,
      },
      transports: ["websocket"],
      autoConnect: true,
    });

    await new Promise<void>((resolve, reject) => {
      if (!socket) {
        reject(new Error("Không khởi tạo được socket"));
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

export async function joinTeamRoom(teamId: number) {
  const client = await getChatSocket();
  client.emit("join_team_room", teamId);
}

export async function leaveTeamRoom(teamId: number) {
  if (!socket?.connected) return;
  socket.emit("leave_team_room", teamId);
}

export async function sendTeamMessage(teamId: number, content: string) {
  const client = await getChatSocket();
  client.emit("send_chat_message", { teamId, content });
}

export async function markTeamMessagesRead(teamId: number) {
  const client = await getChatSocket();
  client.emit("mark_as_read", teamId);
}

export async function joinMentorRoom(teamId: number, mentorId: number) {
  const client = await getChatSocket();
  client.emit("join_mentor_room", { teamId, mentorId });
}

export async function leaveMentorRoom(teamId: number, mentorId: number) {
  if (!socket?.connected) return;
  socket.emit("leave_mentor_room", { teamId, mentorId });
}

export async function sendMentorMessage(
  teamId: number,
  mentorId: number,
  content: string,
) {
  const client = await getChatSocket();
  client.emit("send_mentor_message", { teamId, mentorId, content });
}

export async function markMentorMessagesRead(teamId: number, mentorId: number) {
  const client = await getChatSocket();
  client.emit("mark_mentor_as_read", { teamId, mentorId });
}

export function disconnectChatSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
  connectPromise = null;
}
