from fastapi import FastAPI

from api.models.user import UserBase
from api.models.tasks import TaskBase
from api.database.db import engine
from api.routes import auth, tasks, manager, users

app = FastAPI(
    title="Mek's Task Manager API",
    description="An API for managing tasks for users",
    version="1.0.0"
)

UserBase.metadata.create_all(bind=engine)
TaskBase.metadata.create_all(bind=engine)


@app.get("/health", status_code=200)
def check_health():
    """
    Health check endpoint to confirm that the api is running.
    
    Returns:
    - A JSON response indiciating the health status of the api.
    """

    return { 'status': 'healthy' }


app.include_router(auth.router)
app.include_router(tasks.router)
app.include_router(manager.router)
app.include_router(users.router)
