-- Convenience copy of migrations/001_initial_schema.sql for importing by hand (e.g. phpMyAdmin).
-- The migrations folder is authoritative; prefer `npm run db:migrate`.
-- Ivy Interio: initial MySQL 8 schema (utf8mb4, InnoDB).
-- Applied by `npm run db:migrate` and recorded in schema_migrations. Safe to re-run (IF NOT EXISTS).

CREATE TABLE IF NOT EXISTS admin_users (
  id             BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  email          VARCHAR(160)  NOT NULL,
  name           VARCHAR(80)   NOT NULL DEFAULT 'Administrator',
  password_hash  VARCHAR(100)  NOT NULL,                       -- bcrypt, never plaintext
  role           ENUM('admin','editor') NOT NULL DEFAULT 'editor',
  active         TINYINT(1)    NOT NULL DEFAULT 1,
  failed_logins  INT UNSIGNED  NOT NULL DEFAULT 0,             -- login lockout counters
  lock_until     DATETIME(3)   NULL,
  last_login_at  DATETIME(3)   NULL,
  created_at     DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at     DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  UNIQUE KEY uq_admin_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- One table for services, projects, gallery, testimonials, blog posts, team, FAQs and banners
-- (the same single-collection design the app already used; `type` selects the kind).
CREATE TABLE IF NOT EXISTS content_items (
  id           BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  type         ENUM('service','project','gallery','testimonial','blog','team','faq','banner') NOT NULL,
  title        VARCHAR(160)  NOT NULL,
  slug         VARCHAR(120)  NULL,
  description  TEXT          NULL,
  content      MEDIUMTEXT    NULL,
  image        VARCHAR(1000) NULL,
  gallery      JSON          NULL,
  category     VARCHAR(100)  NULL,
  location     VARCHAR(120)  NULL,
  tags         JSON          NULL,
  author       VARCHAR(100)  NULL,
  meta         JSON          NULL,
  seo          JSON          NULL,
  sort_order   INT           NOT NULL DEFAULT 0,
  active       TINYINT(1)    NOT NULL DEFAULT 1,                -- "published"
  featured     TINYINT(1)    NOT NULL DEFAULT 0,
  published_at DATETIME(3)   NULL,
  created_at   DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at   DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  UNIQUE KEY uq_content_type_slug (type, slug),                 -- several NULL slugs are allowed
  KEY idx_content_list (type, active, sort_order, created_at),
  KEY idx_content_updated (updated_at),
  KEY idx_content_category (type, category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS enquiries (
  id               BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name             VARCHAR(80)   NOT NULL,
  phone            VARCHAR(20)   NOT NULL,
  email            VARCHAR(120)  NULL,
  city             VARCHAR(120)  NULL,
  service          VARCHAR(120)  NULL,
  message          TEXT          NULL,
  source           ENUM('contact-form','cost-calculator','quote') NOT NULL,
  property_type    VARCHAR(50)   NULL,
  area             DECIMAL(12,2) NULL,
  quality          VARCHAR(50)   NULL,
  budget           VARCHAR(60)   NULL,
  estimated_lower  DECIMAL(14,2) NULL,
  estimated_upper  DECIMAL(14,2) NULL,
  status           ENUM('new','contacted','discussion','site-visit','converted','closed') NOT NULL DEFAULT 'new',
  created_at       DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at       DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  KEY idx_enq_created (created_at),
  KEY idx_enq_status (status, created_at),
  KEY idx_enq_source (source),
  KEY idx_enq_phone (phone, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Internal notes were an embedded array in MongoDB; now a child table.
CREATE TABLE IF NOT EXISTS enquiry_notes (
  id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  enquiry_id  BIGINT UNSIGNED NOT NULL,
  text        VARCHAR(1000) NOT NULL,
  created_by  VARCHAR(160)  NULL,
  created_at  DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  KEY idx_notes_enquiry (enquiry_id, created_at),
  CONSTRAINT fk_notes_enquiry FOREIGN KEY (enquiry_id) REFERENCES enquiries (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS pages (
  id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  page_key    VARCHAR(100)  NOT NULL,
  title       VARCHAR(160)  NOT NULL,
  status      ENUM('draft','published') NOT NULL DEFAULT 'draft',
  seo         JSON          NULL,
  updated_by  VARCHAR(160)  NULL,
  created_at  DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at  DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  UNIQUE KEY uq_pages_key (page_key),
  KEY idx_pages_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Page sections were an embedded array; `position` keeps their order.
CREATE TABLE IF NOT EXISTS page_sections (
  id           BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  page_id      BIGINT UNSIGNED NOT NULL,
  section_uid  VARCHAR(40)   NOT NULL,
  position     INT UNSIGNED  NOT NULL,
  type         ENUM('hero','intro','text','banner','cta','services','projects','gallery','testimonials','blog','faq','process','team') NOT NULL,
  heading      VARCHAR(200)  NULL,
  subheading   VARCHAR(300)  NULL,
  body         TEXT          NULL,
  image        VARCHAR(1000) NULL,
  cta_label    VARCHAR(60)   NULL,
  cta_url      VARCHAR(500)  NULL,
  visible      TINYINT(1)    NOT NULL DEFAULT 1,
  PRIMARY KEY (id),
  UNIQUE KEY uq_section_uid (page_id, section_uid),
  KEY idx_sections_order (page_id, position),
  CONSTRAINT fk_sections_page FOREIGN KEY (page_id) REFERENCES pages (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Site settings as key/value rows (siteName, phone, email, address lines, footer text, default SEO, logo, favicon ...).
CREATE TABLE IF NOT EXISTS site_settings (
  setting_key    VARCHAR(80)  NOT NULL,
  setting_value  TEXT         NULL,
  updated_by     VARCHAR(160) NULL,
  updated_at     DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (setting_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS social_links (
  id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  platform    VARCHAR(30)   NOT NULL,
  url         VARCHAR(1000) NOT NULL,
  sort_order  INT           NOT NULL DEFAULT 0,
  updated_at  DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  UNIQUE KEY uq_social_platform (platform)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS seo_entries (
  id           BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  path         VARCHAR(200)  NOT NULL,
  title        VARCHAR(70)   NULL,
  description  VARCHAR(200)  NULL,
  canonical    VARCHAR(500)  NULL,
  og_image     VARCHAR(1000) NULL,
  noindex      TINYINT(1)    NOT NULL DEFAULT 0,
  created_at   DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at   DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  UNIQUE KEY uq_seo_path (path)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
