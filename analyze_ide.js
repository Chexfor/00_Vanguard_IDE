const fs = require('fs');
const path = require('path');

const OLLAMA_URL = 'http://localhost:11434/api/generate';
const MODEL = 'llama3.1:latest';
const ROOT_DIR = '/mnt/datos/Proyectos/00_Vanguard_IDE';

async function queryOllama(prompt) {
  const response = await fetch(OLLAMA_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: MODEL,
      prompt: prompt,
      stream: false
    })
  });
  if (!response.ok) throw new Error(`Ollama error: ${response.statusText}`);
  const data = await response.json();
  return data.response;
}

async function scanDirectory() {
  console.log(`[Phase 1] Escaneando directorios en ${ROOT_DIR}...`);
  const entries = fs.readdirSync(ROOT_DIR, { withFileTypes: true });
  
  const tools = [];
  
  for (const entry of entries) {
    if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== '_Legacy_Archive') {
      let content = '';
      const readmePath = path.join(ROOT_DIR, entry.name, 'README.md');
      const pkgPath = path.join(ROOT_DIR, entry.name, 'package.json');
      
      if (fs.existsSync(readmePath)) content += fs.readFileSync(readmePath, 'utf8').substring(0, 1500);
      if (fs.existsSync(pkgPath)) content += fs.readFileSync(pkgPath, 'utf8').substring(0, 500);
      
      if (content.length > 0) {
        tools.push({ name: entry.name, content });
      } else {
        // Buscar subcarpetas si no hay readme en la raíz (ej. 01_Orchestration/mattpocock-skills)
        const subEntries = fs.readdirSync(path.join(ROOT_DIR, entry.name), { withFileTypes: true });
        for (const sub of subEntries) {
          if (sub.isDirectory()) {
            const subReadmePath = path.join(ROOT_DIR, entry.name, sub.name, 'README.md');
            if (fs.existsSync(subReadmePath)) {
               content += `[Subtool: ${sub.name}] ` + fs.readFileSync(subReadmePath, 'utf8').substring(0, 1000);
            }
          }
        }
        if (content.length > 0) tools.push({ name: entry.name, content });
      }
    }
  }
  
  console.log(`[Phase 2] Analizando ${tools.length} herramientas con ${MODEL}...`);
  
  const report = ['# Grafo Semántico de Vanguard IDE (Generado con Llama 3.1)\n'];
  
  for (const tool of tools) {
    console.log(`Analizando: ${tool.name}...`);
    const prompt = `Actúa como un arquitecto de software experto. Analiza el siguiente contenido de la herramienta '${tool.name}' y responde en un solo párrafo conciso (máximo 4 líneas) en español, explicando: 1) Qué es exactamente, 2) Para qué sirve en un ecosistema de desarrollo, 3) Cómo podríamos integrarlo en una app Next.js/Supabase llamada LexSync.\n\nContenido:\n${tool.content}`;
    
    try {
      const analysis = await queryOllama(prompt);
      report.push(`## 🛠️ ${tool.name}\n${analysis}\n`);
    } catch (err) {
      console.error(`Error con ${tool.name}:`, err.message);
      report.push(`## 🛠️ ${tool.name}\nError al analizar con Ollama.\n`);
    }
  }
  
  const outPath = path.join(ROOT_DIR, 'VANGUARD_KNOWLEDGE_GRAPH.md');
  fs.writeFileSync(outPath, report.join('\n'));
  console.log(`[Completado] Reporte guardado en ${outPath}`);
}

scanDirectory().catch(console.error);
