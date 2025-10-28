CREATE TABLE `house_list` (
	`id` int AUTO_INCREMENT NOT NULL,
	`houseNumber` varchar(50) NOT NULL,
	`adminEmail` varchar(320),
	`registrationDate` date,
	`status` enum('active','expired','moved','cancelled') NOT NULL DEFAULT 'active',
	`note` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `house_list_id` PRIMARY KEY(`id`),
	CONSTRAINT `house_list_houseNumber_unique` UNIQUE(`houseNumber`)
);
--> statement-breakpoint
CREATE TABLE `house_members` (
	`id` int AUTO_INCREMENT NOT NULL,
	`houseId` int NOT NULL,
	`memberEmail` varchar(320) NOT NULL,
	`expirationDate` date,
	`note` text,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `house_members_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `info_log` (
	`id` int AUTO_INCREMENT NOT NULL,
	`lineId` varchar(100),
	`phoneNumber` varchar(20),
	`registrationDate` date,
	`expirationDate` date,
	`package` varchar(100),
	`packagePrice` int,
	`email` varchar(320),
	`houseGroup` varchar(50),
	`customerName` varchar(255),
	`channel` enum('line','facebook','walk-in','other'),
	`cancelledOrMoved` enum('cancelled','moved','') DEFAULT '',
	`syncStatus` enum('ok','error','pending') NOT NULL DEFAULT 'pending',
	`syncNote` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `info_log_id` PRIMARY KEY(`id`)
);
