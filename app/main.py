from fastapi import FastAPI, Depends, HTTPException,status
from app.db.database import get_db
from app.db.models import User as UserModel, Tasks as TasksModel
from app.db.schemas import UserCreate as UserCreateSchema, TaskCreate as TaskCreateSchema
from app.db.build_db_script
from sqlalchemy.orm import Session 
from sqlalchemy.exc import IntegrityError

app = FastAPI()


@app.get("/")
def create_database():
    return {"Hello": "World"}

@app.post("/user", status_code=status.HTTP_201_CREATED)
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
        print(e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)
    return {
        "msg": "success"
    }


@app.post("/task", status_code=status.HTTP_201_CREATED)
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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app="main:app", host="0.0.0.0", port=8000, reload=True)