from pydantic import BaseModel, Field, ConfigDict, EmailStr

# Проверить какие будут ошибки при валидации !!!
class UserCreate(BaseModel):
    username: str = Field(min_length=2, max_length=30)
    password: str = Field(min_length=8, max_length=20)
    email: EmailStr


class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    user_id: int
    user_name: str
    email: str