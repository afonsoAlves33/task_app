from db.database import DATABASE_URL, engine
from sqlalchemy.exc import OperationalError


def main():
    try:
        with engine.connect() as connection:
            connection.execute("CREATE DATABASE IF NOT EXISTS task_app;")
            print("Banco de dados criado com sucesso!")
    except Exception as e:
        print(f"Erro ao criar o banco de dados: {e}")
