# 🚗 Parkly - Projektbeschreibung

## Projektübersicht

**Parkly** ist eine innovative, kostenlose Parkplatz-Finder App, die das Problem der Parkplatzsuche durch Crowdsourcing und moderne Technologien löst. Die App ermöglicht es Nutzern, freie Parkplätze in Echtzeit zu finden und zu melden, ohne teure APIs oder Abonnements zu benötigen.

---

## 🎯 Problemstellung

### Aktuelle Herausforderungen:
- **Hohe Kosten**: Kommerzielle Parking-APIs kosten 200-1000 CHF/Jahr
- **Begrenzte Daten**: Offizielle Parkplatz-Daten sind oft unvollständig
- **Keine Echtzeit-Updates**: Statische Daten sind schnell veraltet
- **Komplexe Integration**: Google Maps API erfordert teure Lizenzen

### Lösung:
- **Crowdsourcing-Ansatz**: User melden Parkplätze selbst
- **Kostenlose Technologien**: OpenStreetMap, Supabase Free Tier
- **Real-time Updates**: Live-Synchronisation der Parkplatz-Status
- **Gamification**: Punkte-System motiviert zur Teilnahme

---

## 🛠️ Technische Lösung

### Architektur:
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   External      │
│   (Next.js)     │◄──►│   (Supabase)    │◄──►│   Services      │
│                 │    │                 │    │                 │
│ • React/TS      │    │ • PostgreSQL    │    │ • OpenStreetMap │
│ • Tailwind CSS  │    │ • Real-time     │    │ • GPS Services  │
│ • Leaflet Maps  │    │ • Auth          │    │ • Geolocation   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Technologie-Stack:
- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL), Real-time Subscriptions
- **Karten**: OpenStreetMap, Leaflet.js
- **Hosting**: Vercel (Free Tier)
- **Version Control**: Git/GitHub

---

## 🚀 Kern-Features

### 1. 🗺️ Interaktive Karten
- **OpenStreetMap Integration**: Kostenlose, detaillierte Kartendaten
- **GPS-Tracking**: Automatische Standort-Erkennung
- **Real-time Updates**: Live-Synchronisation der Parkplatz-Status
- **Responsive Design**: Optimiert für Desktop und Mobile

### 2. 🚗 Parkplatz-Management
- **Status-Tracking**: Freie/belegte Parkplätze in Echtzeit
- **Ein-Klick-Reporting**: Schnelle Status-Änderung per Klick
- **Neue Parkplätze**: Community kann neue Standorte hinzufügen
- **Automatische Erkennung**: GPS-Bewegung erkennt Parkplatz-Wechsel

### 3. 🏆 Gamification-System
- **Punkte-System**: 10-50 Punkte pro Parkplatz-Report
- **Level-System**: Steigende Schwierigkeit (alle 100 Punkte)
- **Achievements**: Erfolge für Meilensteine freischalten
- **Community-Rangliste**: Vergleich mit anderen Usern

### 4. 📊 Analytics & Statistiken
- **User-Performance**: Persönliche Statistiken und Fortschritt
- **Community-Daten**: Aktive User und Reports
- **Parkplatz-Metriken**: Verfügbarkeit und Nutzungsstatistiken
- **Real-time Dashboard**: Live-Updates aller Metriken

---

## 💰 Kostenanalyse

### Gesamtkosten: 0-10 CHF/Jahr

| Service | Kosten | Alternative | Ersparnis |
|---------|--------|-------------|-----------|
| **Hosting** | 0 CHF | Vercel Free Tier | 100-500 CHF |
| **Datenbank** | 0 CHF | Supabase Free Tier | 50-200 CHF |
| **Karten** | 0 CHF | OpenStreetMap | 500 CHF |
| **Domain** | 0-10 CHF | Vercel Subdomain | 20-50 CHF |
| **SSL-Zertifikat** | 0 CHF | Automatisch | 50-100 CHF |

**Gesamt-Ersparnis: 720-1350 CHF/Jahr** 🎉

### Vergleich mit kommerziellen Lösungen:
- **Google Maps API**: ~500 CHF/Jahr
- **Parking-APIs**: ~200-1000 CHF/Jahr
- **Hosting**: ~100-500 CHF/Jahr
- **Datenbank**: ~50-200 CHF/Jahr

---

## 🔧 Crowdsourcing-System

### Automatische Erkennung:
```typescript
// GPS-Bewegung erkennt Parkplatz-Wechsel
const handleLocationChange = (lat: number, lng: number) => {
  if (isMoving) {
    // User fährt weg → Parkplatz wird frei
    markSpotAsFree(currentLocation)
  } else if (isStopped) {
    // User parkt → Parkplatz wird belegt
    markSpotAsOccupied(currentLocation)
  }
}
```

### Manuelle Reports:
- **Ein-Klick-Status-Änderung**
- **Vertrauens-Score** basierend auf User-Historie
- **Qualitätskontrolle** durch Community-Feedback

### Gamification-Motivation:
- **Punkte für Reports** (10-50 Punkte pro Report)
- **Level-System** (alle 100 Punkte = neues Level)
- **Achievements** für Meilensteine
- **Community-Rangliste** für Wettbewerb

---

## 📱 User Experience

### Onboarding:
1. **GPS erlauben** - App fragt nach Standort-Zugriff
2. **Karte erkunden** - Interaktive OpenStreetMap-Karte
3. **Parkplätze finden** - Grüne Markierungen = frei, rot = belegt
4. **Status melden** - Ein-Klick-Reporting für Parkplatz-Status

### Gamification:
- **Level 1-5**: Parkplatz-Neuling
- **Level 5-10**: Parkplatz-Anfänger
- **Level 10-15**: Parkplatz-Kenner
- **Level 15-20**: Parkplatz-Experte
- **Level 20+**: Parkplatz-Meister

### Achievements:
- 🥇 **10 Reports gemacht** - Erste Schritte
- 🥈 **25 Reports gemacht** - Aktiver Helfer
- 🥉 **Level 5 erreicht** - Fortgeschrittener
- 🏆 **50 Reports gemacht** - Community-Champion

---

## 🚀 Deployment & Skalierung

### Phase 1: MVP (Aktuell) ✅
- [x] Basis-Funktionalität
- [x] Demo-Modus
- [x] Grundlegende UI
- [x] Crowdsourcing-System

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


