create type statuses as enum ('OPEN', 'ORDERED');

create extension if not exists "uuid-ossp";

create table carts (
	id uuid primary key default uuid_generate_v4(),
	user_id uuid not null,
	created_at timestamp default now(),
	updated_at timestamp default now(),
	status statuses default 'OPEN'
);

create function update_date() returns trigger as $$
	begin
		new.updated_at = now();
		return new;
	end
$$ language plpgsql;

create trigger carts_updated
	before update
	on carts
	for each row execute procedure
	update_date();
	

create table cart_items (
	cart_id uuid,
	product_id uuid,
	count int,
	foreign key ("cart_id") references "carts" ("id")
);

insert into carts (user_id, status) values
	('1dbe865a-36c6-4740-afb1-1ea9f48bdbca', 'OPEN'),
	('9206a2e7-e3d1-4518-bff8-64413629f9b3', 'OPEN'),
	('156c2c04-d177-4d5e-ba0e-10c6e47e4deb', 'OPEN'),
	('04fe7876-5983-470d-8438-1224461984b6', 'ORDERED'),
	('ab6782ba-70e5-428e-9774-05af0c34dcaa', 'ORDERED')

insert into cart_items (cart_id, product_id, count) values
	('eae69ccf-745a-4a55-ad1d-4c9433fa76b3', 'ff514320-a8ac-47e1-975e-9778a15535a2', 5),
	('62f9e484-23f1-4257-b339-b335fa8a2570', 'f093b81c-284a-4a0b-b40b-444942ec2b75', 1),
	('8b01889b-3dd4-4211-b369-49920f5c35a0', 'f093b81c-284a-4a0b-b40b-444942ec2b75', 1),
	('0bcddba7-a033-4a74-b3fd-4a0d48cc2be1', '4c9da382-3a59-460e-ab4a-5b60e4f841ab', 2),
	('7bb97ba3-67c1-4f51-9972-c1fbce374b89', '4c9da382-3a59-460e-ab4a-5b60e4f841ab', 10)