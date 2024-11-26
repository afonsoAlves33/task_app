from db.database import DATABASE_URL, engine
from sqlalchemy.exc import OperationalError
from sqlalchemy.sql import text  # Importa o método text para comandos SQL brutos


def main():
    try:
        # Abre uma conexão com o banco
        with engine.connect() as connection:
            # Executa o comando de criação do banco
            connection.execute(text("CREATE DATABASE IF NOT EXISTS task_app;"))
            print("Banco de dados criado com sucesso!")
    except OperationalError as e:
        print("Erro de conexão ou ao executar o comando SQL:", e)
    except Exception as e:
        print(f"Erro inesperado: {e}")

def main2():
    try:
        # Abre uma conexão com o banco
        with engine.connect() as connection:
            # Executa o comando de criação do banco
            connection.execute(text("DELETE FROM tasks as t WHERE t.id = 3;"))
            print("Banco de dados criado com sucesso!")
    except OperationalError as e:
        print("Erro de conexão ou ao executar o comando SQL:", e)
    except Exception as e:
        print(f"Erro inesperado: {e}")