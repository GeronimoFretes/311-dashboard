import Papa from 'papaparse';
import csvText from '../../public/data/agency_translation.csv?raw';

let translationMap: Map<string, string> | null = null;

function loadTranslationMap(): Map<string, string> {
  if (translationMap) return translationMap;

  const parsed = Papa.parse(csvText.trim(), {
    header: true,
    skipEmptyLines: true,
  });

  const map = new Map<string, string>();
  for (const row of parsed.data as { [key: string]: string }[]) {
    if (row.agency_name && row.agency_name_es) {
      map.set(row.agency_name, row.agency_name_es);
    }
  }

  translationMap = map;
  return map;
}

/**
 * Translates an agency name to Spanish.
 * @param name English agency name
 * @returns Translated Spanish name, or the original if not found
 */
export function translateAgencyName(name: string): string {
  const map = loadTranslationMap();
  return map.get(name) ?? name;
}
