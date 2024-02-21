create table position (
	position_id uuid primary key,
	ride_id uuid,
	lat numeric,
	long numeric,
	date timestamp
);