DROP SCHEMA IF EXISTS "user" CASCADE;

CREATE SCHEMA "user";

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE "user".user_roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

INSERT INTO "user".user_roles (name) VALUES ('user'), ('admin');

CREATE TABLE "user".users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email varchar(255) NOT NULL,
  password varchar(255) NOT NULL,
  first_name varchar(255) NOT NULL,
  last_name varchar(255) NOT NULL,
  role_id INT NOT NULL DEFAULT 1,
  created_at timestamp without time zone DEFAULT now() NOT NULL,
  updated_at timestamp without time zone DEFAULT now() NOT NULL,
  CONSTRAINT fk_role FOREIGN KEY (role_id) REFERENCES "user".user_roles(id) ON DELETE SET DEFAULT,
  UNIQUE (email)
);

CREATE TABLE "user".blacklisted_tokens (
  id SERIAL PRIMARY KEY,
  token varchar NOT NULL,
  permanent boolean NOT NULL DEFAULT false,
  expires timestamp without time zone DEFAULT now() NOT NULL
);

CREATE SCHEMA IF NOT EXISTS "task";

-- Task Categories
CREATE TABLE "task".categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE -- Work, Personal, Learning, etc.
);


CREATE TABLE "task".task_list (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES "user".users(id) ON DELETE CASCADE,
  category_id INTEGER REFERENCES "task".categories(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'pending', -- pending, in progress, completed
  priority VARCHAR(50) NOT NULL DEFAULT 'medium', -- high, medium, low
  due_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Task Comments
CREATE TABLE "task".comments (
  id SERIAL PRIMARY KEY,
  task_id UUID REFERENCES "task".task_list(id) ON DELETE CASCADE,
  user_id UUID REFERENCES "user".users(id) ON DELETE SET NULL,
  comment TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
