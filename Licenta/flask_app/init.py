import sqlite3

connection = sqlite3.connect('database.db')

with open('schema.sql') as f:
    connection.executescript(f.read())
    current = connection.cursor()
    # current.execute("INSERT INTO posts (title, content) VALUES (?, ?)", ('Water', 3))
    # current.execute("INSERT INTO posts (title, content) VALUES (?, ?)", ('Coffee', 20))
    # current.execute("INSERT INTO posts (title, content) VALUES (?, ?)", ('Bread', 8))
    # current.execute("INSERT INTO posts (title, content) VALUES (?, ?)", ('Chocolate', 5))

connection.commit()
connection.close()
