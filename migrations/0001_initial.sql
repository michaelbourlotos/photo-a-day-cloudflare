-- D1 Database Schema for Photo A Day
-- This creates the photos table with the same structure as the original MySQL database

CREATE TABLE IF NOT EXISTS photos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    datePhotos TEXT NOT NULL,
    fileFullNamePhotos TEXT NOT NULL,
    orderPhotos INTEGER NOT NULL,
    titlePhotos TEXT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_datePhotos ON photos(datePhotos DESC);
CREATE INDEX IF NOT EXISTS idx_orderPhotos ON photos(orderPhotos);
