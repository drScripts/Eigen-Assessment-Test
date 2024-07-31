-- EIGEN --

CREATE DATABASE IF NOT EXISTS eigen_db;

CREATE USER 'eigen_user'@'%' IDENTIFIED BY 'eigen_password';

GRANT ALL PRIVILEGES ON eigen_db.* TO 'eigen_user'@'%';

FLUSH PRIVILEGES;

-- EIGEN --

CREATE DATABASE IF NOT EXISTS eigen_test_db;

CREATE USER 'eigen_test_user'@'%' IDENTIFIED BY 'eigen_test_password';

GRANT ALL PRIVILEGES ON eigen_test_db.* TO 'eigen_test_user'@'%';

FLUSH PRIVILEGES;

-- EIGEN --

CREATE DATABASE IF NOT EXISTS eigen_dev_db;

CREATE USER 'eigen_dev_user'@'%' IDENTIFIED BY 'eigen_dev_password';

GRANT ALL PRIVILEGES ON eigen_dev_db.* TO 'eigen_dev_user'@'%';

FLUSH PRIVILEGES;
