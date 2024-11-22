from fastapi import FastAPI, Depends, HTTPException,status
from db.database import get_db
from db.models import User as UserModel, Tasks as TasksModel
from db.schemas import UserCreate as UserCreateSchema, TaskCreate as TaskCreateSchema, UserGet as UserGetSchema, TaskBase as TaskSchema, Status
from db.build_db_script import main
from sqlalchemy.orm import Session 
from sqlalchemy.exc import IntegrityError
from typing import List
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()



app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permite requisições de qualquer origem (ajuste conforme necessário)
    allow_credentials=True,
    allow_methods=["*"],  # Permite todos os métodos (GET, POST, OPTIONS, etc.)
    allow_headers=["*"],  # Permite todos os cabeçalhos
)



@app.get("/")
def create_database():
    try:
        main()
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR ,detail="Could not construct database automatically")
    return {"msg": "success"}

@app.post("/users", status_code=status.HTTP_201_CREATED)
def create_user(user: UserCreateSchema, db: Session = Depends(get_db)):
    user_model = UserModel(
            username=user.username,
            email=user.email
        )
    try:
        db.add(user_model)
        db.commit()
    except IntegrityError:
        # This error occurs when the user try to create a person who already exists
        raise HTTPException(
                            detail="User with this email already exists", 
                            status_code=status.HTTP_400_BAD_REQUEST
                            )
    except Exception as e:

        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)
    return {
        "msg": "success"
    }


@app.post("/tasks", status_code=status.HTTP_201_CREATED)
def create_task(task: TaskCreateSchema, db: Session = Depends(get_db)):
    user = db.query(UserModel).filter(UserModel.id == task.user_id).one_or_none()
    
    if not user:
        raise HTTPException(
            detail="User with the provided ID does not exist.",
            status_code=status.HTTP_400_BAD_REQUEST
        )
    
    task_model = TasksModel(
        description=task.description,
        sector_name=task.sector_name,
        priority=task.priority,
        status=task.status,
        user_id=task.user_id
    )
    try:
        db.add(task_model)
        db.commit()
    except IntegrityError:
        raise HTTPException(
            detail="User with the provided ID does not exist or other integrity error.",
            status_code=status.HTTP_400_BAD_REQUEST
        )
    except Exception as e:
        print(e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)
    return {
        "msg": "success"
    }


@app.get("/users/{user_email}", status_code=status.HTTP_200_OK, response_model=UserGetSchema,)
def get_user(user_email: str, db: Session = Depends(get_db)):
    try:
        user = db.query(UserModel).filter(UserModel.email == user_email).one_or_none()
    except Exception as e:
        raise HTTPException(detail="Could not fetch user with that id", status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)
    return user


@app.get("/tasks/{user_id}", status_code=status.HTTP_200_OK)
def get_tasks(user_id: int, db: Session = Depends(get_db)):
    try:

        tasks = db.query(TasksModel).filter(TasksModel.user_id == user_id).all()

        tasks_response = [
            {
                "id": task.id,
                "description": task.description,
                "sector_name": task.sector_name,
                "priority": task.priority,
                "status": str(task.status),  
                "creation_time_stamp": task.creation_time_stamp,
                "user_id": task.user_id
                
            }
            for task in tasks
        ]

    except ValueError as ve:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Invalid status value: {ve}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An unexpected error occurred: {str(e)}"
        )

    return tasks_response
    
@app.get("/users", status_code=status.HTTP_200_OK)
def get_users(db: Session = Depends(get_db)):
    try:

        users = db.query(UserModel).all()

        users_resp = [
            {
                "username": user.id,
                "email": user.email
            }
            for user in users
        ]

    except ValueError as ve:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Invalid status value: {ve}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An unexpected error occurred: {str(e)}"
        )

    return users_resp









if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app="main:app", host="0.0.0.0", port=8000, reload=True)