DROP DATABASE IF EXISTS FruityDance;
CREATE DATABASE FruityDance;
USE FruityDance;

CREATE TABLE POST(
ID INTEGER PRIMARY KEY,
TITLE CHAR(20),
UPLOADED DATE
); 

CREATE TABLE IMAGE(
ID INTEGER PRIMARY KEY,
SRC VARCHAR(120),
FOREIGN KEY (ID) REFERENCES POST(ID)
);

CREATE TABLE FRAME(
IMAGE VARCHAR(120) PRIMARY KEY,
X INTEGER(1),
Y INTEGER(1),
SRC VARCHAR(120),
FOREIGN KEY (IMAGE) REFERENCES IMAGE(SRC)
);