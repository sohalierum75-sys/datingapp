-- Migration to add dynamic raw script columns for Adsterra Popunder & Social Bar
ALTER TABLE pages ADD COLUMN ad_popunder TEXT;
ALTER TABLE pages ADD COLUMN ad_socialbar TEXT;

