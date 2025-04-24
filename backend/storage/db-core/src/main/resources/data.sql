
INSERT INTO "user" (
    username, password, nickname, phone_number, created_at, updated_at, entity_status
) VALUES
      ('local', '{noop}local-password', '김로컬', '01012341234', NOW(6), NOW(6), 'ACTIVE'),
('local2', '{noop}local-password', '김덕윤', '01012341234', NOW(6), NOW(6), 'ACTIVE');

INSERT INTO category (
    name, created_at, updated_at, entity_status
) VALUES
    ('옷', NOW(6), NOW(6), 'ACTIVE'),
    ('아기용품', NOW(6), NOW(6), 'ACTIVE'),
    ('장난감', NOW(6), NOW(6), 'ACTIVE'),
    ('기능', NOW(6), NOW(6), 'ACTIVE'),
    ('가구', NOW(6), NOW(6), 'ACTIVE'),
    ('잡화', NOW(6), NOW(6), 'ACTIVE'),
    ('육아', NOW(6), NOW(6), 'ACTIVE'),
    ('기타', NOW(6), NOW(6), 'ACTIVE');