import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

interface MessageRow {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

async function getMessages(): Promise<MessageRow[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("messages")
    .select("id, name, email, message, created_at")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data as MessageRow[];
}

export default async function AdminMessagesPage() {
  const messages = await getMessages();

  return (
    <div>
      <h1 className="font-display text-3xl text-ink">Messages</h1>
      <p className="mt-2 text-sm text-ink/60">
        Submissions from the /contact form. Read-only — reply to people
        directly by email or WhatsApp.
      </p>

      {messages.length === 0 ? (
        <p className="mt-8 text-sm text-ink/60">No messages yet.</p>
      ) : (
        <div className="mt-6 flex flex-col gap-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className="rounded-lg border border-paper-line bg-white p-5"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div>
                  <span className="font-medium text-ink">{m.name}</span>
                  <span className="ml-2 text-sm text-ink/50">{m.email}</span>
                </div>
                <span className="text-xs text-ink/40">
                  {new Date(m.created_at).toLocaleString()}
                </span>
              </div>
              <p className="mt-3 whitespace-pre-wrap text-sm text-ink/80">
                {m.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
