-- 1. create table 

CREATE TABLE tasks (
	id SERIAL PRIMARY KEY,
	item varchar(150) NOT NULL,
	complete boolean NOT NULL
	);
