# 'auth.py' - схемы запросов и ответов, относящиеся к пользователю.
from pydantic import BaseModel, Field, ConfigDict, EmailStr

# Проверить какие будут ошибки при валидации !!!
class UserRegister(BaseModel):
    username: str = Field(..., min_length=2, max_length=30)
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=50)      # 422 Unprocessable Entity


class UserLogin(BaseModel):
    username: str
    password: str


class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    user_id: int
    user_name: str
    email: str


class UserWithToken(BaseModel):
    user: UserResponse
    access_token: str
    token_type: str = 'bearer'

'''
class Token(BaseModel):
    access_token: str
    token_type: str = 'bearer'
    expires_in: int
'''