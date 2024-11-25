from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from pymysql.err import OperationalError
import os

DATABASE_URL = "mysql+pymysql://root:senai@localhost:3306/task_app"
DATABASE_URL_FOR_SQL_SERVER = "mssql+pyodbc://sfo9ca:1533SaNtOs1533*@JVL-C-0008R\SQLEXPRESS/teste?driver=ODBC+Driver+17+for+SQL+Server"
SQLITE_URL = "sqlite:///banco_de_dados.db"

try:
    engine = create_engine(SQLITE_URL)
except OperationalError as op:
    print("\n\n\n")
    print("Could not connect to the database, check if database's info are correct (name, port, etc.) or if you already created the database 'task_app' - Raised error: ")
    print("\n\n\n")
    raise op
    

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

