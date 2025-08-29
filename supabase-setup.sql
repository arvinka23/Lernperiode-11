-- Parkly Database Setup für Supabase
-- Führe diesen Code in der Supabase SQL Editor aus

-- Parkplätze Tabelle
CREATE TABLE parking_spots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lat DECIMAL(10, 8) NOT NULL,
  lng DECIMAL(11, 8) NOT NULL,
  status TEXT CHECK (status IN ('free', 'occupied')) DEFAULT 'free',
  reported_by TEXT NOT NULL,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  confidence_score DECIMAL(3, 2) DEFAULT 0.5,
  name TEXT
);

-- User Tabelle (für Gamification)
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  points INTEGER DEFAULT 0,
  reports_count INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1
);

-- Reports Tabelle (für Qualitätskontrolle)
CREATE TABLE reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  spot_id UUID REFERENCES parking_spots(id),
  user_id TEXT NOT NULL,
  status TEXT CHECK (status IN ('free', 'occupied')) NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS (Row Level Security) aktivieren
ALTER TABLE parking_spots ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Policies für öffentlichen Zugriff (Demo-Modus)
CREATE POLICY "Allow public read access" ON parking_spots FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON parking_spots FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON parking_spots FOR UPDATE USING (true);

CREATE POLICY "Allow public read access" ON users FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON users FOR UPDATE USING (true);

CREATE POLICY "Allow public read access" ON reports FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON reports FOR INSERT WITH CHECK (true);

-- Demo-Daten einfügen (optional)
INSERT INTO parking_spots (lat, lng, status, reported_by, name) VALUES
  (47.3769, 8.5417, 'free', 'demo-user', 'Parkplatz Bahnhof Zürich'),
  (47.3789, 8.5397, 'occupied', 'demo-user', 'Parkplatz Paradeplatz'),
  (47.3749, 8.5437, 'free', 'demo-user', 'Parkplatz Limmatquai'),
  (47.3809, 8.5377, 'free', 'demo-user', 'Parkplatz Niederdorf'),
  (47.3729, 8.5457, 'occupied', 'demo-user', 'Parkplatz Universität');

-- Demo-User erstellen
INSERT INTO users (id, points, reports_count, level) VALUES
  ('demo-user', 1250, 47, 8);
