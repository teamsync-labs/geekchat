# 'program_codes.py' - глобальные ошибки приложения.

class UserState:
    CODE_5001 = 'USER_ALREADY_EXISTS'
    CODE_5002 = 'NOT_ROOM_OWNER'


class RoomState:
    CODE_9001 = 'ROOM_NOT_FOUND'
    CODE_9002 = 'ROOM_INACTIVE'
    CODE_9003 = 'ROOM_TIME_EXPIRED'
    CODE_9004 = 'ROOM_IS_BUSY'


class WebsocketState:
    CODE_7001 = 'SESSIONS_LIMIT'
    CODE_7002 = 'CONNECTION_DENIED'
    CODE_7003 = 'PEER_IS_NOT_CONNECTED_YET'
