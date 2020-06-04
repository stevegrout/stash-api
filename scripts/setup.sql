CREATE USER stash WITH PASSWORD 'password';
CREATE DATABASE stash_db;
\c stash_db;
ALTER DEFAULT PRIVILEGES GRANT ALL ON TABLES TO stash;
ALTER DEFAULT PRIVILEGES GRANT ALL ON SEQUENCES TO stash;
CREATE TABLE users(id SERIAL PRIMARY KEY, username varchar(300), age integer, balance float, recommended_monthly_savings float);
CREATE TABLE transactions(id SERIAL PRIMARY KEY, user_id integer, amount float, type varchar(20), description varchar(20), time timestamp);
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO stash;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO stash;
