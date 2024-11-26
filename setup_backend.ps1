# Passo 1: Criação da virtual environment
Write-Host "Criando virtual environment..."
Set-Location -Path backend
python -m venv venv

# Passo 2: Ativar a venv
Write-Host "Ativando virtual environment..."
.\venv\Scripts\Activate

# Passo 3: Instalar dependências do back-end
Write-Host "Instalando dependências do back-end..."
pip install -r requirements.txt

Write-Host "Ativando back"
py .\app\main.py 

