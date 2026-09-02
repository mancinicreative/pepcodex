# Council seat: Outsider

**Substitution:** This memo was written by Grok, sitting in the Outsider chair. I have no prior relationship with this project. I did not read the company’s internal lore. I treated pepcodex.com as a health website a stranger might open on a phone, then I read the assigned files and the audit packets that were already on the desk.

**Mode:** Audit only. No site edits.

**Date:** 2026-09-02

**What I opened:** `src/pages/about.astro`, `src/pages/directory.astro`, the first 80 lines of `src/pages/clinics/index.astro` plus the rest of that file because the first 80 lines already advertise a live clinic finder, the live-recon report, Audit C’s product assessment, Audit A’s strongest finding, `SafetyBanner.astro`, and the hardcoded `SafetyBanner` / `DrugSchema` lines in `DossierLayout.astro`.

---

## 1. First impression

The About page is a well-dressed promise.

It says peptide research should not require a PhD. Every claim is cited. Every uncertainty is acknowledged. No hype. No miracle claims. No medical advice. No dosing. No purchasing guide. There is an email, a methodology page, an editorial policy, and an advertising policy. The site launched in January 2026. That is a young site speaking with the voice of a library.

A first-time reader who stopped at About would think: serious people, cautious tone, I can use this to learn.

A first-time reader who kept clicking would not think that for long.

---

## 2. Would I trust this site?

No. Not as a place to decide anything about a medicine, a clinic, or a vial.

I might still read a page the way I read a blog: interesting, maybe useful, check the original paper yourself. I would not trust the badges. I would not trust the clinic list. I would not trust a number in a title. I would not trust a PubMed link without opening it. I would not send a relative here and say “this is the careful one.”

Trust, for a health site, is not fonts and disclaimers. Trust is whether the same sentence is true on two parts of the same page, and whether a named clinic exists if you try to call it. This site fails both tests in public.

The About page and the product are not the same organization. One is a pledge. The other is a stamp that prints the same warning on Ozempic and on research chemicals, a “Coming Soon” directory that already promises verified clinics, and a second directory that already lists clinics that are not real.

---

## 3. What a journalist would notice first

A journalist would not start with “crawl budget.” A journalist would open Google, type the site name, and then do three cheap checks.

**Check one: the Ozempic page.** Semaglutide is sold in pharmacies as Ozempic, Wegovy, and Rybelsus. The live page title boasts a study count. The same live page also shows a red badge that says **Not FDA Approved** and an orange badge that says **WADA Prohibited**. Hidden in the page’s machine label for search engines is the line **Research use only - not FDA approved for human use**. The visible description on that same page says the drug is FDA-approved for diabetes, obesity, heart risk, and liver disease. That is not a subtle error. That is a front-page screenshot. “Website that reviews Ozempic says Ozempic is not approved.”

**Check two: the clinic finder.** `/clinics` is titled “Find Peptide Clinics Near You.” It counts cities, clinics, and “Featured Partners.” It says the listings are verified so you connect with legitimate healthcare providers. Audit C opened eleven of those names on the open web. Zero matched. Phone numbers use 555, the movie number. Websites point at example.com, which is reserved for documentation and 404s. Addresses sit on real prestige streets: Park Avenue, Brickell, Wilshire, Hancock Center. Fake names on real corridors is how a story writes itself. A reporter can walk to 445 Park Avenue and not find “Manhattan Peptide Clinic.” Nearby there is a real practice at a different number. That is worse than a blank page. It is a near-miss that can smear a real doctor or send a patient to a ghost.

**Check three: the two directories.** `/directory` is indexable and says “Coming Soon” while still promising a curated list of verified clinics and telehealth. `/clinics` is already live with those fake listings, marked so search engines should not index it, but any person with the link can read it. The New York city page’s FAQ says New York has one peptide clinic and tells you to use “our directory” to find verified providers. The page called Directory is not that list. The site cannot keep its own filing cabinet straight.

A journalist would also notice the About page swears “we don’t recommend sources” and “we’re not a purchasing guide,” while the clinics index teaches “quality sourcing” from compounding pharmacies and lists BPC-157 for tissue repair as something “most peptide clinics offer.” That is a quote, not a paraphrase.

The “world’s most comprehensive evidence-based peptide directory” line in the live `llms.txt` file, dated February 2026, would go in paragraph two of the story. Superlatives on a months-old site are catnip.

---

## 4. What a regulator would notice first

Different agencies, same first ten minutes.

**FTC / consumer protection.** Invented businesses with green “Verified” badges. Copy that says listings were vetted for licenses, compounding, labs, and transparent pricing. A “Featured” ribbon and a sales pitch for priority placement, while the advertising policy says current sponsors are none and does not define the product. That is not a metadata nit. That is a representation about healthcare providers. The Fake Reviews rule is about people who do not exist endorsing things. Counsel can argue whether a clinic card is a “review.” A stranger does not need the statute number. The plain fact is: the site displays clinics that are not there and marks them legitimate.

**FDA.** The clinic pages and city FAQs treat BPC-157, TB-500, and a buffet of unapproved peptides as a normal menu, next to semaglutide and tirzepatide. The FDA notice elsewhere on the site says the content is not FDA-evaluated and the site does not say where to get substances. The directory does the opposite at street level: named (fake) providers “offer” those substances. Putting “FDA-registered compounding pharmacies” next to BPC-157 is a compounding-access story, not an encyclopedia story.

**State medical boards.** `/directory` promises remote visits with licensed physicians who specialize in peptide protocols. It does not say licensed in which state. Telehealth ads are a board issue. I am not a lawyer. I am a first-time reader. I can still see a national “find a doctor” pitch sitting on top of fiction.

**Search policy, if a reporter calls Google.** Sixty city pages with the same FAQ and a mad-libs sentence about each city’s wellness landscape. That pattern has a jargon name in the audits. In English it is: many pages, same pitch, city name swapped. They were taken out of the sitemap and tagged not to index. They were not taken off the website. Direct visitors still get the fake list.

**Privacy, second look.** Cookie banner in the body. Google Analytics script in the head, configured before the banner’s “deny until you click” line can run. I did not watch the network tab. The live-recon report also did not. Source order is enough to make a privacy reporter ask the question. Vercel’s own analytics snippet is in the HTML with no consent gate observed.

---

## 5. The template that lies on purpose (even if no one meant it)

I read the banner component and the layout that calls it.

`DossierLayout.astro` does not look up whether this peptide is approved. It passes two strings, always:

- `fdaStatus="Not FDA Approved"`
- `wadaStatus="WADA Prohibited"`

It also tells search engines, always:

- `legalStatus="Research use only - not FDA approved for human use"`
- `administrationRoute="Subcutaneous injection"`

`SafetyBanner.astro` has a second trap. If nobody hands it specific warnings, it prints:

- Not approved for human use by any regulatory agency
- Limited human clinical trial data
- Consult a healthcare provider before use

Audit A says the layout never hands it specific warnings. So the defaults always fire. On a drug with large human trials, the banner still says limited human data. On a drug that is approved, the banner still says not approved. On a pill (Rybelsus is an alias on the semaglutide page), the machine label still says shot.

This is the simple English problem that “hardcoded template” hides. The site did not forget Ozempic. The site built a rubber stamp and used it on every dossier, including the ones where the stamp is false. Live HTML on 2026-09-02 matches the stamp. Audit A checked. Live-recon checked. Same contradiction on tirzepatide.

A first-time reader who knows Ozempic from TV ads will assume the rest of the page is sloppy too. They will be right to assume that.

---

## 6. Citations that do not cite

Audit A’s strongest finding is not the banner. It is the banner plus the protocol pages.

Three protocol URLs attach human doses to PubMed IDs. Those IDs open papers about other fields: trypanosomes, eye lenses, tamoxifen, oncology, fermentation, and so on. One protocol invents a human trial dose range as if it were an RCT. The editorial policy says every PMID is checked against the claim. The protocols falsify that sentence.

Plain English: the site put a blue “look this up on PubMed” link next to a dosing story, and the link goes to the wrong scientific paper. A reader who does not click is misled. A reader who clicks is still misled for a moment, then confused. A journalist who clicks has a second screenshot.

I did not re-fetch those PMIDs myself in this seat. I am repeating Audit A’s ledger, which says the IDs were opened through NCBI and do not match. That is the kind of claim a stranger can verify in an afternoon. It should be treated as the first integrity test, not as a backend ticket.

---

## 7. About vs clinics vs directory, in one sitting

Read these three pages as a shopper would.

About: we don’t give medical advice, we don’t provide dosing, we don’t recommend sources.

Directory: coming soon, curated, verified clinics, telehealth with licensed physicians specializing in peptide protocols, educational resources, please list your clinic, subscribe so you don’t miss the launch.

Clinics index (live): find peptide clinics near you; verified clinics offering BPC-157, semaglutide, and other research peptides; we verify listings; featured partners; get listed free; featured listings get priority placement; most clinics offer BPC-157 for tissue repair; look for FDA-registered compounding pharmacies.

Those three pages cannot be true together. A stranger does not need a spreadsheet of “surface_ids” to see it. The contradiction is the product.

The clinics index is tagged `noindex`. That word will come up in every internal meeting as if it were a cure. It is not a cure for a human being who landed on the page. It is a note to Google. The patient still sees “verified.” The clinic owner still sees “featured.” The copy still sells placement.

---

## 8. Jargon that hides a simple English problem

The audit packets are thorough. They are also written in a dialect that makes a board or a reporter work too hard. Here is the translation I needed as a first-time reader.

| What the audits say | What a stranger hears |
|---|---|
| `noindex, follow` | Hide this from Google. Keep it on the website. |
| Crawl budget | Google will not look at all these pages. That is a search problem. It does not make a fake clinic real. |
| Hardcoded | The same sentence is glued onto every drug page, true or not. |
| `verifiedListing: true` | A checkbox in a file. Not a phone call, not a license lookup, not a date. |
| FICTIONAL_PLACEHOLDER | Fake business. |
| Featured Partners | Looks like an award. Functions as an ad slot. Not labeled Sponsored. |
| Doorway pages | Dozens of city pages that exist to rank for “peptide clinic in X.” |
| Scaled content | The city paragraph is a mad-lib. |
| Working tree ≠ live | The public website is not the copy the team is editing. Study counts already disagree (live semaglutide 95 vs 67 in the files; live tirzepatide 42 vs 76). |
| JSON-LD / Drug schema | A hidden label for Google that can contradict the article. |
| FAQ schema with no FAQ | Search engines are told there are questions and answers that the visitor cannot see. |
| X-Robots-Tag: index, follow on a noindex page | The HTTP envelope says “index this” while the page says “don’t.” Audits think Google takes the stricter one. A stranger just sees mixed signals. |
| Estimand | Two official-looking percentages for one trial. The bigger one is often the press-release version. |
| Surface_id | A row in an inventory. Not a person. |
| 555 / example.com | Movie phone. Fake website. |
| Protocol PMID mismatch | The footnote points at the wrong paper. |
| SafetyBanner defaults always fire | The scary small print is generic, so it is wrong on the famous drugs and weak on the obscure ones. |
| Deindexed | Taken out of the search catalog. Still a public URL. |

If you remember only one row: **hiding a page from Google is not the same as telling the truth on that page.**

---

## 9. Other stranger-visible cracks (from live-recon, not from lore)

The homepage calls itself a catalogue, volume IV, a spring 2026 issue that “lands this summer.” That is magazine branding. Fine. Next to it, `llms.txt` still says last updated 2026-02-18 and claims 1,300+ pages and 92 dossiers. The files in the working copy have different counts. The live sitemap had 1,057 URLs. I do not need the exact right number. I need one number that does not drift by dozens depending on which file you open.

Comparison pages tell search engines there is a FAQ. The visible page has no FAQ section. That is a small lie with a large pattern: the machine-readable layer is used as a billboard.

Organization schema has an empty social list while the footer links Instagram. Minor. It still says: we did not finish the about-the-company card.

Cookie consent after analytics config: I will not claim a hit fired. I will claim the HTML is ordered like a site that talks about privacy and loads measurement first.

The reconstitution calculator was live on production the day of recon. About says no dosing. A calculator that asks for a desired dose in micrograms and returns a draw volume is dosing, even if the heading says “research tool.” Audit A flags this. A stranger who has mixed a vial will recognize it immediately.

---

## 10. What the audits got right, without the dialect

Audit C’s product assessment, stripped of marketplace language: **this is not a directory. It is demo data that shipped.** Fifty-two records. Empty article bodies. Nickname plus “Wellness” or “Institute.” Fifty marked verified. Three marked featured. Four never even show because their city file is missing. Twelve city pages with zero clinics still talk about verified providers. Independent web checks on a sample: no match, and nearby real businesses with similar names. Do not email those names. They are not leads.

Audit A’s strongest finding, stripped of IDs: **the site both cites the wrong papers on protocol pages and stamps every drug as unapproved and sports-banned, including drugs that are approved and on pharmacy shelves. Both are live.**

Live-recon, stripped of headers: **the public site and the working copy are already two different magazines.** Titles, dates, study counts, and some URLs do not match. If someone “fixes” the working copy and talks as if the homepage changed, they are describing a draft.

I agree with those three sentences. I did not need a 1,343-row coverage table to agree. The coverage tables matter for completeness. They do not change the stranger test.

---

## 11. Completeness, said plainly

I did not read every peptide file. Audit A says it fully inspected 252 surfaces and sampled the rest. Audit C fully read the clinic and city set. Live-recon fetched a slice of production, not all 1,057 sitemap URLs, and did not click the cookie box. Search Console and analytics were not available. I am not claiming a census of every sentence on the site.

I am claiming that the pages a stranger hits first — About, a famous drug, Directory, Clinics — already fail a newspaper test. More sampling can find more. It is unlikely to un-find the rubber stamp or the fake Park Avenue clinic.

---

## 12. Would a careful reader stay?

Maybe on an approved-drug page, if they ignore the banner and follow the citations out to PubMed and the FDA label. The site’s better instinct is real: grade the evidence, show sources, say what is unknown.

They will not stay if they notice the banner first. They will not stay if they search for a clinic. They will not stay if they click a protocol footnote and land in parasitology. They will not stay if About and Clinics disagree in the same tab set.

Health sites lose readers in one contradiction. This site offers several before the fold.

---

## 13. Bottom line

PepCodex presents as a careful library and currently ships three public problems a first-time reader can see without a developer:

1. **It labels real, approved medicines as unapproved research chemicals** because a layout file hard-wires the warning.
2. **It lists clinics that are not real, marks them verified, and sells featured placement** on a page that also tells people how clinics source peptides.
3. **It claims every citation is checked while protocol pages point at the wrong papers**, and the live site already disagrees with the draft about how many studies exist.

The audits’ vocabulary — noindex, crawl budget, hardcoded, doorway, surface_id — is how a team talks after it has lived with the mess. A journalist’s vocabulary is shorter: fake clinics, false FDA badge, broken footnotes, two directories, cookie script before consent.

Would I trust this site? No. I would trust a screenshot of it as evidence that the pledge on the About page is not the product in the browser.

---

*End of Outsider memo. Grok substitution, as stated at top. Audit only.*
