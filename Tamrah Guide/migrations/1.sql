
CREATE TABLE date_types (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name_en TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  description_en TEXT NOT NULL,
  description_ar TEXT NOT NULL,
  taste_profile_en TEXT NOT NULL,
  taste_profile_ar TEXT NOT NULL,
  sweetness_level INTEGER NOT NULL, -- 1-5 scale
  texture_en TEXT NOT NULL,
  texture_ar TEXT NOT NULL,
  color TEXT NOT NULL,
  size_en TEXT NOT NULL,
  size_ar TEXT NOT NULL,
  average_price_per_kg REAL NOT NULL,
  key_features_en TEXT NOT NULL,
  key_features_ar TEXT NOT NULL,
  image_url TEXT,
  is_premium BOOLEAN DEFAULT 0,
  harvest_season_en TEXT,
  harvest_season_ar TEXT,
  origin_region_en TEXT,
  origin_region_ar TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_date_types_sweetness ON date_types(sweetness_level);
CREATE INDEX idx_date_types_price ON date_types(average_price_per_kg);
