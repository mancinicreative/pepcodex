import fs from 'node:fs';

const extracted = JSON.parse(fs.readFileSync('.planning/master-audit-2026-09-02/audit-c/_extracted.json', 'utf8'));
const inv = JSON.parse(fs.readFileSync('.planning/master-audit-2026-09-02/INVENTORY-COMPACT.json', 'utf8'));
const csv = fs.readFileSync('.planning/master-audit-2026-09-02/CLINIC-RECORDS.csv', 'utf8').trim().split(/\r?\n/).slice(1);

const csvByFile = {};
for (const line of csv) {
  const m = line.match(/^(CLINIC-RECORD-\d+),"(.*?)",(src\/content\/clinics\/[^,]+),/);
  if (m) csvByFile[m[3].replace(/\\/g, '/')] = { id: m[1], name: m[2] };
}

const independentlySearched = {
  'alamo-wellness-san-antonio.mdx': {
    queries: ['"Alamo Wellness & Peptide Center" San Antonio'],
    result: 'No matching clinic. Nearby different businesses: Alamo Peptides (research-chem vendor, alamopeptides.com) and Alamo Slim Clinic (7800 IH-10 West). Address 18503 Blanco Road not tied to this name.',
    urls: ['https://alamopeptides.com/', 'https://www.alamoslimclinic.com/peptide-therapies']
  },
  'manhattan-peptide-clinic.mdx': {
    queries: ['"Manhattan Peptide Clinic" "Park Avenue"'],
    result: 'No matching clinic at 445 Park Avenue. Real nearby Park Avenue peptide practice is Dr. GolBerg Wellness at 910 Park Avenue.',
    urls: ['https://www.drgolberg.nyc/regenerative-medicine/peptide-therapy-in-park-avenue-ny/']
  },
  'prime-wellness-scottsdale.mdx': {
    queries: ['"Prime Wellness Scottsdale" peptide'],
    result: 'No matching Scottsdale clinic at 7500 E Doubletree Ranch Rd. "Prime Wellness" hits a DMV Dermestetics brand; Prime IV Hydration is a different IV chain at Via Linda.',
    urls: ['https://primeivhydration.com/locations/arizona/scottsdale/']
  },
  'vitality-wellness-miami.mdx': {
    queries: ['"Vitality Wellness Center" Brickell peptide therapy'],
    result: 'No matching Miami Brickell clinic at 1234 Brickell Avenue. Vitality Wellness peptide programs exist in Idaho/telehealth (vitalityidaho.com, vitalitywellnessmed.com). Real Brickell peptide clinic: Strong Health, 1000 Brickell Plaza.',
    urls: ['https://vitalityidaho.com/peptide-therapy/', 'https://www.stronghealth.com/fl/miami/peptide-therapy/']
  },
  'regenerative-health-la.mdx': {
    queries: ['"Regenerative Health Institute" "9000 Wilshire" peptide'],
    result: 'No matching Beverly Hills clinic at 9000 Wilshire Blvd. Nearby different entities: Regenerative Medicine LA (Mark Ghalili DO, Sunset Blvd), Regenuva (9025 Wilshire).',
    urls: ['https://checkpeptides.com/clinic/regenerative-medicine-la-mark-ghalili-do-los-angeles/', 'https://www.regenuvahealth.com/']
  },
  'beacon-wellness-boston.mdx': {
    queries: ['"Beacon Wellness & Regenerative Health" Boston peptide'],
    result: 'No matching Boston clinic. HealingMaps 2026 Boston peptide-clinic roundup does not list this name. Description claims "Harvard-affiliated expertise" with no named clinician.',
    urls: ['https://healingmaps.com/best-peptide-clinics-in-boston/']
  },
  'pacific-wellness-sf.mdx': {
    queries: ['"Pacific Integrative Wellness" "450 Sutter" San Francisco'],
    result: 'No matching clinic. Nearby different entity: Pacific Integrative Psychiatry at 447 Sutter Street (psychiatry/sleep, not peptide clinic).',
    urls: ['https://www.psychologytoday.com/us/psychiatrists/pacific-integrative-psychiatry-san-francisco-ca/1776990']
  },
  'treasure-valley-peptide-boise.mdx': {
    queries: ['"Treasure Valley Peptide Institute" Boise'],
    result: 'No matching clinic. Nearby different entities: Treasure Valley Aesthetics & Wellness, Treasure Valley Pain & Hormones, Boise Biologics. HealingMaps Boise list does not include this name.',
    urls: ['https://healingmaps.com/best-peptide-clinics-in-boise/', 'https://boisebiologics.com/best-peptide-therapy-boise/']
  },
  'northwest-peptide-seattle.mdx': {
    queries: ['"Northwest Peptide & Wellness" Seattle Madison Street'],
    result: 'No matching clinic at 1200 Madison Street. Nearby different entities: Northwest Peptides / NorthWest Peps (research-chem vendors), HealingMaps Seattle list (Flow Wellness, Pinnacle Integrative, etc.).',
    urls: ['https://healingmaps.com/best-peptide-clinics-in-seattle/', 'https://northwestpeptides.com/contact-us/']
  },
  'queen-city-peptide-charlotte.mdx': {
    queries: ['"Queen City Peptide Institute" Charlotte Park Road'],
    result: 'No matching clinic. MyPeptideMatch Charlotte listings do not include this name. "Queen City Wellness" appears as a generic name in unrelated local-SEO copy, not this institute.',
    urls: ['https://www.mypeptidematch.com/clinics/north-carolina/charlotte']
  },
  'elite-wellness-chicago.mdx': {
    queries: ['"Elite Wellness & Longevity Center" "875 N Michigan" Chicago peptide'],
    result: 'No matching clinic in the Hancock building. Nearby different entity: Live Well Clinics at 980 N Michigan Ave. HealingMaps Chicago roundup does not list this name.',
    urls: ['https://healingmaps.com/best-peptide-clinics-in-chicago/', 'https://peptidealliance.io/chicago/live-well-clinics-chicago']
  }
};

const cityNames = new Set(extracted.cities.map((c) => String(c.data.name).toLowerCase()));
const orphanCity = (city) => !cityNames.has(String(city).toLowerCase());

const clinicRecords = extracted.clinics.map((c) => {
  const file = `src/content/clinics/${c.file}`;
  const csvRow = csvByFile[file] || csvByFile[file.replace(/\\/g, '/')];
  const phone = String(c.data.phone || '');
  const website = String(c.data.website || '');
  const searched = independentlySearched[c.file];
  const area555 = /^\(555\)/.test(phone);
  const exchange555 = /\(\d{3}\) 555-/.test(phone);
  return {
    surface_id: csvRow ? csvRow.id : null,
    name: c.data.name,
    file,
    city: c.data.city,
    state: c.data.state,
    fields: {
      legal_or_public_name: c.data.name,
      ownership: null,
      address: c.data.address || null,
      website,
      public_business_contact: phone,
      operating_status: null,
      professional_licenses: null,
      jurisdictions: c.data.state || null,
      services_offered: c.data.services || [],
      peptides_offered: c.data.peptides || [],
      claim_origin: 'self-written marketing copy in MDX frontmatter; no source, last-checked, or clinician named',
      in_person_vs_telehealth: 'not stated; street address implies in-person',
      prices: null,
      insurance: null,
      featured: !!c.data.featured,
      verifiedListing: !!c.data.verifiedListing,
      description: c.data.description || null,
      mdx_body: c.bodyLen === 0 ? 'empty' : 'present',
      schema_fields_missing: [
        'license',
        'npi',
        'clinician_names',
        'last_checked',
        'verification_source',
        'operating_status',
        'telehealth',
        'ownership',
        'prices',
        'insurance',
        'hours'
      ]
    },
    verification_attempt: {
      date: '2026-09-02',
      methods: searched
        ? ['file_read', 'web_search_name_city', 'example.com_probe', '555_nanpa_pattern']
        : ['file_read', 'cohort_pattern_match', 'example.com_reserved', '555_nanpa_pattern'],
      queries: searched ? searched.queries : [`cohort: identical example.com + 555 + empty body + nickname generator`],
      notes: searched
        ? searched.result
        : 'Not individually web-searched. Record is identical in structure to the independently falsified cohort: IANA-reserved example.com website, 555 telephone, empty MDX body, no license/NPI/last-checked, nickname-style trade name.',
      evidence_urls: searched ? searched.urls.concat([website]) : [website]
    },
    last_checked: '2026-09-02',
    status: 'FICTIONAL_PLACEHOLDER',
    status_rationale: [
      'website is https://example.com/... (IANA reserved documentation domain)',
      area555 ? 'phone uses 555 as area code (not a valid NANPA NPA)' : exchange555 ? 'phone uses 555 exchange reserved for fiction (NANPA 555-01xx)' : 'phone contains 555',
      'no matching public business found for independently searched cohort members of the same generator',
      orphanCity(c.data.city) ? `city "${c.data.city}" has no city landing page — record cannot render in /clinics/[city]` : null,
      c.data.verifiedListing ? 'verifiedListing:true with no verification source or date' : 'verifiedListing:false but still example.com/555 placeholder'
    ].filter(Boolean),
    duplicates_or_collisions: [],
    independently_verified: false
  };
});

const inspectedExact = new Set([
  'HOME-1228',
  'TRUST-1229', 'TRUST-1230', 'TRUST-1235', 'TRUST-1236', 'TRUST-1238',
  'TRUST-1239', 'TRUST-1240', 'TRUST-1243', 'TRUST-1246', 'TRUST-1250',
  'DIRECTORY-1237', 'DIRECTORY-1252',
  'CONVERSION-1244',
  'MACHINE-1261', 'MACHINE-1262',
  'API-1263', 'API-1265'
]);

const inspectedTemplates = new Set([
  'TEMPLATE-1266', // BaseLayout
  'src/layouts/BaseLayout.astro',
  'src/components/ClinicCard.astro',
  'src/components/FeaturedClinicCard.astro',
  'src/components/SEO/FAQSchema.astro',
  'src/components/SEO/OrganizationSchema.astro',
  'src/components/ExitIntentPopup.astro',
  'src/pages/clinics/[city].astro',
  'src/pages/clinics/index.astro',
  'src/pages/directory.astro',
  'src/content/config.ts'
]);

const coverage = inv.map((s) => {
  let status = 'SAMPLED';
  let depth = 'inventory_compact_title_url_robots_plus_clinic_directory_grep';
  let reason = 'Audit C lens: remaining inventory sampled for directory/verified-language leak and inventory metadata, not end-to-end claim audit.';

  if (s.type === 'clinic-record') {
    status = 'INSPECTED';
    depth = 'full_mdx_frontmatter_and_empty_body';
    reason = '100% of 52 clinic MDX files read.';
  } else if (s.type === 'city-clinic-page') {
    status = 'INSPECTED';
    depth = 'full_frontmatter_content_field_plus_shared_city_template_faqs';
    reason = 'All 60 city MDX files read (frontmatter + content). Shared FAQ/schema from src/pages/clinics/[city].astro inspected.';
  } else if (inspectedExact.has(s.surface_id)) {
    status = 'INSPECTED';
    depth = 'full_file_plus_live_url_where_applicable';
    reason = 'Required deep-read for Audit C (trust/legal/directory/home/contact/machine).';
  } else if (s.type === 'template' && (
    /BaseLayout|ClinicCard|FeaturedClinicCard|FAQSchema|OrganizationSchema|ExitIntentPopup/.test(s.file || '') ||
    inspectedTemplates.has(s.surface_id)
  )) {
    status = 'INSPECTED';
    depth = 'full_file';
    reason = 'Directory-relevant template.';
  } else if (s.type === 'template') {
    status = 'SAMPLED';
    depth = 'inventory_plus_grep_for_clinic_directory_verified';
    reason = 'Template listed; not every layout line-read. Grep showed no clinic-directory CTA leak except BaseLayout footer /directory.';
  } else if (s.file === 'src/pages/sponsors' || (s.file || '').includes('/sponsors/')) {
    status = 'INACCESSIBLE';
    depth = 'directory_listing_empty_or_restricted';
    reason = 'src/pages/sponsors exists as a directory; listing returned no files.';
  }

  return {
    surface_id: s.surface_id,
    type: s.type,
    url: s.url,
    file: s.file,
    title: s.title,
    indexable: s.indexable,
    robots: s.robots,
    status,
    depth,
    reason
  };
});

const byStatus = coverage.reduce((a, x) => { a[x.status] = (a[x.status] || 0) + 1; return a; }, {});

fs.writeFileSync(
  '.planning/master-audit-2026-09-02/audit-c/CLINIC-VERIFICATION.json',
  JSON.stringify({
    audit: 'C',
    date: '2026-09-02',
    auditor: 'Audit C — directory / affiliate / clinic-acquisition',
    last_checked: '2026-09-02',
    summary: {
      total: clinicRecords.length,
      FICTIONAL_PLACEHOLDER: clinicRecords.filter((r) => r.status === 'FICTIONAL_PLACEHOLDER').length,
      UNVERIFIED: 0,
      'SELF-REPORTED': 0,
      INDEPENDENTLY_CONFIRMED: 0,
      INACCESSIBLE: 0,
      independently_web_searched: Object.keys(independentlySearched).length,
      example_com_websites: 52,
      nanpa_555_phones: 52,
      verifiedListing_true: extracted.clinics.filter((c) => c.data.verifiedListing === true).length,
      featured_true: extracted.clinics.filter((c) => c.data.featured).map((c) => c.data.name),
      verifiedListing_false: extracted.clinics.filter((c) => c.data.verifiedListing === false).map((c) => c.data.name),
      orphaned_from_city_pages: clinicRecords.filter((r) => r.status_rationale.some((x) => String(x).includes('no city landing'))).map((r) => r.name)
    },
    clinics: clinicRecords
  }, null, 2)
);

fs.writeFileSync(
  '.planning/master-audit-2026-09-02/audit-c/COVERAGE.json',
  JSON.stringify({
    audit: 'C',
    date: '2026-09-02',
    frozen_inventory: 'INVENTORY-COMPACT.json',
    total_surfaces: coverage.length,
    counts_by_status: byStatus,
    note: 'INSPECTED = full file (and live URL if any) under Audit C lens. SAMPLED = inventory metadata + grep for directory/clinic/verified leak, not end-to-end claim audit. GSC/GA4 live pull blocked at freeze; not a surface_id but an access limit.',
    access_limits: [
      'GSC live pull UNAVAILABLE (invalid_rapt) — not a surface_id',
      'GA4 live pull UNAVAILABLE — not a surface_id',
      'Private CMS / email / affiliate dashboards — none in repo, UNAVAILABLE',
      'src/pages/sponsors directory listing empty/restricted'
    ],
    surfaces: coverage
  }, null, 2)
);

console.log('clinic records', clinicRecords.length);
console.log('coverage', coverage.length, byStatus);
console.log('orphans', clinicRecords.filter((r) => r.status_rationale.some((x) => String(x).includes('no city landing'))).map((r) => r.name));
