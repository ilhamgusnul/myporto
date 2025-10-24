#!/usr/bin/env node

/**
 * Script to convert Prisma code to Supabase in all admin files
 * Run: node convert-to-supabase.js
 */

const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

// Prisma to Supabase mappings
const conversions = [
  // Import statements
  {
    pattern: /import { prisma } from "@\/lib\/prisma";/g,
    replacement: 'import { supabaseAdmin } from "@/lib/supabase";'
  },
  
  // Basic CRUD operations
  {
    pattern: /prisma\.(\w+)\.findMany\(\s*\{?\s*orderBy:\s*\{?\s*(\w+):\s*["'](\w+)["']\s*\}?\s*\}?\s*\)/g,
    replacement: (match, table, field, order) => {
      const asc = order === 'asc';
      return `supabaseAdmin.from("${capitalize(table)}").select("*").order("${field}", { ascending: ${asc} })`;
    }
  },
  {
    pattern: /prisma\.(\w+)\.findMany\(\)/g,
    replacement: 'supabaseAdmin.from("$1").select("*")'
  },
  {
    pattern: /prisma\.(\w+)\.findFirst\(\)/g,
    replacement: 'supabaseAdmin.from("$1").select("*").limit(1).single()'
  },
  {
    pattern: /prisma\.(\w+)\.findUnique\(\s*\{\s*where:\s*\{\s*id:\s*(\w+)\s*\}\s*\}\s*\)/g,
    replacement: 'supabaseAdmin.from("$1").select("*").eq("id", $2).single()'
  },
  {
    pattern: /prisma\.(\w+)\.create\(\s*\{\s*data:\s*(\w+)\s*\}\s*\)/g,
    replacement: 'supabaseAdmin.from("$1").insert([$2]).select().single()'
  },
  {
    pattern: /prisma\.(\w+)\.update\(\s*\{\s*where:\s*\{\s*id:\s*(\w+)\s*\},\s*data:\s*(\w+)\s*\}\s*\)/g,
    replacement: 'supabaseAdmin.from("$1").update($3).eq("id", $2).select().single()'
  },
  {
    pattern: /prisma\.(\w+)\.delete\(\s*\{\s*where:\s*\{\s*id:\s*(\w+)\s*\}\s*\}\s*\)/g,
    replacement: 'supabaseAdmin.from("$1").delete().eq("id", $2)'
  },
  {
    pattern: /prisma\.(\w+)\.count\(\)/g,
    replacement: 'supabaseAdmin.from("$1").select("*", { count: "exact", head: true })'
  },
];

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

async function convertFile(filePath) {
  console.log(`Processing: ${filePath}`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  for (const conv of conversions) {
    const before = content;
    content = content.replace(conv.pattern, conv.replacement);
    if (content !== before) modified = true;
  }
  
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✓ Updated: ${filePath}`);
    return true;
  }
  
  return false;
}

async function main() {
  // Find all relevant files
  const patterns = [
    'src/app/**/*.tsx',
    'src/app/**/*.ts',
    '!src/app/**/*.test.ts',
    '!node_modules/**'
  ];
  
  const files = await glob(patterns[0]);
  
  console.log(`Found ${files.length} files to process\n`);
  
  let updatedCount = 0;
  
  for (const file of files) {
    if (await convertFile(file)) {
      updatedCount++;
    }
  }
  
  console.log(`\n✓ Conversion complete!`);
  console.log(`  Updated: ${updatedCount} files`);
  console.log(`  Skipped: ${files.length - updatedCount} files`);
}

main().catch(console.error);
