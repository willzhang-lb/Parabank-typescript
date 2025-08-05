import fs from 'fs';
import path from 'path';
import { Locator } from '@playwright/test';

// Generate a random username with a prefix and random suffix
export function generateUsername(prefix = 'user', length = 6): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let suffix = '';
  for (let i = 0; i < length; i++) {
    suffix += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${prefix}_${suffix}`;
}

// Update a key/value in a JSON file
export function dumpToJson(fileName: string, key: string, value: string): void {
  const jsonFilePath = path.join(__dirname, fileName);
  const memberInfo = JSON.parse(fs.readFileSync(jsonFilePath, 'utf-8'));
  memberInfo[key] = value;
  fs.writeFileSync(jsonFilePath, JSON.stringify(memberInfo, null, 4), 'utf-8');
}

// Load and return JSON file contents
export function loadJsonFileInfo(fileName: string): any {
  const jsonFilePath = path.join(__dirname, fileName);
  return JSON.parse(fs.readFileSync(jsonFilePath, 'utf-8'));
}

// Get the HTML tag name of a Playwright Locator
export async function getHtmlTagOfNode(locator: Locator): Promise<string> {
  if (locator) {
    return await locator.evaluate((node: Element) => node.tagName);
  } else {
    throw new Error('No element found');
  }
}