CREATE TABLE
  `voicemail` (
    `id` integer not null primary key autoincrement,
    `owner_id` VARCHAR(36) null,
    `name` varchar(255) null,
    `audio_url` TEXT null,
    `allowed` BOOLEAN not null default TRUE,
    `created_at` datetime not null default CURRENT_TIMESTAMP,
    unique (`id`)
  )