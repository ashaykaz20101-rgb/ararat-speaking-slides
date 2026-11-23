import {
  BriefcaseBusiness,
  Building2,
  Coins,
  Factory,
  GraduationCap,
  HandCoins,
  HeartPulse,
  Landmark,
  MapPin,
  Plane,
  Puzzle,
  School,
  Sprout,
  UserRound,
  Users,
  UsersRound,
  Wallet,
  type LucideIcon,
} from "lucide-react";

/** Public (published) address, so phones can open the vote page without any sign-in. */
export const PUBLIC_SITE_URL = "https://presentation-phi-lime.vercel.app";
export const VOTE_URL = `${PUBLIC_SITE_URL}/vote`;

export type PollOption = { key: string; label: string; icon: LucideIcon };
export type Poll = { id: string; question: string; options: PollOption[] };

/** The audience questions, in order. Option keys must match the database check on poll_votes. */
export const POLLS: Poll[] = [
  {
    id: "reduce-unemployment",
    question: "Ի՞նչը կօգնի նվազեցնել գործազրկությունը",
    options: [
      { key: "small_business", label: "Փոքր և միջին բիզնեսի աջակցություն", icon: BriefcaseBusiness },
      { key: "vocational", label: "Մասնագիտական կրթության զարգացում", icon: GraduationCap },
      { key: "youth", label: "Երիտասարդների պրակտիկա և աջակցություն", icon: Users },
      { key: "industries", label: "Գյուղատնտեսության, տուրիզմի և IT-ի զարգացում", icon: Sprout },
    ],
  },
  {
    id: "main-cause",
    question: "Ո՞րն է գործազրկության հիմնական պատճառը",
    options: [
      { key: "few_jobs", label: "Աշխատատեղերի պակասը", icon: Factory },
      { key: "skills_gap", label: "Կրթության և աշխատաշուկայի անհամապատասխանությունը", icon: Puzzle },
      { key: "low_wages", label: "Ցածր աշխատավարձերը", icon: Coins },
      { key: "experience", label: "Աշխատանքային փորձի պահանջը", icon: BriefcaseBusiness },
    ],
  },
  {
    id: "most-affected",
    question: "Ո՞վ է ամենաշատը տուժում գործազրկությունից",
    options: [
      { key: "young", label: "Երիտասարդները", icon: GraduationCap },
      { key: "women", label: "Կանայք", icon: UserRound },
      { key: "regions", label: "Մարզերի բնակիչները", icon: MapPin },
      { key: "older", label: "50 տարեկանից բարձր մարդիկ", icon: UsersRound },
    ],
  },
  {
    id: "worst-effect",
    question: "Գործազրկության ամենածանր հետևանքը",
    options: [
      { key: "family_income", label: "Ընտանիքների եկամտի անկումը", icon: Wallet },
      { key: "emigration", label: "Արտագաղթը", icon: Plane },
      { key: "budget", label: "Պետական բյուջեի կորուստները", icon: HandCoins },
      { key: "wellbeing", label: "Մարդկանց հոգեկան առողջությունը", icon: HeartPulse },
    ],
  },
  {
    id: "who-solves",
    question: "Ո՞վ պետք է առաջինը լուծի այս խնդիրը",
    options: [
      { key: "state", label: "Պետությունը", icon: Landmark },
      { key: "business", label: "Բիզնեսը", icon: Building2 },
      { key: "education", label: "Կրթական հաստատությունները", icon: School },
      { key: "everyone", label: "Մեզնից յուրաքանչյուրը", icon: Users },
    ],
  },
];

export type PollCounts = Record<string, number>;

export const emptyCounts = (poll: Poll): PollCounts => Object.fromEntries(poll.options.map((o) => [o.key, 0]));

export const totalVotes = (poll: Poll, counts: PollCounts) => poll.options.reduce((s, o) => s + (counts[o.key] ?? 0), 0);

/** Whole-number percentages that always add up to 100 (largest remainder); all 0 when nobody voted. */
export function computePercentages(poll: Poll, counts: PollCounts): PollCounts {
  const keys = poll.options.map((o) => o.key);
  const total = totalVotes(poll, counts);
  const result = emptyCounts(poll);
  if (total === 0) return result;
  const raw = keys.map((k) => ({ k, exact: ((counts[k] ?? 0) / total) * 100 }));
  raw.forEach(({ k, exact }) => (result[k] = Math.floor(exact)));
  let left = 100 - keys.reduce((s, k) => s + (result[k] ?? 0), 0);
  [...raw]
    .sort((a, b) => b.exact - Math.floor(b.exact) - (a.exact - Math.floor(a.exact)))
    .forEach(({ k }) => {
      if (left > 0) {
        result[k] = (result[k] ?? 0) + 1;
        left -= 1;
      }
    });
  return result;
}

export async function fetchPollCounts(poll: Poll): Promise<PollCounts> {
  const { supabase } = await import("@/integrations/supabase/client");
  const { data, error } = await supabase.rpc("get_poll_results", { p_poll_id: poll.id });
  if (error) throw error;
  const counts = emptyCounts(poll);
  for (const row of data ?? []) {
    if (row.option_key in counts) counts[row.option_key] = Number(row.votes);
  }
  return counts;
}

const VOTER_KEY = "poll-voter-id";
export const votedKey = (pollId: string) => `poll-voted-${pollId}`;

function voterId() {
  let id = window.localStorage.getItem(VOTER_KEY);
  if (!id) {
    id = crypto.randomUUID();
    window.localStorage.setItem(VOTER_KEY, id);
  }
  return id;
}

/** Saves one vote per device per question. Returns "already" when this device answered it before. */
export async function castVote(poll: Poll, option: string): Promise<"ok" | "already"> {
  const { supabase } = await import("@/integrations/supabase/client");
  const { error } = await supabase.from("poll_votes").insert({ poll_id: poll.id, option_key: option, voter_id: voterId() });
  if (error && error.code !== "23505") throw error;
  window.localStorage.setItem(votedKey(poll.id), option);
  return error ? "already" : "ok";
}
