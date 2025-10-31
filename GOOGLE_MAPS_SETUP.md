# Google Maps API Setup Anleitung

## Google Maps API Key einrichten

### 1. Google Cloud Console
1. Gehe zu [Google Cloud Console](https://console.cloud.google.com/)
2. Erstelle ein neues Projekt oder wähle ein bestehendes
3. Aktiviere die **Places API**:
   - Gehe zu "APIs & Services" → "Library"
   - Suche nach "Places API"
   - Klicke auf "Enable"

### 2. API Key erstellen
1. Gehe zu "APIs & Services" → "Credentials"
2. Klicke auf "Create Credentials" → "API Key"
3. Kopiere den API Key
4. **WICHTIG**: Beschränke den API Key für Sicherheit:
   - Klicke auf den erstellten API Key
   - Unter "API restrictions" wähle "Restrict key"
   - Wähle nur "Places API"
   - Unter "Application restrictions" kannst du optional IP-Adressen oder HTTP-Referrer einschränken

### 3. Umgebungsvariable setzen
Erstelle eine `.env.local` Datei im Root-Verzeichnis:

```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=dein-api-key-hier
```

### 4. Kostenloses Kontingent
- **$200 Guthaben pro Monat** (kostenlos)
- **~40.000 Text Search Requests** pro Monat
- Überschreitungen werden nach dem Guthaben verrechnet

### 5. Preise (nach kostenlosem Kontingent)
- Text Search: $0.032 pro Request
- Bei 1000 Requests/Tag = ca. $32/Monat
- **Empfehlung**: Nutze das kostenlose Kontingent für Entwicklung

## Wichtige Hinweise

⚠️ **Sicherheit**: 
- API Key ist öffentlich sichtbar (NEXT_PUBLIC_*)
- Verwende API Restrictions in Google Cloud Console
- Keine sensiblen Daten im Key speichern

💡 **Optimierung**:
- Caching reduziert API-Aufrufe (10 Minuten Cache)
- Radius von 2km ist optimal für Balance zwischen Coverage und Kosten

## Troubleshooting

### "API key not valid"
- Überprüfe, dass der API Key korrekt kopiert wurde
- Stelle sicher, dass die Places API aktiviert ist
- Prüfe API Restrictions in Google Cloud Console

### "Request denied"
- Überprüfe API Restrictions
- Stelle sicher, dass die Places API aktiviert ist
- Prüfe Billing Account (auch kostenloses Guthaben benötigt ein Billing Account)

### Rate Limits
- Google Places API hat Rate Limits
- Cache reduziert Requests automatisch
- Bei vielen Nutzern: Erwäge Server-Side Caching

