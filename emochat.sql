CREATE TABLE `temo_user` ( `user_id` INT NOT NULL AUTO_INCREMENT , `user_name` VARCHAR(100) NOT NULL , `user_u_name` VARCHAR(100) NOT NULL , `user_email` VARCHAR(100) NOT NULL , `user_password` VARCHAR(50) NOT NULL , PRIMARY KEY (`user_id`), UNIQUE (`user_u_name`)) ENGINE = InnoDB;
CREATE TABLE `temo_chat` ( `chat_id` INT NOT NULL AUTO_INCREMENT , `s_user_id` INT NOT NULL , `r_user_id` INT NOT NULL , `message` TEXT NOT NULL , PRIMARY KEY (`chat_id`)) ENGINE = InnoDB;
ALTER TABLE `temo_chat` ADD INDEX(`s_user_id`);
ALTER TABLE `temo_chat` ADD INDEX(`r_user_id`);
ALTER TABLE `temo_chat` ADD FOREIGN KEY (`s_user_id`) REFERENCES `temo_user`(`user_id`) ON DELETE RESTRICT ON UPDATE RESTRICT; ALTER TABLE `temo_chat` ADD FOREIGN KEY (`r_user_id`) REFERENCES `temo_user`(`user_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;
CREATE TABLE `temo_video` ( `video_id` INT NOT NULL AUTO_INCREMENT , `user_id` INT NOT NULL , `video_name` VARCHAR(100) NOT NULL , PRIMARY KEY (`video_id`)) ENGINE = InnoDB;
ALTER TABLE `temo_video` ADD FOREIGN KEY (`user_id`) REFERENCES `temo_user`(`user_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE `temo_user` ADD `show_video_all` TINYINT(1) NOT NULL AFTER `user_password`;
ALTER TABLE `temo_chat` ADD `message_tone` VARCHAR(50) NOT NULL AFTER `message`;
