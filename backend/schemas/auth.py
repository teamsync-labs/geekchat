# 'auth.py' - схемы запросов и ответов, относящиеся к пользователю.
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import Optional


# Проверить какие будут ошибки при валидации !!!
class UserRegister(BaseModel):
    username: str = Field(..., min_length=2, max_length=30)
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=50)      # 422 Unprocessable Entity


class UserLogin(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=50)


class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    user_id: int
    user_name: str
    email: str
    is_active: bool
    is_verified: bool
    created_at: datetime
    updated_at: datetime
    last_login: Optional[datetime] = None


class UserWithToken(BaseModel):
    user: UserResponse
    access_token: str
    token_type: str = 'bearer'


class TokenResponse(BaseModel):
    access_token: str
