-- ZEROX Portfolio — Contact Form Schema
-- Import this into your MySQL database first, then configure db-config.php

CREATE DATABASE IF NOT EXISTS vyra_portfolio
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE vyra_portfolio;

CREATE TABLE IF NOT EXISTS messages (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    name       VARCHAR(120)  NOT NULL,
    email      VARCHAR(160)  NOT NULL,
    message    TEXT          NOT NULL,
    created_at DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;
