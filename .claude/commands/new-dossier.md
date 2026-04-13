Scaffold a new peptide dossier from the standard template.

Usage: /new-dossier [peptide-name]

Steps:
1. Check if a dossier template exists (look in `src/content/` or `templates/`)
2. If no template, use the structure from an existing dossier as reference
3. Create a new dossier file at the appropriate content path
4. Fill in the peptide name and create TODO placeholders for:
   - Overview / mechanism of action
   - Research summary (with citation placeholders)
   - Dosage information
   - Safety profile
   - Sources / references
5. Add the peptide to any index or collection files that track all peptides
6. Remind: "All claims need citations from RESEARCH-SOURCES.md. Run /verify-citations after filling in content."
