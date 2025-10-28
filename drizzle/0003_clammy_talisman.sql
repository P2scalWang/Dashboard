ALTER TABLE `house_members` ADD `lineId` varchar(100);--> statement-breakpoint
ALTER TABLE `house_members` ADD `phoneNumber` varchar(20);--> statement-breakpoint
ALTER TABLE `house_members` ADD `customerName` varchar(255);--> statement-breakpoint
ALTER TABLE `house_members` ADD `email` varchar(320);--> statement-breakpoint
ALTER TABLE `house_members` ADD `registrationDate` date;--> statement-breakpoint
ALTER TABLE `house_members` ADD `package` varchar(100);--> statement-breakpoint
ALTER TABLE `house_members` ADD `packagePrice` int;--> statement-breakpoint
ALTER TABLE `house_members` ADD `channel` enum('line','facebook','walk-in','other');--> statement-breakpoint
ALTER TABLE `house_members` ADD `status` enum('active','expired') DEFAULT 'active' NOT NULL;