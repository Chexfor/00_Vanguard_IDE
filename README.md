# 🌌 Vanguard IDE Environment (`00_Vanguard_IDE`)

Este proyecto contiene **únicamente** los recursos, agentes, skills y herramientas necesarias para el funcionamiento del IDE y el asistente IA (Antigravity / DeepSeek). 

Se ha extraído del ecosistema de aplicaciones de producción para garantizar que **ningún proyecto dependa de estos recursos internos**. 

## 📦 Instalación Manual (Mudanza de Equipo)

Si necesitas mudar tu entorno de desarrollo a otra computadora, este directorio es todo lo que necesitas llevarte para mantener las capacidades del asistente y los scripts de soporte.

### 1. Requisitos Previos
- **Ollama**: Asegúrate de tener instalado Ollama en la nueva máquina.
- **Modelos Locales**:
  - `deepseek-r1:1.5b` (o superior)
  - `llama3.1` (o la versión que estés utilizando)
- **Rust (Cargo)**: Si utilizas `vanguard-muscle` u otros binarios locales, asegúrate de instalar Rust.
- **Node.js**: Para las skills externas y herramientas de desarrollo.

### 2. Pasos de Instalación
1. Clona o copia esta carpeta (`00_Vanguard_IDE`) a tu nuevo entorno de trabajo (preferiblemente en el directorio raíz de tus proyectos, ej. `/mnt/datos/Proyectos/`).
2. Verifica la estructura base:
   - `/AGENTS/` -> Catálogos de agentes (LexSync-Arch, Security, etc.)
   - `/GOOGLE_SKILLS/` -> Skills nativas
   - `/n8n-mcp/` -> Integración con n8n
   - `/mattpocock-skills/` -> Recursos adicionales
3. Ejecuta Ollama y verifica los modelos instalados:
   ```bash
   ollama list
   ```

## 🛡️ Reglas Arquitectónicas
- **NO crear dependencias duras**: Ninguna aplicación de producción (ej. Dapti, LexSync) debe tener referencias relativas apuntando a este directorio (`../00_Vanguard_IDE/`).
- **Independencia**: Este directorio es un ecosistema cerrado para uso exclusivo del IDE y el flujo de IA.
