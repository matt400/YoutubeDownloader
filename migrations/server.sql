CREATE TABLE 'compressed_files' (
	`id` INTEGER PRIMARY KEY AUTOINCREMENT,
	`video_id`TEXT,
	`quality` TEXT,
	`format` TEXT,
	`real_name` TEXT,
	`filesize` TEXT,
	`video_duration` TEXT,
	`sid`	TEXT UNIQUE,
	`started_time` INTEGER,
	`finished_time` INTEGER
);

CREATE TABLE 'download_files' (
	`id` INTEGER PRIMARY KEY AUTOINCREMENT,
	`video_id` TEXT UNIQUE,
	`video_duration` TEXT,
	`started_time` INTEGER,
	`finished_time` INTEGER
);

CREATE TABLE 'sessions' (
	`sid` TEXT PRIMARY KEY,
	`expired` INTEGER,
	`sess` TEXT
);
