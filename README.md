"# Api_code"
"node-mysql-knex-socket" contains code for middleware.

Following  is the code to make connection betweeen middleware and Data Store layer:

In MySQL config file (/etc/mysql/my.cnf) set the bind address to the IP of the hosting system.

[mysqld]
bind-address = 192.168.0.176


