-- 1. create table 

CREATE TABLE todo (
	id SERIAL PRIMARY KEY,
	item varchar(150) NOT NULL,
	complete boolean NOT NULL
	);
