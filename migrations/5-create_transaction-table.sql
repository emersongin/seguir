create table transaction (
  transaction_id uuid primary key,
  ride_id uuid,
  amount numeric,
  date timestamp,
  status text
);