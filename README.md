"# Api_code"
"node-mysql-knex-socket" contains code for middleware.

Following  is the code to make connection betweeen middleware and Data Store layer:

MySQL shell is started, and access is given to the middleware machine by following command:

CREATE USER 'user'@'IP' IDENTIFIED BY 'password';

GRANT ALL PRIVILEGES ON . TO 'user'@'IP' WITH GRANT OPTION;

FLUSH PRIVILEGES;


In MySQL config file (/etc/mysql/my.cnf) set the bind address to the IP of the hosting system.


[mysqld]


bind-address = 192.168.0.176


Restart MySQL service:


systemctl stop mysql


systemctl start  mysql


check the status of MySQL service, it should be Active/running


systemctl status  mysql.service


Following command is used to check if middleware user is created:


SELECT User, Host, authentication_string FROM mysql.user;


Following code to check error log:



tail -f /var/log/mysql/error.log


Following Table were created:
For Todo

CREATE TABLE `share_list` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `list_id` int(11) DEFAULT NULL,
  `sender_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),

); 


CREATE TABLE `my_list` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `list_name` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),

);


DROP TABLE IF EXISTS `todo`;


CREATE TABLE `todo` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `subject` varchar(100) DEFAULT NULL,
  `description` varchar(1000) DEFAULT NULL,
  `created_on` datetime DEFAULT NULL,
  `completion_date` datetime DEFAULT NULL,
  `status_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
  );
  
  
  DROP TABLE IF EXISTS `users`;
  
  
  CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `login_id` varchar(40) NOT NULL,
  `password` varchar(45) NOT NULL,
  `created_on` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
)


For Chat

DROP TABLE IF EXISTS `messages`;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
 `user_id` int(11) DEFAULT NULL,
 `sender_id` int(11) DEFAULT NULL,
  `created_on` datetime(6) NOT NULL,
 `message` longtext DEFAULT NULL,
  PRIMARY KEY (`id`)
);


  
  DROP TABLE IF EXISTS `users`;
  
  
  CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `login_id` varchar(40) NOT NULL,
  `password` varchar(45) NOT NULL,
  `created_on` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
)

