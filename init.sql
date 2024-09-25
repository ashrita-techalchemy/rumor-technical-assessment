-- CREATE USER postgres WITH PASSWORD 'postgres';
DO $$BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_database WHERE datname = 'rumor') THEN
        CREATE DATABASE rumor;
        GRANT ALL PRIVILEGES ON DATABASE rumor TO postgres;
    END IF;
END$$;