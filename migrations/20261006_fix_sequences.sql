-- Script para sincronizar os contadores (sequences) de todas as tabelas do banco de dados.
-- Isso resolve o erro "duplicate key value violates unique constraint" que ocorre 
-- durante o upload de imagens ou inserções no painel Admin, quando o contador interno do 
-- PostgreSQL perde a sincronia com os IDs reais presentes nas tabelas.

DO $$
DECLARE
    seq RECORD;
BEGIN
    FOR seq IN 
        SELECT 
            t.relname as table_name, 
            s.relname as seq_name
        FROM pg_class s
        JOIN pg_depend d ON d.objid = s.oid AND d.classid = 'pg_class'::regclass AND d.refclassid = 'pg_class'::regclass
        JOIN pg_class t ON t.oid = d.refobjid
        WHERE s.relkind = 'S'
    LOOP
        EXECUTE 'SELECT setval(''' || seq.seq_name || ''', COALESCE((SELECT MAX(id) FROM ' || quote_ident(seq.table_name) || '), 1))';
        RAISE NOTICE 'Reset sequence % for table %', seq.seq_name, seq.table_name;
    END LOOP;
END $$;
