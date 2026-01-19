#!/usr/bin/env node
/**
 * Source Pack Validator
 * Validates source pack JSON files against the schema
 *
 * Usage: node scripts/validate-source-pack.js <path-to-source-pack.json>
 */

import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load the schema
const schemaPath = resolve(__dirname, '../data/schemas/source-pack.schema.json');
const schema = JSON.parse(readFileSync(schemaPath, 'utf-8'));

/**
 * Validate a source pack against the schema
 * @param {string} packPath - Path to the source pack JSON file
 * @returns {{valid: boolean, errors: Array, duplicates: Array}}
 */
export function validateSourcePack(packPath) {
  // Initialize Ajv with formats support
  const ajv = new Ajv({ allErrors: true, verbose: true });
  addFormats(ajv);

  const validate = ajv.compile(schema);

  // Read and parse the source pack
  let sourcePack;
  try {
    const content = readFileSync(packPath, 'utf-8');
    sourcePack = JSON.parse(content);
  } catch (err) {
    return {
      valid: false,
      errors: [{
        message: `Failed to read or parse file: ${err.message}`,
        path: packPath
      }],
      duplicates: []
    };
  }

  // Validate against schema
  const valid = validate(sourcePack);
  const errors = validate.errors || [];

  // Check for duplicate source IDs
  const duplicates = checkDuplicateIds(sourcePack);

  // Format errors for better readability
  const formattedErrors = errors.map(err => ({
    path: err.instancePath || '/',
    message: err.message,
    keyword: err.keyword,
    params: err.params
  }));

  return {
    valid: valid && duplicates.length === 0,
    errors: formattedErrors,
    duplicates
  };
}

/**
 * Check for duplicate source IDs in the source pack
 * @param {object} sourcePack - Parsed source pack object
 * @returns {Array} - Array of duplicate IDs found
 */
function checkDuplicateIds(sourcePack) {
  if (!sourcePack.sources || !Array.isArray(sourcePack.sources)) {
    return [];
  }

  const seen = new Map();
  const duplicates = [];

  for (const source of sourcePack.sources) {
    if (source.id) {
      if (seen.has(source.id)) {
        duplicates.push(source.id);
      } else {
        seen.set(source.id, true);
      }
    }
  }

  return duplicates;
}

/**
 * Pretty print validation results
 * @param {object} result - Validation result object
 * @param {string} filePath - Path to the validated file
 */
function printResults(result, filePath) {
  console.log('\n' + '='.repeat(60));
  console.log(`Source Pack Validation: ${filePath}`);
  console.log('='.repeat(60) + '\n');

  if (result.valid) {
    console.log('[PASS] Source pack is valid!\n');
  } else {
    console.log('[FAIL] Source pack has validation errors:\n');

    if (result.errors.length > 0) {
      console.log('Schema Errors:');
      for (const err of result.errors) {
        console.log(`  - ${err.path}: ${err.message}`);
        if (err.params) {
          console.log(`    Details: ${JSON.stringify(err.params)}`);
        }
      }
      console.log('');
    }

    if (result.duplicates.length > 0) {
      console.log('Duplicate Source IDs:');
      for (const dup of result.duplicates) {
        console.log(`  - ${dup}`);
      }
      console.log('');
    }
  }
}

// CLI execution
if (process.argv[1] && process.argv[1].includes('validate-source-pack')) {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error('Usage: node scripts/validate-source-pack.js <path-to-source-pack.json>');
    process.exit(1);
  }

  const packPath = resolve(process.cwd(), args[0]);
  const result = validateSourcePack(packPath);

  printResults(result, args[0]);

  process.exit(result.valid ? 0 : 1);
}
