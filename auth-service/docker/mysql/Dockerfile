FROM mysql:8.0

# Copy initialization script
COPY init/01-init-database.sql /docker-entrypoint-initdb.d/

# Copy MySQL configuration
COPY conf/mysql.cnf /etc/mysql/conf.d/








