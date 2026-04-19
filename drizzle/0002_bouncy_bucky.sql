CREATE TABLE `comments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`song_id` int NOT NULL,
	`commented_by_member_id` int NOT NULL,
	`content` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `comments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `likes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`song_id` int NOT NULL,
	`liked_by_member_id` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `likes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `member_access_codes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`band_member_id` int NOT NULL,
	`access_code` varchar(50) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `member_access_codes_id` PRIMARY KEY(`id`),
	CONSTRAINT `member_access_codes_access_code_unique` UNIQUE(`access_code`)
);
--> statement-breakpoint
CREATE TABLE `songs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`band_member_id` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`song_url` varchar(500),
	`youtube_url` varchar(500),
	`spotify_url` varchar(500),
	`likes_count` int NOT NULL DEFAULT 0,
	`comments_count` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `songs_id` PRIMARY KEY(`id`)
);
