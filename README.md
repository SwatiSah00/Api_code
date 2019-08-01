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


