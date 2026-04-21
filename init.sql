-- =====================================
-- EXTENSIONS
-- =====================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- =====================================
-- USERS
-- =====================================
-- Purpose: Lưu thông tin user cuối (end-user sử dụng app)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), -- unique user id
    email TEXT UNIQUE, -- login email
    phone TEXT, -- optional phone number
    password_hash TEXT, -- hashed password
    name TEXT, -- display name

    created_by TEXT, -- ai tạo (system/admin)
    created_date TIMESTAMP DEFAULT NOW(),
    last_modified_by TEXT,
    last_modified_date TIMESTAMP,
    status TEXT DEFAULT 'active' -- active | inactive | deleted
);

-- =====================================
-- USER DEVICES
-- =====================================
-- Purpose:
-- - Lưu danh sách device của user
-- - Dùng để gửi push notification (FCM/APNS)
-- - Track activity theo device (optional)

CREATE TABLE user_devices (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id), -- user sở hữu device

    token TEXT UNIQUE, 
    -- push notification token (FCM/APNS)
    -- mỗi device có 1 token duy nhất

    platform TEXT, 
    -- ios | android | web

    last_active_at TIMESTAMP, 
    -- lần cuối device gửi request (heartbeat)

    created_by TEXT,
    created_date TIMESTAMP DEFAULT NOW(),
    last_modified_by TEXT,
    last_modified_date TIMESTAMP,

    status TEXT DEFAULT 'active' 
    -- active | inactive (logout / uninstall)
);

-- query device theo user (send push)
CREATE INDEX idx_user_devices_user ON user_devices(user_id);

-- =====================================
-- PARTNERS
-- =====================================
-- Purpose: Đơn vị cung cấp event (business owner)
CREATE TABLE partners (
    id SERIAL PRIMARY KEY,
    name TEXT, -- tên business
    description TEXT,
    contact_email TEXT,
    contact_phone TEXT,

    created_by TEXT,
    created_date TIMESTAMP DEFAULT NOW(),
    last_modified_by TEXT,
    last_modified_date TIMESTAMP,
    status TEXT DEFAULT 'active' -- active | inactive
);

-- Purpose: User thuộc partner (CMS login)
CREATE TABLE partner_users (
    id SERIAL PRIMARY KEY,
    partner_id INT REFERENCES partners(id), -- thuộc partner nào
    email TEXT UNIQUE,
    password_hash TEXT,
    role TEXT, -- admin | staff

    created_by TEXT,
    created_date TIMESTAMP DEFAULT NOW(),
    last_modified_by TEXT,
    last_modified_date TIMESTAMP,
    status TEXT DEFAULT 'active'
);

-- =====================================
-- CATEGORIES
-- =====================================
-- Purpose: Phân loại event (food, workshop, music...)
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name TEXT,
    slug TEXT UNIQUE,
    parent_id INT, -- support tree structure
    priority INT DEFAULT 0, -- dùng cho ranking

    created_by TEXT,
    created_date TIMESTAMP DEFAULT NOW(),
    last_modified_by TEXT,
    last_modified_date TIMESTAMP,
    status TEXT DEFAULT 'active'
);

-- =====================================
-- USER PREFERENCES
-- =====================================
-- Purpose:
-- - Lưu sở thích ban đầu của user (onboarding)
-- - Dùng cho recommendation engine (filter + ranking)

CREATE TABLE user_preferences (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE, 
    -- user

    category_id INT REFERENCES categories(id), 
    -- category user quan tâm (food, music, workshop...)

    created_by TEXT,
    created_date TIMESTAMP DEFAULT NOW(),
    last_modified_by TEXT,
    last_modified_date TIMESTAMP,

    status TEXT DEFAULT 'active',

    PRIMARY KEY (user_id, category_id) 
    -- đảm bảo 1 user không chọn trùng category
);

-- =====================================
-- LOCATIONS
-- =====================================
-- Purpose: Lưu location để query nearby (PostGIS)
CREATE TABLE locations (
    id SERIAL PRIMARY KEY,
    name TEXT,
    lat DOUBLE PRECISION,
    lng DOUBLE PRECISION,
    geom GEOGRAPHY(POINT, 4326), -- dùng cho geo query (radius search)
    address TEXT,
    place_id TEXT, -- todo Google Places

    created_by TEXT,
    created_date TIMESTAMP DEFAULT NOW(),
    last_modified_by TEXT,
    last_modified_date TIMESTAMP,
    status TEXT DEFAULT 'active'
);

CREATE INDEX idx_locations_geom ON locations USING GIST (geom);

-- =====================================
-- EVENTS
-- =====================================
-- Purpose: Core entity - trải nghiệm / activity
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    partner_id INT REFERENCES partners(id), -- owner event
    title TEXT,
    description TEXT,
    category_id INT REFERENCES categories(id),
    duration_minutes INT, -- thời lượng trải nghiệm

    status TEXT DEFAULT 'active', -- active | inactive | deleted
    approval_status TEXT DEFAULT 'pending', -- pending | approved | rejected (CMS moderation)

    primary_location_id INT REFERENCES locations(id),
    created_by TEXT,
    created_date TIMESTAMP DEFAULT NOW(),
    last_modified_by TEXT,
    last_modified_date TIMESTAMP
);

CREATE INDEX idx_events_search ON events USING GIN (title gin_trgm_ops, description gin_trgm_ops);


-- =====================================
-- EVENTS
-- =====================================
-- Purpose: Core entity - trải nghiệm / activity (dạng hành trình)
CREATE TABLE event_itineraries (
    id SERIAL PRIMARY KEY,
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,

    location_id INT REFERENCES locations(id),

    step_order INT, -- thứ tự (1,2,3,...)
    title TEXT, -- "Check-in Hồ Gươm"
    description TEXT,

    start_offset_minutes INT, 
    -- phút thứ bao nhiêu trong event (timeline)

    duration_minutes INT, -- ở lại bao lâu
    type TEXT, -- stop | pass_by | meeting_point | end_point
    created_by TEXT,
    created_date TIMESTAMP DEFAULT NOW(),
    last_modified_by TEXT,
    last_modified_date TIMESTAMP
);

CREATE INDEX idx_itinerary_event ON event_itineraries(event_id);
CREATE UNIQUE INDEX idx_itinerary_order ON event_itineraries(event_id, step_order);

-- =====================================
-- EVENT SLOTS
-- =====================================
-- Purpose: Các khung giờ cụ thể của event
CREATE TABLE event_slots (
    id SERIAL PRIMARY KEY,
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    capacity INT, -- số lượng booking tối đa

    created_by TEXT,
    created_date TIMESTAMP DEFAULT NOW(),
    last_modified_by TEXT,
    last_modified_date TIMESTAMP,
    status TEXT DEFAULT 'active' -- active | inactive
);

CREATE INDEX idx_event_slots_time ON event_slots(start_time, end_time);

-- =====================================
-- EVENT PRICES
-- =====================================
-- Purpose: Giá vé (có thể nhiều loại: adult, child...)
CREATE TABLE event_prices (
    id SERIAL PRIMARY KEY,
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    name TEXT, -- tên loại vé
    price NUMERIC,
    currency TEXT,
    is_default BOOLEAN DEFAULT FALSE,

    created_by TEXT,
    created_date TIMESTAMP DEFAULT NOW(),
    last_modified_by TEXT,
    last_modified_date TIMESTAMP,
    status TEXT DEFAULT 'active'
);

-- =====================================
-- EVENT MEDIA
-- =====================================
-- Purpose:
-- - Lưu media (image/video) cho event
-- - Dùng cho event detail, list preview
-- - Support multiple media + ordering

CREATE TABLE event_media (
    id SERIAL PRIMARY KEY,

    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    -- event sở hữu media

    url TEXT NOT NULL,
    -- link media (CDN / S3)

    type TEXT,
    -- image | video | thumbnail (define ở code)

    sort_order INT DEFAULT 0,
    -- thứ tự hiển thị (0 = cover)

    is_cover BOOLEAN DEFAULT FALSE,
    -- đánh dấu ảnh cover (optional nhưng rất tiện)

    created_by TEXT,
    created_date TIMESTAMP DEFAULT NOW(),
    last_modified_by TEXT,
    last_modified_date TIMESTAMP
);

-- Query media theo event (event detail)
CREATE INDEX idx_event_media_event ON event_media(event_id);

-- Lấy cover nhanh
CREATE INDEX idx_event_media_cover ON event_media(event_id, is_cover);

-- =====================================
-- BOOKINGS
-- =====================================
-- Purpose: Record user đặt chỗ
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    event_id UUID REFERENCES events(id),
    partner_id INT REFERENCES partners(id),
    slot_id INT REFERENCES event_slots(id),

    total_price NUMERIC, -- tổng tiền user phải trả
    platform_fee NUMERIC, -- phí hệ thống (revenue)
    partner_earning NUMERIC, -- số tiền partner nhận

    booking_status TEXT, 
    -- pending: vừa tạo
    -- confirmed: đã thanh toán
    -- cancelled: user/system hủy
    -- completed: đã tham gia event
    -- expired: quá hạn chưa thanh toán

    payment_status TEXT, 
    -- pending: chưa thanh toán
    -- paid: đã thanh toán thành công
    -- failed: thanh toán lỗi
    -- refunded: đã hoàn tiền

    created_by TEXT,
    created_date TIMESTAMP DEFAULT NOW(),
    last_modified_by TEXT,
    last_modified_date TIMESTAMP
);

-- =====================================
-- BOOKING ITEMS
-- =====================================
-- Purpose: Chi tiết từng loại vé trong booking
CREATE TABLE booking_items (
    id SERIAL PRIMARY KEY,
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
    price_id INT REFERENCES event_prices(id),
    quantity INT,
    unit_price NUMERIC,
    total_price NUMERIC
);

-- =====================================
-- PAYMENT ORDERS
-- =====================================
-- Purpose: Đơn thanh toán (1 booking có thể có nhiều attempt)
CREATE TABLE payment_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES bookings(id),
    user_id UUID REFERENCES users(id),

    total_amount NUMERIC,
    currency TEXT,
    payment_method TEXT, 
    -- momo | vnpay | apple_pay | offline

    payment_status TEXT, 
    -- pending | paid | failed | refunded

    idempotency_key TEXT UNIQUE, -- chống double charge khi retry

    created_by TEXT,
    created_date TIMESTAMP DEFAULT NOW(),
    last_modified_by TEXT,
    last_modified_date TIMESTAMP
);

-- Purpose: Log giao tiếp với payment gateway
CREATE TABLE payment_transactions (
    id SERIAL PRIMARY KEY,
    payment_order_id UUID REFERENCES payment_orders(id),
    provider TEXT, -- momo / vnpay
    transaction_id TEXT, -- id từ provider

    request_payload JSONB, -- request gửi đi
    response_payload JSONB, -- response nhận về

    status TEXT, -- success | failed

    created_by TEXT,
    created_date TIMESTAMP DEFAULT NOW(),
    last_modified_by TEXT,
    last_modified_date TIMESTAMP
);

-- =====================================
-- LEDGER
-- =====================================
-- Purpose: Sổ cái tiền - SOURCE OF TRUTH cho mọi dòng tiền
CREATE TABLE ledger_entries (
    id SERIAL PRIMARY KEY,
    booking_id UUID,
    user_id UUID,
    partner_id INT,

    type TEXT, 
    -- payment: user trả tiền vào system
    -- fee: hệ thống giữ lại
    -- payout: trả tiền cho partner
    -- refund: hoàn tiền cho user

    amount NUMERIC, -- số tiền (có thể âm/dương)
    currency TEXT,

    reference_id TEXT, -- link tới payment / payout / refund
    metadata JSONB, -- mở rộng (debug, audit)

    created_by TEXT,
    created_date TIMESTAMP DEFAULT NOW(),
    last_modified_by TEXT,
    last_modified_date TIMESTAMP
);

-- =====================================
-- PAYOUTS
-- =====================================
-- Purpose: Batch trả tiền cho partner
CREATE TABLE payouts (
    id SERIAL PRIMARY KEY,
    partner_id INT REFERENCES partners(id),

    total_amount NUMERIC,

    payout_status TEXT, 
    -- pending: chưa xử lý
    -- processing: đang transfer
    -- paid: đã chuyển xong

    created_by TEXT,
    created_date TIMESTAMP DEFAULT NOW(),
    last_modified_by TEXT,
    last_modified_date TIMESTAMP
);

-- Purpose: Chi tiết payout theo từng booking
CREATE TABLE payout_items (
    id SERIAL PRIMARY KEY,
    payout_id INT REFERENCES payouts(id),
    booking_id UUID REFERENCES bookings(id),

    amount NUMERIC -- số tiền tương ứng booking
);

-- =====================================
-- REFUNDS
-- =====================================
-- Purpose: Quản lý hoàn tiền
CREATE TABLE refunds (
    id SERIAL PRIMARY KEY,
    booking_id UUID,
    payment_order_id UUID,

    amount NUMERIC,
    reason TEXT,
    status TEXT, -- pending | success | failed

    created_by TEXT,
    created_date TIMESTAMP DEFAULT NOW(),
    last_modified_by TEXT,
    last_modified_date TIMESTAMP
);

-- =====================================
-- REVIEWS
-- =====================================
-- Purpose: User reviews
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    event_id UUID REFERENCES events(id),

    rating INT,
    comment TEXT,

    created_by TEXT,
    created_date TIMESTAMP DEFAULT NOW(),
    last_modified_by TEXT,
    last_modified_date TIMESTAMP
);

-- =====================================
-- NOTIFICATIONS
-- =====================================
-- Purpose: Push notification
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id UUID,

    title TEXT,
    body TEXT,
    type TEXT, -- system | marketing | reminder
    is_read BOOLEAN DEFAULT FALSE,

    created_by TEXT,
    created_date TIMESTAMP DEFAULT NOW(),
    last_modified_by TEXT,
    last_modified_date TIMESTAMP
);

-- =====================================
-- BEHAVIOR LOGS
-- =====================================
-- Purpose:
-- - Log toàn bộ hành vi user trong app
-- - Dùng cho:
--   + analytics (funnel, conversion)
--   + recommendation engine
--   + debug user journey

CREATE TABLE behavior_logs (
    id SERIAL PRIMARY KEY,

    user_id UUID, 
    -- user thực hiện hành vi

    event_id UUID, 
    -- event liên quan (nullable nếu action global)

    action TEXT, 
    -- view | click | booking | cancel | search ...

    metadata JSONB, 
    -- dữ liệu bổ sung:
    -- ví dụ:
    -- { "source": "home", "device": "ios", "keyword": "coffee" }

    created_by TEXT,
    created_date TIMESTAMP DEFAULT NOW(),
    last_modified_by TEXT,
    last_modified_date TIMESTAMP
);

-- query history theo user
CREATE INDEX idx_behavior_user ON behavior_logs(user_id);

-- query analytics theo event
CREATE INDEX idx_behavior_event ON behavior_logs(event_id);
