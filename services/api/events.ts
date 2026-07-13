import type { PublicEvent } from "@/types/api";
import { apiRequest } from "./client";

export async function getPublicEvents() {
<<<<<<< HEAD
  return apiRequest<PublicEvent[]>("/public/events", { auth: false });
}

export async function getPublicEventById(id: number) {
  return apiRequest<PublicEvent>(`/public/events/${id}`, { auth: false });
=======
  return apiRequest<PublicEvent[]>("/public/events");
}

export async function getPublicEventById(id: number) {
  return apiRequest<PublicEvent>(`/public/events/${id}`);
>>>>>>> 12c1d04f4a77f81e50344195c7411b286fd976e6
}
