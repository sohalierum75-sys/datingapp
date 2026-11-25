-- Safe migration to add Adsterra monetization toggles and custom codes
ALTER TABLE pages ADD COLUMN ad_popunder_enabled INTEGER NOT NULL DEFAULT 1;
ALTER TABLE pages ADD COLUMN ad_socialbar_enabled INTEGER NOT NULL DEFAULT 1;
ALTER TABLE pages ADD COLUMN ad_popunder_code TEXT;
ALTER TABLE pages ADD COLUMN ad_socialbar_code TEXT;

