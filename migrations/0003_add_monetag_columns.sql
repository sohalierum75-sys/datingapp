-- Migration to add Monetag Direct Link support
ALTER TABLE pages ADD COLUMN monetag_direct_link TEXT;

