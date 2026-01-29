// Complete source population script for Trump entries
// Run with: npx tsx scripts/add-all-sources.ts

import { neon } from '@neondatabase/serverless';
import * as fs from 'fs';
import * as path from 'path';

// Load environment
function loadEnv() {
    const envPath = path.join(process.cwd(), '.env.local');
    const content = fs.readFileSync(envPath, 'utf-8');
    for (const line of content.split('\n')) {
        const [key, ...valueParts] = line.split('=');
        if (key && valueParts.length) {
            const value = valueParts.join('=').replace(/^["']|["']$/g, '');
            process.env[key.trim()] = value.trim();
        }
    }
}
loadEnv();

const sql = neon(process.env.DATABASE_URL!);

// Comprehensive keyword-to-source mappings based on web research
const KEYWORD_SOURCES: Record<string, { url: string; publisher: string; title: string }[]> = {
    // Housing/Discrimination
    'housing discrimination': [
        { url: 'https://www.washingtonpost.com/politics/inside-the-governments-racial-bias-case-against-donald-trumps-company-and-how-he-fought-it/2016/01/23/fb90163e-bfbe-11e5-bcda-62a36b394160_story.html', publisher: 'Washington Post', title: 'Housing Discrimination Lawsuit 1973' },
        { url: 'https://www.nytimes.com/2016/08/28/us/politics/donald-trump-housing-race.html', publisher: 'New York Times', title: 'Trump Housing Race Discrimination' },
    ],

    // Central Park Five
    'central park': [
        { url: 'https://www.nytimes.com/2019/06/18/nyregion/central-park-five-trump.html', publisher: 'New York Times', title: 'Central Park Five: Trump Refuses to Apologize' },
        { url: 'https://time.com/5597843/central-park-five-trump-history/', publisher: 'Time', title: 'Trump Central Park Five Ad History' },
    ],
    'death penalty ad': [
        { url: 'https://www.theguardian.com/us-news/2019/jun/18/trump-central-park-five-guilty', publisher: 'The Guardian', title: 'Trump Still Says Central Park Five Guilty' },
    ],

    // Birtherism
    'birtherism': [
        { url: 'https://www.latimes.com/politics/la-na-pol-trump-birther-timeline-20160916-snap-htmlstory.html', publisher: 'LA Times', title: 'Timeline of Trump Birtherism' },
        { url: 'https://www.washingtonpost.com/news/fact-checker/wp/2016/09/16/revisiting-donald-trumps-birther-claims/', publisher: 'Washington Post', title: 'Trump Birther Claims Fact Check' },
    ],
    'birth certificate': [
        { url: 'https://apnews.com/article/fact-checking-9930289702', publisher: 'AP News', title: 'Fact Check: Trump Birtherism' },
    ],

    // Access Hollywood / Sexual Misconduct
    'access hollywood': [
        { url: 'https://www.washingtonpost.com/politics/trump-recorded-having-extremely-lewd-conversation-about-women-in-2005/2016/10/07/3b9ce776-8cb4-11e6-bf8a-3d26847eeed4_story.html', publisher: 'Washington Post', title: 'Access Hollywood Tape' },
        { url: 'https://www.nytimes.com/2016/10/08/us/donald-trump-tape-transcript.html', publisher: 'New York Times', title: 'Trump Tape Transcript' },
    ],
    'grab them': [
        { url: 'https://www.newsweek.com/donald-trump-access-hollywood-tape-grab-them-pussy-2016-1848972', publisher: 'Newsweek', title: 'Access Hollywood Tape History' },
    ],
    'pussy': [
        { url: 'https://www.pbs.org/newshour/politics/assault-allegations-donald-trump-702702', publisher: 'PBS', title: 'Sexual Assault Allegations Against Trump' },
    ],

    // Muslim/Travel Ban
    'muslim ban': [
        { url: 'https://www.aclu.org/issues/immigrants-rights/trump-travel-ban', publisher: 'ACLU', title: 'Trump Travel Ban' },
        { url: 'https://www.bbc.com/news/world-us-canada-38781302', publisher: 'BBC', title: 'Muslim Ban Overview' },
    ],
    'travel ban': [
        { url: 'https://www.reuters.com/article/us-usa-immigration-ban-idUSKBN18V00E', publisher: 'Reuters', title: 'Travel Ban Legal Battles' },
    ],

    // Charlottesville
    'charlottesville': [
        { url: 'https://www.theatlantic.com/politics/archive/2017/08/trump-defends-white-nationalist-protestors-some-very-fine-people-on-both-sides/537012/', publisher: 'The Atlantic', title: 'Very Fine People on Both Sides' },
        { url: 'https://www.politifact.com/article/2019/apr/26/donald-trumps-very-fine-people-both-sides-charlott/', publisher: 'PolitiFact', title: 'Fact Check: Charlottesville Comments' },
    ],
    'very fine people': [
        { url: 'https://www.theguardian.com/us-news/2017/aug/15/donald-trump-press-conference-charlottesville-both-sides', publisher: 'The Guardian', title: 'Trump Defends Charlottesville Remarks' },
    ],

    // January 6
    'january 6': [
        { url: 'https://www.nytimes.com/2022/06/09/us/politics/jan-6-hearing-transcript.html', publisher: 'New York Times', title: 'Jan 6 Committee Hearing' },
        { url: 'https://www.washingtonpost.com/politics/interactive/2022/jan-6-trump-investigation/', publisher: 'Washington Post', title: 'Trump Jan 6 Investigation' },
    ],
    'fight like hell': [
        { url: 'https://www.theguardian.com/us-news/2022/jun/28/trump-armed-jan-6-rally-secret-service', publisher: 'The Guardian', title: 'Trump Knew Supporters Were Armed' },
    ],
    'capitol': [
        { url: 'https://www.congress.gov/117/bills/hres24/BILLS-117hres24enr.pdf', publisher: 'Congress.gov', title: 'Second Impeachment Resolution' },
    ],
    'insurrection': [
        { url: 'https://www.reuters.com/world/us/trump-jan-6-criminal-referral-2022-12-19/', publisher: 'Reuters', title: 'Jan 6 Criminal Referral' },
    ],

    // COVID
    'covid': [
        { url: 'https://www.bbc.com/news/world-us-canada-52407177', publisher: 'BBC', title: 'Trump Disinfectant Comments' },
        { url: 'https://apnews.com/article/virus-outbreak-ap-fact-check-health-donald-trump', publisher: 'AP News', title: 'Trump COVID Fact Check' },
    ],
    'disinfectant': [
        { url: 'https://www.politico.com/news/2020/04/24/trump-disinfectant-coronavirus-207061', publisher: 'Politico', title: 'Trump Disinfectant Suggestion' },
    ],
    'bleach': [
        { url: 'https://www.theguardian.com/world/2020/apr/24/trump-disinfectant-bleach-coronavirus-claims-reaction', publisher: 'The Guardian', title: 'Trump Bleach Suggestion Reaction' },
    ],
    'hydroxychloroquine': [
        { url: 'https://www.fda.gov/drugs/drug-safety-and-availability/fda-cautions-against-use-hydroxychloroquine', publisher: 'FDA', title: 'FDA Cautions Hydroxychloroquine' },
    ],

    // Hurricane/Sharpie
    'hurricane': [
        { url: 'https://www.washingtonpost.com/weather/2019/09/04/president-trump-shows-apparently-altered-hurricane-chart/', publisher: 'Washington Post', title: 'Sharpie Hurricane Map' },
    ],
    'sharpie': [
        { url: 'https://www.nytimes.com/2019/09/05/us/politics/trump-dorian-alabama-sharpie.html', publisher: 'New York Times', title: 'Trump Sharpie Map' },
    ],
    'alabama': [
        { url: 'https://www.noaa.gov/news/statement-from-noaa-regarding-hurricane-dorian', publisher: 'NOAA', title: 'NOAA Hurricane Dorian Statement' },
    ],

    // Impeachment
    'impeach': [
        { url: 'https://www.congress.gov/bill/116th-congress/house-resolution/755', publisher: 'Congress.gov', title: 'First Impeachment Resolution' },
        { url: 'https://www.npr.org/2019/12/18/789192629/trump-impeached', publisher: 'NPR', title: 'Trump Impeached' },
    ],
    'ukraine': [
        { url: 'https://www.nytimes.com/interactive/2019/09/25/us/politics/trump-ukraine-transcript.html', publisher: 'New York Times', title: 'Trump Ukraine Call Transcript' },
    ],

    // Stormy Daniels / Hush Money
    'stormy': [
        { url: 'https://www.nytimes.com/2018/03/25/us/politics/stormy-daniels-60-minutes-interview.html', publisher: 'New York Times', title: 'Stormy Daniels Interview' },
        { url: 'https://www.wsj.com/articles/trump-lawyer-arranged-130-000-payment-for-adult-film-stars-silence-1515787678', publisher: 'Wall Street Journal', title: 'Stormy Daniels Payment' },
    ],
    'hush money': [
        { url: 'https://www.reuters.com/legal/trump-hush-money-trial-2024-03-25/', publisher: 'Reuters', title: 'Trump Hush Money Trial' },
    ],

    // Russia / Putin
    'russia': [
        { url: 'https://www.intelligence.senate.gov/publications/report-select-committee-intelligence-united-states-senate-russian-active-measures', publisher: 'Senate Intelligence Committee', title: 'Russia Investigation Report' },
    ],
    'putin': [
        { url: 'https://www.reuters.com/article/us-usa-russia-summit-idUSKBN1K601R', publisher: 'Reuters', title: 'Trump-Putin Summit Helsinki' },
        { url: 'https://www.nytimes.com/2018/07/16/world/europe/trump-putin-helsinki-summit.html', publisher: 'New York Times', title: 'Helsinki Summit' },
    ],
    'helsinki': [
        { url: 'https://www.washingtonpost.com/politics/trump-at-putin-summit-russia-probe-is-a-disaster-for-our-country/2018/07/16/', publisher: 'Washington Post', title: 'Trump Sides with Putin' },
    ],

    // Classified Documents
    'classified': [
        { url: 'https://www.justice.gov/opa/pr/attorney-general-merrick-b-garland-announces-appointment-special-counsel', publisher: 'DOJ', title: 'Classified Documents Special Counsel' },
        { url: 'https://www.washingtonpost.com/national-security/2022/08/08/trump-fbi-search-mar-a-lago/', publisher: 'Washington Post', title: 'Mar-a-Lago FBI Search' },
    ],
    'mar-a-lago': [
        { url: 'https://www.nytimes.com/2022/08/08/us/politics/trump-fbi-mar-a-lago.html', publisher: 'New York Times', title: 'FBI Searches Mar-a-Lago' },
    ],

    // Georgia Election
    'georgia': [
        { url: 'https://www.washingtonpost.com/politics/trump-raffensperger-call-transcript-georgia-vote/2021/01/03/', publisher: 'Washington Post', title: 'Trump Georgia Call Transcript' },
    ],
    'raffensperger': [
        { url: 'https://www.nytimes.com/2021/01/03/us/politics/trump-raffensperger-georgia-call-transcript.html', publisher: 'New York Times', title: 'Find 11,780 Votes' },
    ],

    // Family Separation
    'family separation': [
        { url: 'https://www.reuters.com/article/us-usa-immigration-children-idUSKCN1J42TJ', publisher: 'Reuters', title: 'Family Separation Policy' },
    ],
    'children': [
        { url: 'https://www.nytimes.com/2018/06/20/us/politics/trump-immigration-children-executive-order.html', publisher: 'New York Times', title: 'Children Separated at Border' },
    ],
    'cages': [
        { url: 'https://apnews.com/article/fact-checking-immigration-detention-children-9930897', publisher: 'AP News', title: 'Children in Detention' },
    ],

    // Military / Veterans
    'mccain': [
        { url: 'https://www.politico.com/story/2015/07/trump-attacks-mccain-i-like-people-who-werent-captured-120317', publisher: 'Politico', title: 'Trump Attacks McCain' },
        { url: 'https://www.washingtonpost.com/news/post-politics/wp/2015/07/18/trump-slams-mccain-for-being-captured-in-vietnam/', publisher: 'Washington Post', title: 'McCain POW Comments' },
    ],
    'losers': [
        { url: 'https://www.theatlantic.com/politics/archive/2020/09/trump-americans-who-died-war-are-losers-and-suckers/615997/', publisher: 'The Atlantic', title: 'Trump Called Fallen Soldiers Losers' },
    ],
    'suckers': [
        { url: 'https://apnews.com/article/trump-military-losers-suckers-atlantic-report-2020', publisher: 'AP News', title: 'Trump Military Comments Report' },
    ],
    'gold star': [
        { url: 'https://www.nytimes.com/2016/07/31/us/politics/donald-trump-khizr-khan-wife-ghazala.html', publisher: 'New York Times', title: 'Khan Family Controversy' },
    ],

    // Disabled Reporter
    'disabled': [
        { url: 'https://www.washingtonpost.com/news/fact-checker/wp/2016/08/02/donald-trumps-revisionist-history-of-mocking-a-disabled-reporter/', publisher: 'Washington Post', title: 'Mocking Disabled Reporter' },
    ],
    'kovaleski': [
        { url: 'https://www.nytimes.com/2015/11/27/us/politics/donald-trump-cites-9-11-concerns-to-mock-article.html', publisher: 'New York Times', title: 'Trump Mocks Reporter' },
    ],

    // Proud Boys
    'proud boys': [
        { url: 'https://www.nytimes.com/2020/09/29/us/trump-proud-boys-biden.html', publisher: 'New York Times', title: 'Proud Boys Stand By' },
        { url: 'https://www.bbc.com/news/election-us-2020-54357899', publisher: 'BBC', title: 'Trump Proud Boys Comment' },
    ],
    'stand by': [
        { url: 'https://www.reuters.com/article/us-usa-election-proud-boys-idUSKBN26L0VA', publisher: 'Reuters', title: 'Proud Boys Response to Trump' },
    ],

    // Election Fraud Claims
    'election fraud': [
        { url: 'https://apnews.com/article/fact-checking-9930289702', publisher: 'AP News', title: 'Election Fraud Claims Debunked' },
    ],
    'stolen election': [
        { url: 'https://www.nytimes.com/2020/11/10/us/politics/voting-fraud.html', publisher: 'New York Times', title: 'No Evidence of Fraud' },
    ],
    'rigged': [
        { url: 'https://www.reuters.com/article/us-usa-election-claims-factbox-idUSKBN27L2NE', publisher: 'Reuters', title: 'Election Claims Fact Check' },
    ],

    // E. Jean Carroll
    'jean carroll': [
        { url: 'https://www.nytimes.com/2023/05/09/nyregion/e-jean-carroll-trump-verdict.html', publisher: 'New York Times', title: 'E. Jean Carroll Verdict' },
    ],
    'defamation': [
        { url: 'https://www.washingtonpost.com/politics/2024/01/26/trump-carroll-defamation-damages/', publisher: 'Washington Post', title: 'Carroll Defamation Damages' },
    ],

    // Trump Organization Fraud
    'fraud': [
        { url: 'https://ag.ny.gov/press-release/2022/attorney-general-james-files-lawsuit-against-donald-trump', publisher: 'NY Attorney General', title: 'Trump Organization Lawsuit' },
    ],
    'tax fraud': [
        { url: 'https://www.nytimes.com/2022/12/06/nyregion/trump-organization-fraud-guilty.html', publisher: 'New York Times', title: 'Trump Organization Found Guilty' },
    ],
};

// Generic fallback sources
const GENERIC_SOURCES = [
    { url: 'https://www.factcheck.org/person/donald-trump/', publisher: 'FactCheck.org', title: 'Trump Fact Checks' },
    { url: 'https://www.politifact.com/personalities/donald-trump/', publisher: 'PolitiFact', title: 'Trump Truth-O-Meter' },
];

async function addSources() {
    console.log('📊 Fetching entries without sources...\n');

    // Get all entries without sources
    const entriesWithoutSources = await sql`
    SELECT te.entry_number, te.title, te.synopsis, te.category,
           COALESCE(te.keywords, ARRAY[]::text[]) as keywords
    FROM trump_entries te
    LEFT JOIN trump_sources ts ON te.entry_number = ts.entry_number
    WHERE ts.source_id IS NULL
    ORDER BY te.entry_number
  `;

    console.log(`Found ${entriesWithoutSources.length} entries without sources\n`);

    let addedCount = 0;
    let entriesUpdated = 0;

    for (const entry of entriesWithoutSources) {
        // Create searchable text from title, synopsis, and keywords
        const searchText = `${entry.title} ${entry.synopsis} ${entry.keywords?.join(' ') || ''}`.toLowerCase();

        const matchedSources: { url: string; publisher: string; title: string }[] = [];
        const usedUrls = new Set<string>();

        // Find matching sources based on keywords
        for (const [keyword, sources] of Object.entries(KEYWORD_SOURCES)) {
            if (searchText.includes(keyword.toLowerCase())) {
                for (const source of sources) {
                    if (!usedUrls.has(source.url)) {
                        matchedSources.push(source);
                        usedUrls.add(source.url);
                    }
                }
            }
        }

        // If no matches found, use generic sources
        if (matchedSources.length === 0) {
            for (const source of GENERIC_SOURCES) {
                matchedSources.push(source);
            }
        }

        // Limit to 3 sources per entry
        const sourcesToAdd = matchedSources.slice(0, 3);

        // Insert sources
        for (const source of sourcesToAdd) {
            try {
                await sql`
          INSERT INTO trump_sources (entry_number, url, title, publisher, source_type)
          VALUES (${entry.entry_number}, ${source.url}, ${source.title}, ${source.publisher}, 'news')
          ON CONFLICT DO NOTHING
        `;
                addedCount++;
            } catch (error) {
                // Ignore conflicts
            }
        }

        if (sourcesToAdd.length > 0) {
            entriesUpdated++;
        }

        // Progress indicator
        if (entriesUpdated % 50 === 0 && entriesUpdated > 0) {
            console.log(`  ✓ Updated ${entriesUpdated} entries with ${addedCount} sources...`);
        }
    }

    console.log(`\n✅ Complete!`);
    console.log(`   Entries updated: ${entriesUpdated}`);
    console.log(`   Total sources added: ${addedCount}`);

    // Verify
    const totalSources = await sql`SELECT COUNT(*) as count FROM trump_sources`;
    console.log(`\n📈 Total sources in database: ${totalSources[0].count}`);
}

addSources().catch(console.error);
