
import { Post } from '../types';

const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRyPo15zAs0lpBImncFFCVRgQ7IdXFCdBI5DgPcdmjLWtLduIvW-bPHodS3BYlfL7pq_n0BCSB5YwCU/pub?gid=0&single=true&output=csv';

/**
 * Fungsi pembantu untuk memproses baris CSV dengan benar, 
 * menangani sel yang memiliki tanda kutip ganda dan koma di dalamnya.
 */
function parseCSVLine(line: string): string[] {
  const result = [];
  let curValue = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        // Menangani double-double quotes (escaped quotes)
        curValue += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(curValue);
      curValue = "";
    } else {
      curValue += char;
    }
  }
  result.push(curValue);
  return result;
}

export async function fetchSheetData(): Promise<Post[]> {
  try {
    // Menambahkan timestamp agar tidak terkena cache browser saat data di sheet berubah
    const response = await fetch(`${CSV_URL}&t=${new Date().getTime()}`);
    const text = await response.text();
    
    const lines = text.split(/\r?\n/).filter(line => line.trim() !== "");
    if (lines.length === 0) return [];

    const headers = parseCSVLine(lines[0]).map(h => h.trim());
    
    // Mapping header bahasa Indonesia ke kunci internal Inggris
    const keyMap: Record<string, keyof Post> = {
      'Judul': 'judul',
      'Label': 'label',
      'Gambar': 'gambar',
      'Body': 'body',
      'Slug': 'slug',
      'Meta Deskripsi': 'metaDeskripsi',
      'Status': 'status',
      'Tanggal Jam': 'tanggalJam',
      'Tipe': 'tipe'
    };

    const data = lines.slice(1).map(line => {
      const values = parseCSVLine(line);
      const obj: any = {};
      
      headers.forEach((header, index) => {
        const key = keyMap[header] || header;
        let val = values[index] || '';
        obj[key] = val.trim();
      });

      return obj as Post;
    }).filter(p => p.status === 'Publish');

    console.log("Data berhasil dimuat dari Live Website Tab:", data.length, "artikel");
    return data;
  } catch (error) {
    console.error('Error fetching sheet data:', error);
    return [];
  }
}
