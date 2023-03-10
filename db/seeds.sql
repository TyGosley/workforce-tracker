INSERT INTO department (name)
VALUES 
('Agents'),
('Spies'),
('Consultants'),
('Heroes'),
('Avengers'),
('Directors');

INSERT INTO role (title, salary, department_id)
VALUES
('Agent', 85000, 1),
('Lead Agent', 100000, 1),
('Spy', 95999, 2),
('Consultant', 100000000, 3),
('Avenger', 35000, 5),
('Hero', 100, 4),
('Off-world Hero', 0, 4),
('Director', 250000, 6); 

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
('Nick', 'Fury', 8, NULL),
('Paul', 'Colson', 2, 1),
('Natasha', 'Romanoff', 3, 1),
('Tony', 'Stark', 4, 1),
('Bruce', 'Banner', 5, 1),
('Thor', 'Odinson', 5, 1),
('Clint', 'Barton', 3, 1),
('Steve', 'Rogers', 5, 1),
('Sam', 'Wilson', 6, 1),
('Bucky', 'Barnes', 6, 1),
('Steven', 'Strange', 6, 1),
('Peter', 'Parker', 5, 1),
('Wanda', 'Maximoff', 6, 1),
('Scott', 'Lang', 6, 1),
('Prince', 'TChalla', 6, 1),
('The', 'VISION', 6, 1),
('Peter', 'Quill', 7, NULL),
('Gamora', 'Zen', 7, NULL),
('Drax', 'Destroyer', 7, NULL),
('Rocket', 'Raccoon', 7, NULL),
('Iam', 'Groot', 7, NULL),
('Nebula', 'Peale', 7, NULL),
('Carol', 'Danvers', 7, 1);

