-- Database setup for mantap.work landing page
-- This SQL file creates the database schema for a simple user management system
-- with JWT authentication (handled in the application) and Bcrypt password hashing.
-- It includes tables for users, admins, tutors, mentors, schools, merchants, books,
-- testimonials, and tools. Sample data is included to match the landing page content.

-- Create the database
CREATE DATABASE IF NOT EXISTS mantap_work_db;
USE mantap_work_db;

-- Table for users (registration/login)
-- Stores user information with bcrypt-hashed passwords.
-- Role can be 'user' or 'admin' for basic access control.
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,  -- Bcrypt hashed password
    name VARCHAR(255),
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table for admins (dashboard access)
-- Separate table for admin-specific data, linked to users table.
CREATE TABLE admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNIQUE NOT NULL,
    dashboard_access BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Table for tutors (profiles with images, ratings)
-- Stores tutor profiles for the Verified Tutor Network section.
CREATE TABLE tutors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    bio TEXT,
    rating DECIMAL(2,1) DEFAULT 0.0,
    image_url VARCHAR(500),
    verification_status ENUM('Verified', 'Unverified') DEFAULT 'Unverified',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for mentors (profiles with images, ratings)
-- Stores mentor profiles for the New Mentors section.
CREATE TABLE mentors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    bio TEXT,
    rating DECIMAL(2,1) DEFAULT 0.0,
    image_url VARCHAR(500),
    specialty VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for schools (directories with status)
-- Stores school profiles for the Schools Directory section.
CREATE TABLE schools (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    claimed_status ENUM('CLAIMED', 'UNCLAIMED') DEFAULT 'UNCLAIMED',
    rating DECIMAL(2,1) DEFAULT 0.0,
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for merchants (directories with status)
-- Stores merchant profiles for the Educational Merchants section.
CREATE TABLE merchants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    verified_status ENUM('VERIFIED', 'UNVERIFIED') DEFAULT 'UNVERIFIED',
    rating DECIMAL(2,1) DEFAULT 0.0,
    price DECIMAL(10,2),
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for books (library items)
-- Stores book profiles for the Authorized Educational Publishers section.
CREATE TABLE books (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    publisher VARCHAR(255),
    verified_status ENUM('VERIFIED', 'UNVERIFIED') DEFAULT 'UNVERIFIED',
    rating DECIMAL(2,1) DEFAULT 0.0,
    description TEXT,
    price DECIMAL(10,2),
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for testimonials
-- Stores testimonial content for the What Our Community Says section.
CREATE TABLE testimonials (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(255),
    content TEXT,
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for free tools
-- Stores tool information for the Free Micro-Apps section.
CREATE TABLE tools (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sample data for tutors
INSERT INTO tutors (name, bio, rating, image_url, verification_status) VALUES
('Ahmad Rahman', 'Experienced math tutor with 5+ years teaching SPM students.', 4.9, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d', 'Verified'),
('Siti Aminah', 'Science specialist helping students excel in Biology and Chemistry.', 4.8, 'https://images.unsplash.com/photo-1544005313-94ddf0286df2', 'Verified'),
('Raj Kumar', 'English literature expert with proven track record in IELTS prep.', 4.7, 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e', 'Verified');

-- Sample data for mentors
INSERT INTO mentors (name, bio, rating, image_url, specialty) VALUES
('Dr. Lim Wei', 'PhD in Physics, mentoring future scientists and engineers. Joined last week with 10+ years experience.', 5.0, 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e', 'STEM Education'),
('Pn. Noraini', 'Former school principal guiding language development.', 4.9, 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80', 'Language Arts Specialist'),
('En. Hassan', 'Helping students navigate educational and career paths.', 4.8, 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d', 'Career Counselor');

-- Sample data for schools
INSERT INTO schools (name, location, claimed_status, rating, image_url) VALUES
('SMK Taman Melati', 'Selangor', 'CLAIMED', 4.0, 'https://images.unsplash.com/photo-1509062522246-3755977927d7'),
('Sekolah Kebangsaan Putrajaya', 'Putrajaya', 'UNCLAIMED', 3.0, 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f'),
('SMK Sri Hartamas', 'Kuala Lumpur', 'CLAIMED', 5.0, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d');

-- Sample data for merchants
INSERT INTO merchants (name, description, verified_status, rating, price, image_url) VALUES
('School Uniform Set', 'Complete uniform package for primary and secondary students', 'VERIFIED', 4.7, 89.00, 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b'),
('Co-Curricular Sports Kit', 'Basketball, football, and badminton equipment', 'VERIFIED', 4.9, 120.00, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b'),
('School Shoes Collection', 'Comfortable and durable shoes for daily school wear', 'UNVERIFIED', 3.8, 65.00, 'https://images.unsplash.com/photo-1549298916-b41d501d3772');

-- Sample data for books
INSERT INTO books (title, publisher, verified_status, rating, description, price, image_url) VALUES
('Buku Kerja Matematik STD 3', 'Terbitan KiraBagus Publisher', 'VERIFIED', 4.9, 'Comprehensive mathematics exercises for Year 3 students, aligned with KSSR syllabus.', 25.00, 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570'),
('Pendidikan Moral STD 6', 'Dewan Bahasa dan Pustaka', 'VERIFIED', 4.7, 'Moral education textbook for Year 6, focusing on values and ethics.', 18.00, 'https://images.unsplash.com/photo-1532094349884-543bc11b234d'),
('Sains STD 5', 'Penerbitan Pelangi Sdn Bhd', 'VERIFIED', 4.8, 'Science textbook for Year 5 with experiments and activities.', 22.00, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d');

-- Sample data for testimonials
INSERT INTO testimonials (name, role, content, image_url) VALUES
('Mrs. Tan', 'Parent', '"mantap.work helped my daughter find an amazing math tutor. The verification process gave us peace of mind."', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2'),
('Ahmad', 'Verified Tutor', '"As a freelance tutor, the free tools and verification have boosted my credibility and income."', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde'),
('Principal Ng', 'School Admin', '"Claiming our school profile was easy, and now parents can find us effortlessly."', 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91');

-- Sample data for tools
INSERT INTO tools (name, description) VALUES
('Reunion Planner', 'Plan school reunions with ease. Invite alumni, track RSVPs, and organize events.'),
('Resume Creator', 'Build professional resumes tailored for education sector jobs.'),
('Uniform Guide', 'Access school uniform specifications and supplier information.'),
('Passport Editor', 'Resize and optimize photos for passport applications.');
