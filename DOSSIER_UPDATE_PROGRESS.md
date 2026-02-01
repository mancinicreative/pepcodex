# Dossier Update Progress Report
Generated: 2026-01-31 (Updated with specific fixes)

## Summary
65 agents were launched to update peptide dossiers to match the BPC-157 template format. Most are complete but 13 files have validation errors that need fixing.

## Already Completed (No Errors)
These 7 dossiers were correct before the batch update:
- bpc-157.mdx (template)
- tb-500.mdx
- ipamorelin.mdx
- semaglutide.mdx
- ghk-cu.mdx
- tirzepatide.mdx
- cjc-1295.mdx

---

## FILES WITH VALIDATION ERRORS - SPECIFIC FIXES NEEDED

### 1. cerebrolysin.mdx
**Line 18:** `chainLength: "Multiple peptide fragments (<10 kDa)"` → Change to `chainLength: 100` (use approximate number)
**Lines 22-27:** Invalid property values in aminoAcids:
- `"neurotrophic"` → `"modified"`
- `"mixed"` → `"polar"`
- `"trophic"` → `"modified"` (for all BDNF, NGF, GDNF, CNTF entries)

### 2. cortexin.mdx
**Line 18:** `chainLength: 4-50` → Change to `chainLength: 4` (use single number)

### 3. thymalin.mdx
**Line 19:** `chainLength: "2-8 (multiple peptides)"` → Change to `chainLength: 7` (use single number)

### 4. na-semax-amidate.mdx
**Lines 32, 53, 71:** `confidence: "extrapolated"` → `confidence: "emerging"`
**Line 87:** `confidence: "theoretical"` → `confidence: "emerging"`
**Lines 36, 57, 75:** `qualifier: "theorized to"` → `qualifier: "may"`
**Line 91:** `qualifier: "claimed to"` → `qualifier: "may"`

### 5. na-selank-amidate.mdx
**Line 84:** `confidence: "theoretical"` → `confidence: "emerging"`
**Line 87:** `qualifier: "theorized to"` → `qualifier: "may"`

### 6. pinealon.mdx
**Line 71:** `confidence: "speculative"` → `confidence: "emerging"`
**Line 74:** `qualifier: "theorized to"` → `qualifier: "may"`

### 7. glutathione.mdx
**Lines 28, 49:** `confidence: "well-established"` → `confidence: "established"`
**Lines 32, 53:** `qualifier: "demonstrated to"` → `qualifier: "shown to"`

### 8. alpha-defensins.mdx
**Lines 59, 101:** `qualifier: "demonstrated to"` → `qualifier: "shown to"`

### 9. hmg.mdx
**Lines 35, 56:** `qualifier: "demonstrated to"` → `qualifier: "shown to"`

### 10. hcg.mdx
**Lines 49, 70, 91:** `qualifier: "proven to"` → `qualifier: "shown to"`

### 11. cagrisema.mdx
**Lines 111, 132, 153:** `qualifier: "demonstrated to"` → `qualifier: "shown to"`

### 12. lactoferricin.mdx
**Lines 54, 117:** `qualifier: "demonstrated to"` → `qualifier: "shown to"`

### 13. orforglipron.mdx
**Needs verification** - likely has `qualifier: "demonstrated to"` issues

---

## Valid Enum Values Reference

### molecularInfo.aminoAcids[].property
- `hydrophobic`
- `polar`
- `positive`
- `negative`
- `modified`

### evidenceChainedBenefits[].mechanism.confidence
- `established`
- `supported`
- `emerging`

### evidenceChainedBenefits[].benefit.qualifier
- `may`
- `appears to`
- `suggested to`
- `shown to`

### evidenceChainedBenefits[].keyFindings[].type
- `human-rct`
- `human-observational`
- `animal`
- `in-vitro`

---

## Quick Fix Commands

Find all invalid qualifier values:
```bash
grep -rn '"demonstrated to"' src/content/peptides/
grep -rn '"proven to"' src/content/peptides/
grep -rn '"theorized to"' src/content/peptides/
grep -rn '"claimed to"' src/content/peptides/
```

Find all invalid confidence values:
```bash
grep -rn '"well-established"' src/content/peptides/
grep -rn '"extrapolated"' src/content/peptides/
grep -rn '"theoretical"' src/content/peptides/
grep -rn '"speculative"' src/content/peptides/
```

Find files with chainLength as string:
```bash
grep -rn 'chainLength: "' src/content/peptides/
```

Find invalid property values:
```bash
grep -rn '"neurotrophic"' src/content/peptides/
grep -rn '"trophic"' src/content/peptides/
grep -rn '"mixed"' src/content/peptides/
```

---

## Next Steps
1. Fix the 13 files listed above with their specific validation errors
2. Run `npm run build` to verify all validation passes
3. Check dev server at http://localhost:4321 for any remaining errors

## Reference Files
- **Template:** `src/content/peptides/bpc-157.mdx`
- **Checklist:** `DOSSIER_CHECKLIST.md`
