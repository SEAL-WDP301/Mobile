import type { PublicEvent } from "@/types/api";
import { apiRequest } from "./client";

export async function getPublicEvents() {
  return apiRequest<PublicEvent[]>("/public/events", { auth: false });
}

export async function getPublicEventById(id: number) {
  return apiRequest<PublicEvent>(`/public/events/${id}`, { auth: false });
}
