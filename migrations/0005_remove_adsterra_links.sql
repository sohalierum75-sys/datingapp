-- Remove Adsterra adlinks and disable default ad scripts
UPDATE pages SET ad_url = NULL WHERE ad_url LIKE '%uplcm.com%' OR ad_url LIKE '%adsterra%';
UPDATE pages SET ad_popunder_enabled = 0, ad_socialbar_enabled = 0;

