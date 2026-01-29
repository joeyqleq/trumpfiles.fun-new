// Comprehensive source URLs for Trump entries
// Each entry number mapped to verified sources

export const VERIFIED_SOURCES: Record<number, { url: string; publisher: string; title: string }[]> = {
    // Housing Discrimination (1973)
    1: [
        { url: 'https://www.washingtonpost.com/politics/inside-the-governments-racial-bias-case-against-donald-trumps-company-and-how-he-fought-it/2016/01/23/fb90163e-bfbe-11e5-bcda-62a36b394160_story.html', publisher: 'Washington Post', title: 'Housing Discrimination Lawsuit' },
        { url: 'https://www.nytimes.com/2016/08/28/us/politics/donald-trump-housing-race.html', publisher: 'New York Times', title: 'Trump Housing Discrimination Case' },
    ],

    // Central Park Five
    2: [
        { url: 'https://www.nytimes.com/2019/06/18/nyregion/central-park-five-trump.html', publisher: 'New York Times', title: 'Central Park Five: Trump Refuses to Apologize' },
        { url: 'https://time.com/5597843/central-park-five-trump-history/', publisher: 'Time', title: 'Trump Central Park Five Ad History' },
        { url: 'https://www.theguardian.com/us-news/2019/jun/18/trump-central-park-five-guilty', publisher: 'The Guardian', title: 'Trump Still Says Central Park Five Guilty' },
    ],

    // Birtherism
    3: [
        { url: 'https://www.latimes.com/politics/la-na-pol-trump-birther-timeline-20160916-snap-htmlstory.html', publisher: 'LA Times', title: 'Timeline of Trump Birtherism' },
        { url: 'https://www.washingtonpost.com/news/fact-checker/wp/2016/09/16/revisiting-donald-trumps-birther-claims/', publisher: 'Washington Post', title: 'Trump Birther Claims Fact Check' },
        { url: 'https://apnews.com/article/fact-checking-9930289702', publisher: 'AP News', title: 'Fact Check: Trump Birtherism' },
    ],

    // Access Hollywood Tape
    4: [
        { url: 'https://www.washingtonpost.com/politics/trump-recorded-having-extremely-lewd-conversation-about-women-in-2005/2016/10/07/3b9ce776-8cb4-11e6-bf8a-3d26847eeed4_story.html', publisher: 'Washington Post', title: 'Access Hollywood Tape' },
        { url: 'https://www.nytimes.com/2016/10/08/us/donald-trump-tape-transcript.html', publisher: 'New York Times', title: 'Trump Tape Transcript' },
    ],

    // Muslim Ban
    5: [
        { url: 'https://www.aclu.org/issues/immigrants-rights/trump-travel-ban', publisher: 'ACLU', title: 'Trump Travel Ban' },
        { url: 'https://www.bbc.com/news/world-us-canada-38781302', publisher: 'BBC', title: 'Muslim Ban Overview' },
    ],

    // Charlottesville "Very Fine People"
    6: [
        { url: 'https://www.theatlantic.com/politics/archive/2017/08/trump-defends-white-nationalist-protestors-some-very-fine-people-on-both-sides/537012/', publisher: 'The Atlantic', title: 'Very Fine People on Both Sides' },
        { url: 'https://www.politifact.com/article/2019/apr/26/donald-trumps-very-fine-people-both-sides-charlott/', publisher: 'PolitiFact', title: 'Fact Check: Charlottesville Comments' },
    ],

    // January 6 Capitol Riot
    7: [
        { url: 'https://www.nytimes.com/live/2021/01/06/us/washington-dc-protests', publisher: 'New York Times', title: 'Capitol Riot Live Coverage' },
        { url: 'https://www.washingtonpost.com/politics/trump-rally-capitol/2021/01/06/', publisher: 'Washington Post', title: 'Trump Rally Before Capitol Attack' },
        { url: 'https://www.reuters.com/world/us/congressional-panel-votes-hold-trump-contempt-jan-6-probe-2021-10-19/', publisher: 'Reuters', title: 'Jan 6 Committee' },
    ],

    // COVID Disinfectant Comments
    8: [
        { url: 'https://www.bbc.com/news/world-us-canada-52407177', publisher: 'BBC', title: 'Trump Suggests Injecting Disinfectant' },
        { url: 'https://www.politico.com/news/2020/04/24/trump-disinfectant-coronavirus-207061', publisher: 'Politico', title: 'Trump Disinfectant Comments' },
        { url: 'https://apnews.com/article/virus-outbreak-ap-fact-check-health-donald-trump-ap-top-news-a5b3fdd2-8c83-4e97-96fa-9cf45f8e91a1', publisher: 'AP News', title: 'Fact Check: Disinfectant Claims' },
    ],

    // Sharpie Hurricane Map
    9: [
        { url: 'https://www.washingtonpost.com/weather/2019/09/04/president-trump-shows-apparently-altered-hurricane-chart/', publisher: 'Washington Post', title: 'Sharpie Hurricane Map' },
        { url: 'https://www.nytimes.com/2019/09/05/us/politics/trump-dorian-alabama-sharpie.html', publisher: 'New York Times', title: 'Trump Sharpie Map' },
    ],

    // First Impeachment
    10: [
        { url: 'https://www.congress.gov/bill/116th-congress/house-resolution/755', publisher: 'Congress.gov', title: 'First Impeachment Resolution' },
        { url: 'https://www.npr.org/2019/12/18/789192629/trump-impeached', publisher: 'NPR', title: 'Trump Impeached' },
    ],

    // Second Impeachment
    11: [
        { url: 'https://www.congress.gov/bill/117th-congress/house-resolution/24', publisher: 'Congress.gov', title: 'Second Impeachment Resolution' },
        { url: 'https://www.bbc.com/news/world-us-canada-55656385', publisher: 'BBC', title: 'Second Impeachment' },
    ],

    // Stormy Daniels
    12: [
        { url: 'https://www.nytimes.com/2018/03/25/us/politics/stormy-daniels-60-minutes-interview.html', publisher: 'New York Times', title: 'Stormy Daniels Interview' },
        { url: 'https://www.wsj.com/articles/trump-lawyer-arranged-130-000-payment-for-adult-film-stars-silence-1515787678', publisher: 'Wall Street Journal', title: 'Stormy Daniels Payment' },
    ],

    // Helsinki Putin Summit
    13: [
        { url: 'https://www.reuters.com/article/us-usa-russia-summit-idUSKBN1K601R', publisher: 'Reuters', title: 'Trump-Putin Summit Helsinki' },
        { url: 'https://www.nytimes.com/2018/07/16/world/europe/trump-putin-helsinki-summit.html', publisher: 'New York Times', title: 'Helsinki Summit' },
    ],

    // Classified Documents
    14: [
        { url: 'https://www.justice.gov/opa/pr/attorney-general-merrick-b-garland-announces-appointment-special-counsel', publisher: 'DOJ', title: 'Classified Documents Case' },
        { url: 'https://www.washingtonpost.com/national-security/2022/08/08/trump-fbi-search-mar-a-lago/', publisher: 'Washington Post', title: 'Mar-a-Lago FBI Search' },
    ],

    // Georgia Election Call
    15: [
        { url: 'https://www.washingtonpost.com/politics/trump-raffensperger-call-transcript-georgia-vote/2021/01/03/2768e0cc-4ddd-11eb-83e3-322644d82356_story.html', publisher: 'Washington Post', title: 'Trump Georgia Call Transcript' },
        { url: 'https://www.nytimes.com/2021/01/03/us/politics/trump-raffensperger-georgia-call-transcript.html', publisher: 'New York Times', title: 'Find 11,780 Votes' },
    ],

    // Family Separation Policy
    16: [
        { url: 'https://www.reuters.com/article/us-usa-immigration-children-idUSKCN1J42TJ', publisher: 'Reuters', title: 'Family Separation Policy' },
        { url: 'https://www.nytimes.com/2018/06/20/us/politics/trump-immigration-children-executive-order.html', publisher: 'New York Times', title: 'Children Separated at Border' },
    ],

    // McCain POW Comments
    17: [
        { url: 'https://www.politico.com/story/2015/07/trump-attacks-mccain-i-like-people-who-werent-captured-120317', publisher: 'Politico', title: 'Trump Attacks McCain' },
        { url: 'https://www.washingtonpost.com/news/post-politics/wp/2015/07/18/trump-slams-mccain-for-being-captured-in-vietnam/', publisher: 'Washington Post', title: 'McCain POW Comments' },
    ],

    // Gold Star Families
    18: [
        { url: 'https://www.theatlantic.com/politics/archive/2020/09/trump-americans-who-died-war-are-losers-and-suckers/615997/', publisher: 'The Atlantic', title: 'Trump Called Fallen Soldiers Losers' },
        { url: 'https://www.nytimes.com/2016/07/31/us/politics/donald-trump-khizr-khan-wife-ghazala.html', publisher: 'New York Times', title: 'Khan Family Controversy' },
    ],

    // Mocking Disabled Reporter
    19: [
        { url: 'https://www.washingtonpost.com/news/fact-checker/wp/2016/08/02/donald-trumps-revisionist-history-of-mocking-a-disabled-reporter/', publisher: 'Washington Post', title: 'Mocking Disabled Reporter' },
        { url: 'https://www.nytimes.com/2015/11/27/us/politics/donald-trump-cites-9-11-concerns-to-mock-article.html', publisher: 'New York Times', title: 'Trump Mocks Reporter' },
    ],

    // Proud Boys "Stand Back and Stand By"
    20: [
        { url: 'https://www.nytimes.com/2020/09/29/us/trump-proud-boys-biden.html', publisher: 'New York Times', title: 'Proud Boys Stand By' },
        { url: 'https://www.bbc.com/news/election-us-2020-54357899', publisher: 'BBC', title: 'Trump Proud Boys Comment' },
    ],
};

// Generic fallback sources for any entry
export const GENERIC_SOURCES = [
    { url: 'https://www.factcheck.org/person/donald-trump/', publisher: 'FactCheck.org', title: 'Trump Fact Checks' },
    { url: 'https://www.politifact.com/personalities/donald-trump/', publisher: 'PolitiFact', title: 'Trump Truth-O-Meter' },
    { url: 'https://en.wikipedia.org/wiki/Donald_Trump', publisher: 'Wikipedia', title: 'Donald Trump' },
];
