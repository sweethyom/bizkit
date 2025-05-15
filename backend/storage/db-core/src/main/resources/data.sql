-- 테스트 계정 데이터
INSERT INTO "user" (
    EMAIL,
    NICKNAME,
    PASSWORD,
    PROFILE_IMAGE_URL,
    PROFILE_IMG_URL,
    ENTITY_STATUS,
    CREATED_AT,
    UPDATED_AT
) VALUES (
    'test1@test.com',
    'test1',
    '{noop}password!',
    NULL,
    NULL,
    'ACTIVE',
    CURRENT_TIMESTAMP(),
    CURRENT_TIMESTAMP()
);

-- 관리자 테스트 계정
INSERT INTO "user" (
    EMAIL,
    NICKNAME,
    PASSWORD,
    PROFILE_IMAGE_URL,
    PROFILE_IMG_URL,
    ENTITY_STATUS,
    CREATED_AT,
    UPDATED_AT
) VALUES (
    'test2@test.com',
    'test2',
    '{noop}password!',
    NULL,
    NULL,
    'ACTIVE',
    CURRENT_TIMESTAMP(),
    CURRENT_TIMESTAMP()
); 