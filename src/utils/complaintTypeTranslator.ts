import Papa from 'papaparse';
import csvText from '../../data/complaint_type_translation.csv?raw';

let translationMap: Map<string, string> | null = null;

function loadTranslationMap(): Map<string, string> {
  if (translationMap) return translationMap;

  const parsed = Papa.parse(csvText.trim(), {
    header: true,
    skipEmptyLines: true,
  });

  const map = new Map<string, string>();
  for (const row of parsed.data as { [key: string]: string }[]) {
    if (row.complaint_type && row.complaint_type_es) {
      map.set(row.complaint_type, row.complaint_type_es);
    }
  }

  translationMap = map;
  return map;
}

/**
 * Translates a complaint type to Spanish.
 * @param name English complaint type name
 * @returns Translated Spanish name, or the original if not found
 */
export function translateComplaintType(name: string): string {
  const map = loadTranslationMap();
  return map.get(name) ?? name;
}
