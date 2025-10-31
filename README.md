# Parkly - Kostenlose Parkplatz-Finder App

## Projektbeschreibung

Parkly ist eine innovative, kostenlose Parkplatz-Finder App, die auf Crowdsourcing und OpenStreetMap basiert. Die App ermöglicht es Nutzern, freie Parkplätze in Echtzeit zu finden und zu melden, ohne teure APIs oder Abonnements zu benötigen.

## Hauptziele

- **Kostenlose Lösung**: Betriebskosten von 0-10 CHF/Jahr
- **Crowdsourcing-basiert**: Nutzer melden Parkplätze in der Community
- **Real-time Updates**: Live-Updates des Parkplatz-Status
- **Gamification**: Punkte-System zur Motivation der Teilnahme
- **GPS-Integration**: Automatische Standort-Erkennung

## Technologie-Stack

### Frontend

- **Next.js 15** - React Framework mit App Router
- **TypeScript** - Typsichere Entwicklung
- **Tailwind CSS** - Moderne UI-Komponenten
- **Leaflet** - Interaktive Karten mit OpenStreetMap

### Backend & Hosting

- **Supabase** - Datenbank und Authentifizierung (Free Tier)
- **Vercel** - Hosting-Plattform (Free Tier)
- **OpenStreetMap** - Kostenlose Kartendaten

### Dependencies

- `@supabase/supabase-js` - Datenbank-Client
- `react-leaflet` - React-Komponenten für Karten
- `lucide-react` - Icon-Bibliothek

## Projektstruktur

```
parkly/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root Layout
│   ├── page.tsx           # Hauptseite
│   └── globals.css        # Globale Styles
├── components/             # React Komponenten
│   └── MapContent.tsx     # Karten-Komponente
├── lib/                    # Utilities
│   └── supabase.ts        # Supabase Client & Functions
├── supabase-setup.sql     # Datenbank-Schema
├── package.json           # Dependencies
├── tsconfig.json          # TypeScript Config
└── tailwind.config.ts     # Tailwind Config
```

## Installation & Setup

### Voraussetzungen

- Node.js 18 oder höher
- npm oder yarn
- Supabase-Konto (kostenlos)

### 1. Repository klonen

```bash
git clone https://github.com/arvinka23/Lernperiode-11.git
cd Lernperiode-11/parkly
```

### 2. Dependencies installieren

```bash
npm install
```

### 3. Supabase einrichten

1. Gehe zu [supabase.com](https://supabase.com) und erstelle ein kostenloses Konto
2. Erstelle ein neues Projekt
3. Führe den SQL-Code aus `supabase-setup.sql` im SQL Editor aus
4. Kopiere die API-Keys aus den Projekteinstellungen

### 4. Umgebungsvariablen konfigurieren

Erstelle eine `.env.local` Datei im Root-Verzeichnis:

```bash
cp .env.example .env.local
```

Füge deine Supabase-Credentials ein:

```env
NEXT_PUBLIC_SUPABASE_URL=https://dein-projekt.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=dein-anon-key
```

### 5. App starten

```bash
npm run dev
```

Öffne [http://localhost:3000](http://localhost:3000) im Browser.

## Features

### Karten-Funktionen

- **OpenStreetMap Integration** - Kostenlose Kartendaten ohne API-Kosten
- **GPS-Tracking** - Automatische Standort-Erkennung
- **Interaktive Markierungen** - Visualisierung des Parkplatz-Status
- **Zoom & Navigation** - Intuitive Karten-Bedienung

### Parkplatz-Management

- **Real-time Status** - Anzeige freier und belegter Parkplätze
- **Ein-Klick-Reporting** - Schnelle Status-Änderung
- **Neue Parkplätze hinzufügen** - Erweiterung der Community-Datenbank
- **Automatische Erkennung** - GPS-Bewegung erkennt Parkplatz-Wechsel

### Gamification

- **Punkte-System** - Belohnungen für Reports (10-50 Punkte)
- **Level-System** - Steigende Schwierigkeit (alle 100 Punkte = neues Level)
- **Achievements** - Erfolge freischalten
- **Community-Rangliste** - Vergleich mit anderen Nutzern

### Statistiken & Analytics

- **User-Statistiken** - Persönliche Performance-Metriken
- **Community-Daten** - Aktive Nutzer und Reports
- **Parkplatz-Metriken** - Verfügbarkeit und Nutzung
- **Real-time Updates** - Live-Daten

## Kostenanalyse

### Gesamtkosten: 0-10 CHF/Jahr

| Service | Kosten | Alternative |
|---------|--------|-------------|
| Hosting | 0 CHF | Vercel Free Tier |
| Datenbank | 0 CHF | Supabase Free Tier |
| Karten | 0 CHF | OpenStreetMap |
| Domain | 0-10 CHF | Vercel Subdomain (gratis) |
| SSL-Zertifikat | 0 CHF | Automatisch inklusive |

### Kostenvergleich mit kommerziellen Lösungen

- Google Maps API: ~500 CHF/Jahr
- Parking-APIs: ~200-1000 CHF/Jahr
- Hosting: ~100-500 CHF/Jahr
- Datenbank: ~50-200 CHF/Jahr

**Ersparnis: 850-2200 CHF/Jahr**

## Crowdsourcing-System

### Automatische Erkennung

- GPS-Bewegung erkennt, wenn Nutzer wegfahren
- Stillstand-Erkennung markiert Parkplatz als belegt
- Intelligente Algorithmen für bessere Genauigkeit

### Manuelle Reports

- Ein-Klick-Status-Änderung
- Vertrauens-Score basierend auf Nutzer-Historie
- Qualitätskontrolle durch Community

### Gamification-Motivation

- Punkte für Reports (10-50 Punkte pro Report)
- Level-System (alle 100 Punkte = neues Level)
- Achievements für Meilensteine
- Community-Rangliste für Wettbewerb

## Deployment

### Vercel (Empfohlen)

1. Code zu GitHub pushen
2. Vercel-Projekt erstellen
3. Repository verbinden
4. Umgebungsvariablen hinzufügen
5. Deploy starten

### Alternative: Netlify

1. GitHub-Repository verbinden
2. Build-Settings konfigurieren
3. Umgebungsvariablen setzen
4. Deploy starten

## Roadmap

### Phase 1: MVP (Aktuell)

- Basis-Funktionalität
- Demo-Modus
- Grundlegende UI

### Phase 2: Beta (Geplant)

- User-Authentifizierung
- Push-Benachrichtigungen
- Erweiterte Statistiken
- Mobile App (React Native)

### Phase 3: Production (Zukunft)

- Multi-City Support
- Premium Features
- API für Drittanbieter
- Machine Learning Integration

## Entwicklungs-Workflow

### Development Server

```bash
npm run dev
```

### Production Build

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

## Beitragen

1. Fork das Repository
2. Erstelle einen Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Committe deine Änderungen (`git commit -m 'Add AmazingFeature'`)
4. Pushe den Branch (`git push origin feature/AmazingFeature`)
5. Öffne einen Pull Request

## Dokumentation

Weitere Dokumentation findest du in:

- [QUICKSTART.md](QUICKSTART.md) - Schnellstart-Anleitung
- [SUPABASE_SETUP.md](SUPABASE_SETUP.md) - Detaillierte Supabase-Setup-Anleitung

## Lizenz

Dieses Projekt steht unter der MIT-Lizenz. Siehe [LICENSE](LICENSE) für Details.

## Credits

- **Karten**: OpenStreetMap
- **Icons**: Lucide
- **Framework**: Next.js
- **Styling**: Tailwind CSS
- **Backend**: Supabase

## Kontakt

**Entwickler**: Arvin Kasipour  
**Projekt**: Parkly - Kostenlose Parkplatz-Finder App  
**GitHub**: [arvinka23](https://github.com/arvinka23)

---

Parkly - Finde kostenlose Parkplätze mit der Community
