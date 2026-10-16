export type GuestStatus = "pending" | "yes" | "no";

export type Guest = {
  id: string;
  code: string;
  name: string;
  phone: string | null;
  source: "invite" | "generic";
  status: GuestStatus;
  companions_count: number;
  companions_names: string[];
  sent_at: string | null;
  responded_at: string | null;
  created_at: string;
};

/** What the public invite page is allowed to see (no phone, no admin fields). */
export type PublicGuest = Pick<Guest, "code" | "name" | "status" | "companions_count" | "companions_names" | "responded_at">;

export const PUBLIC_GUEST_COLUMNS = "code, name, status, companions_count, companions_names, responded_at";
