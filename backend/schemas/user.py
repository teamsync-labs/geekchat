from pydantic import BaseModel, ConfigDict


class UserCreate(BaseModel):
    username: str
    password: str

class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    user_id: int
    user_name: str