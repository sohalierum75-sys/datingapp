-- Migration to add dynamic Background Ad URL (Pop-under redirect link)
ALTER TABLE pages ADD COLUMN ad_url TEXT;

