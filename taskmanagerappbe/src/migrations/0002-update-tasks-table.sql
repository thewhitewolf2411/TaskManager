ALTER TABLE "task".task_list 
DROP COLUMN due_date,
ALTER COLUMN status TYPE VARCHAR(255);
