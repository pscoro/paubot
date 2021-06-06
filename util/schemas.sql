CREATE DATABASE customer_193684_paubotmain;

CREATE TABLE users (
    userId VARCHAR(100) NOT NULL PRIMARY KEY,
    energy INT NOT NULL,
    collectedDaily INT NOT NULL,
    collectedWeekly INT NOT NULL
);

CREATE TABLE worlds (
    guildId VARCHAR(100) NOT NULL PRIMARY KEY,
    worldName VARCHAR(100) NOT NULL,
    worldDesc TEXT NOT NULL
);

CREATE TABLE facets (
    facetId VARCHAR(100) NOT NULL PRIMARY KEY,
    facetAuthor VARCHAR(100) NOT NULL,
    facetType VARCHAR(100) NOT NULL,
    facetName VARCHAR(100) NOT NULL,
    facetTags TEXT,
    facetDesc TEXT,
    facetLinks TEXT,
    facetMedia TEXT
);

CREATE TABLE bans (
    userId VARCHAR(100) NOT NULL PRIMARY KEY,
    banUntil INT NOT NULL,
    banDesc TEXT
);