# 'users.py' - эндпоинты пользователей.
from fastapi import APIRouter, HTTPException, status, Depends
from api.deps.auth import get_current_user
from schemas.auth import UserRegister, UserWithToken, UserLogin, UserResponse
from api.deps.services import get_auth_service
from services.auth import AuthService
from core.security import JwtToken
from core.program_codes import UserState as us


router = APIRouter()

@router.post('/', response_model=UserWithToken, status_code=status.HTTP_201_CREATED)
async def register(data: UserRegister, service: AuthService = Depends(get_auth_service)):
    try:
        user = await service.register(data)
        print('User registered !!!')

        if user is not None:
            print('Creating token ... !!!')
            access_token = JwtToken.create_access_token(user.user_id)
            # create refresh
            print('Return JSON Response Userwithtoken !!!')
            return {
                'user': user,
                'access_token': access_token,
                # refresh
                'token_type': 'bearer'
            }

        else:
            print(f'Create user error')  # logging !!

            raise HTTPException(status_code=400, detail=us.CODE_5001)

    except Exception as e:   # what is Exception ???
        print(f'Create user critical error: {e}')

        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail='Create user error')

@router.post('/login', response_model=UserWithToken)
async def login(data: UserLogin, service: AuthService = Depends(get_auth_service)):
    try:
        user, access_token = await service.login_user(data)

        return {
            'user': user,
            'access_token': access_token,
            #"refresh_token": refresh_token,
            'token_type': 'bearer'
        }

    except ValueError as e:
        print(f'Entering error: {e}')

        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))

    except Exception as e:
        print(f'Entering critical error: {e}')

        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail='Entering error')

@router.get('/me', response_model=UserResponse)
async def get_me(current_user = Depends(get_current_user)):
    return current_user
