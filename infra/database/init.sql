CREATE USER fellowship WITH ENCRYPTED PASSWORD 'fellowship';

CREATE DATABASE fellowship OWNER fellowship;

GRANT ALL PRIVILEGES ON DATABASE fellowship TO fellowship;

\connect fellowship
GRANT ALL PRIVILEGES ON SCHEMA public TO fellowship;

ALTER SCHEMA public OWNER TO fellowship;