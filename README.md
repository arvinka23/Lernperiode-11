# 🚗 Parkly - Kostenlose Parkplatz-Finder App

## 📋 Projektbeschreibung

**Parkly** ist eine innovative, kostenlose Parkplatz-Finder App, die auf Crowdsourcing und OpenStreetMap basiert. Die App ermöglicht es Nutzern, freie Parkplätze in Echtzeit zu finden und zu melden, ohne teure APIs oder Abonnements zu benötigen.

### 🎯 Hauptziele
- **Kostenlose Lösung**: 0-10 CHF/Jahr Betriebskosten
- **Crowdsourcing-basiert**: User melden Parkplätze
- **Real-time Updates**: Live-Updates der Parkplatz-Status
- **Gamification**: Punkte-System motiviert zur Teilnahme
- **GPS-Integration**: Automatische Standort-Erkennung

## 🛠️ Technologie-Stack

### Frontend
- **Next.js 15** - React Framework mit App Router
- **TypeScript** - Typsichere Entwicklung
- **Tailwind CSS** - Moderne UI-Komponenten
- **Leaflet** - Interaktive Karten (OpenStreetMap)

### Backend & Hosting
- **Supabase** - Kostenlose Datenbank & Auth (Free Tier)
- **Vercel** - Kostenloses Hosting (Free Tier)
- **OpenStreetMap** - Kostenlose Kartendaten

### Dependencies
- `@supabase/supabase-js` - Datenbank-Client
- `react-leaflet` - React-Komponenten für Karten
- `lucide-react` - Moderne Icons

## 📦 Arbeitspakete

### **AP1: Projekt-Setup & Grundstruktur** ✅
- [x] Next.js Projekt mit TypeScript erstellen
- [x] Tailwind CSS konfigurieren
- [x] Supabase-Integration einrichten
- [x] Basis-Projektstruktur aufbauen

### **AP2: Datenbank-Design & Schema** ✅
- [x] Supabase-Projekt erstellen
- [x] Datenbank-Schema definieren
- [x] Tabellen erstellen (parking_spots, users, reports)
- [x] Row Level Security (RLS) konfigurieren

### **AP3: Karten-Integration** ✅
- [x] OpenStreetMap mit Leaflet integrieren
- [x] Interaktive Karten-Komponente erstellen
- [x] GPS-Standort-Tracking implementieren
- [x] Parkplatz-Markierungen hinzufügen

### **AP4: Core-Funktionalität** ✅
- [x] Parkplatz-Status anzeigen (frei/belegt)
- [x] Ein-Klick-Status-Änderung
- [x] Neue Parkplätze hinzufügen
- [x] Real-time Updates implementieren

### **AP5: Gamification-System** ✅
- [x] Punkte-System implementieren
- [x] Level-System mit Achievements
- [x] User-Statistiken anzeigen
- [x] Community-Rangliste

### **AP6: UI/UX Design** ✅
- [x] Responsive Design implementieren
- [x] Moderne UI-Komponenten erstellen
- [x] Mobile-First Ansatz
- [x] Accessibility-Features

### **AP7: Demo-Modus & Fallbacks** ✅
- [x] Demo-Daten für Entwicklung
- [x] Offline-Funktionalität
- [x] Fehlerbehandlung verbessern
- [x] Graceful Degradation

### **AP8: Deployment & Hosting** 🔄
- [ ] Vercel-Deployment konfigurieren
- [ ] Umgebungsvariablen einrichten
- [ ] Domain-Konfiguration
- [ ] CI/CD Pipeline

### **AP9: Testing & Qualitätssicherung** 🔄
- [ ] Unit Tests schreiben
- [ ] Integration Tests
- [ ] Performance-Optimierung
- [ ] Security-Audit

### **AP10: Dokumentation & Wartung** 🔄
- [ ] API-Dokumentation
- [ ] User-Guide erstellen
- [ ] Wartungsplan
- [ ] Monitoring einrichten

## 🚀 Installation & Setup

### Voraussetzungen
- Node.js 18+ 
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
1. Gehe zu [supabase.com](https://supabase.com) und erstelle kostenloses Konto
2. Neues Projekt erstellen
3. SQL-Code aus `supabase-setup.sql` ausführen
4. API-Keys kopieren

### 4. Umgebungsvariablen konfigurieren
```bash
cp env.example .env.local
# Dann deine Supabase-Daten eintragen
```

### 5. App starten
```bash
npm run dev
```

Öffne [http://localhost:3000](http://localhost:3000)

## 📱 Features

### 🗺️ Karten-Funktionen
- **OpenStreetMap Integration** - Kostenlose Kartendaten
- **GPS-Tracking** - Automatische Standort-Erkennung
- **Interaktive Markierungen** - Parkplatz-Status visualisieren
- **Zoom & Navigation** - Intuitive Karten-Bedienung

### 🚗 Parkplatz-Management
- **Real-time Status** - Freie/belegte Parkplätze anzeigen
- **Ein-Klick-Reporting** - Status schnell ändern
- **Neue Parkplätze hinzufügen** - Community erweitern
- **Automatische Erkennung** - GPS-Bewegung erkennt Parkplatz-Wechsel

### 🏆 Gamification
- **Punkte-System** - Belohnungen für Reports
- **Level-System** - Steigende Schwierigkeit
- **Achievements** - Erfolge freischalten
- **Community-Rangliste** - Vergleich mit anderen Usern

### 📊 Statistiken & Analytics
- **User-Statistiken** - Persönliche Performance
- **Community-Daten** - Aktive User und Reports
- **Parkplatz-Metriken** - Verfügbarkeit und Nutzung
- **Real-time Updates** - Live-Daten

## 💰 Kostenanalyse

### Gesamtkosten: 0-10 CHF/Jahr

| Service | Kosten | Alternative |
|---------|--------|-------------|
| **Hosting** | 0 CHF | Vercel Free Tier |
| **Datenbank** | 0 CHF | Supabase Free Tier |
| **Karten** | 0 CHF | OpenStreetMap |
| **Domain** | 0-10 CHF | Vercel Subdomain (gratis) |
| **SSL-Zertifikat** | 0 CHF | Automatisch inklusive |

### Kostenvergleich mit kommerziellen Lösungen
- **Google Maps API**: ~500 CHF/Jahr
- **Parking-APIs**: ~200-1000 CHF/Jahr
- **Hosting**: ~100-500 CHF/Jahr
- **Datenbank**: ~50-200 CHF/Jahr

**Ersparnis: 850-2200 CHF/Jahr** 🎉

## 🔧 Crowdsourcing-System

### Automatische Erkennung
- **GPS-Bewegung** erkennt wenn User wegfahren
- **Stillstand-Erkennung** markiert Parkplatz als belegt
- **Intelligente Algorithmen** für bessere Genauigkeit

### Manuelle Reports
- **Ein-Klick-Status-Änderung**
- **Vertrauens-Score** basierend auf User-Historie
- **Qualitätskontrolle** durch Community

### Gamification-Motivation
- **Punkte für Reports** (10-50 Punkte pro Report)
- **Level-System** (alle 100 Punkte = neues Level)
- **Achievements** für Meilensteine
- **Community-Rangliste** für Wettbewerb

## 🚀 Deployment

### Vercel (Empfohlen)
1. Code zu GitHub pushen
2. Vercel-Projekt erstellen
3. Repository verbinden
4. Umgebungsvariablen hinzufügen
5. Deploy!

### Alternative: Netlify
1. GitHub-Repository verbinden
2. Build-Settings konfigurieren
3. Umgebungsvariablen setzen
4. Deploy

## 📈 Roadmap

### Phase 1: MVP (Aktuell) ✅
- [x] Basis-Funktionalität
- [x] Demo-Modus
- [x] Grundlegende UI

### Phase 2: Beta (Geplant)
- [ ] User-Authentifizierung
- [ ] Push-Benachrichtigungen
- [ ] Erweiterte Statistiken
- [ ] Mobile App (React Native)

### Phase 3: Production (Zukunft)
- [ ] Multi-City Support
- [ ] Premium Features
- [ ] API für Drittanbieter
- [ ] Machine Learning Integration

## 🤝 Beitragen

1. Fork das Repository
2. Feature Branch erstellen (`git checkout -b feature/AmazingFeature`)
3. Änderungen committen (`git commit -m 'Add AmazingFeature'`)
4. Branch pushen (`git push origin feature/AmazingFeature`)
5. Pull Request erstellen

## 📄 Lizenz

Dieses Projekt steht unter der MIT-Lizenz. Siehe [LICENSE](LICENSE) für Details.

## 🙏 Credits

- **Karten**: [OpenStreetMap](https://www.openstreetmap.org/)
- **Icons**: [Lucide](https://lucide.dev/)
- **Framework**: [Next.js](https://nextjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Backend**: [Supabase](https://supabase.com/)

## 📞 Kontakt

**Entwickler**: Arvin Ka
**Projekt**: Parkly - Kostenlose Parkplatz-Finder App
**GitHub**: [arvinka23](https://github.com/arvinka23)

---

**Parkly** - Finde kostenlose Parkplätze mit der Community! 🚗✨
