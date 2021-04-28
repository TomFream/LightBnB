-- users seeds
INSERT INTO users (name, email, password) 
VALUES ('Tom', 'tom@lighthouse.ca', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Norm', 'tomscat@meow.ca', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Brooks', 'tomsroomate@nerd.ca', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

-- properties seeds
INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code, active)
VALUES (1, 'speed lamp', 'description', 'https://img', 'http://img', 900.50, 6, 4, 8, 'Canada', '123 lighthouse rd', 'Calgary', 'Alberta', 'T6J 0N7', true),
(2, 'Blank Corner', 'description', 'https://img', 'http://img', 850.50, 4, 2, 7, 'Canada', '100 test ave', 'Calgary', 'Alberta', 'T6J 3N2', true),
(3, 'Habit mix', 'description', 'https://img', 'http://img', 400.30, 5, 1, 12, 'Canada', '10 Cloverfeild Ln', 'Calgary', 'Alberta', 'T6J 5N6', true);

-- -- reservations seeds
INSERT INTO reservations (start_date, end_date, property_id, guest_id)
VALUES ('2018-09-11', '2018-09-26', 2, 3),
('2019-01-04', '2019-02-01', 2, 2),
('2021-10-01', '2021-10-14', 1, 1);

-- property_reviews seeds
INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message)
VALUES (1, 2, 1, 3, 'message'),
(2, 2, 1, 4, 'message'),
(3, 1, 1, 5, 'message');