import { NextRequest, NextResponse } from "next/server";

const MOCK_RESULTS = [
  { id: "EFTA-2026-0847", title: "FBI 302: Woman accuses Trump of sexual abuse at age 13-15 (circa 1983)", date: "2026-03-14", type: "FBI 302", danger: 10, pages: 53 },
  { id: "EFTA-2026-0291", title: "FBI NTOC email: 13-14 year old forced to perform oral sex on Trump in NJ", date: "2026-02-28", type: "FBI Internal", danger: 10, pages: 7 },
  { id: "EFTA-2025-1834", title: "Civil lawsuit: Survivor recruited into trafficking ring at Mar-a-Lago at age 15", date: "2025-11-02", type: "Court Filing", danger: 9.8, pages: 34 },
  { id: "EFTA-2019-0023", title: "Acosta transition team meeting: 'Epstein belonged to intelligence'", date: "2019-07-12", type: "Deposition", danger: 9.5, pages: 12 },
  { id: "EFTA-2024-0567", title: "Maxwell clemency petition citing Trump relationship", date: "2024-08-19", type: "Legal Filing", danger: 9.2, pages: 28 },
  { id: "EFTA-2006-0089", title: "Trump Tower identified as Epstein recruitment site in FBI interview", date: "2006-05-14", type: "FBI 302", danger: 9.5, pages: 8 },
  { id: "EFTA-2002-0134", title: "NY Magazine interview: Trump calls Epstein 'terrific guy' who likes women 'on the younger side'", date: "2002-10-28", type: "Media", danger: 8.8, pages: 3 },
  { id: "EFTA-2025-2103", title: "Seven Trump family members identified in Epstein contact files", date: "2025-06-30", type: "DOJ Release", danger: 8.5, pages: 19 },
  { id: "EFTA-2020-0412", title: "DOJ blocks release of 147 pages of Trump-Epstein communications", date: "2020-01-15", type: "DOJ Correspondence", danger: 9.0, pages: 4 },
  { id: "EFTA-2019-0891", title: "Iran strike timing analysis: Soleimani killed during Epstein hearing week", date: "2020-01-03", type: "Analysis", danger: 8.7, pages: 15 },
  { id: "EFTA-2005-0234", title: "Palm Beach PD initial complaint: underage girl names Trump as present during abuse", date: "2005-03-15", type: "Police Report", danger: 9.7, pages: 11 },
  { id: "EFTA-2008-0091", title: "Non-prosecution agreement: DOJ grants immunity to unnamed co-conspirators including Trump", date: "2008-06-30", type: "Legal Agreement", danger: 9.8, pages: 6 },
  { id: "EFTA-2025-0412", title: "Deposition transcript: Witness describes Trump at Epstein Palm Beach mansion with minors", date: "2025-04-18", type: "Deposition", danger: 9.6, pages: 42 },
  { id: "EFTA-2006-0145", title: "FBI interview: Former Epstein employee confirms Trump visits to island", date: "2006-09-22", type: "FBI 302", danger: 9.3, pages: 15 },
  { id: "EFTA-2025-1002", title: "DOJ internal memo: Instruction to redact Trump name from Epstein case files", date: "2025-02-10", type: "DOJ Correspondence", danger: 9.9, pages: 3 },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.toLowerCase() || "";
  const type = searchParams.get("type") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100);

  let results = MOCK_RESULTS;

  if (query) {
    results = results.filter(
      (doc) =>
        doc.title.toLowerCase().includes(query) ||
        doc.type.toLowerCase().includes(query) ||
        doc.id.toLowerCase().includes(query)
    );
  }

  if (type) {
    results = results.filter((doc) => doc.type.toLowerCase() === type.toLowerCase());
  }

  const total = results.length;
  const offset = (page - 1) * limit;
  const paginated = results.slice(offset, offset + limit);

  return NextResponse.json({
    results: paginated,
    total,
    page,
    totalPages: Math.ceil(total / limit),
    query: query || null,
  });
}
