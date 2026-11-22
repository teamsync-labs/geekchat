# 'logger_entities.py' - сущности логгеров по обязанностям.
from log_system.base_logger_entity import BaseLoggerEntity


class SystemLoggerEntity(BaseLoggerEntity):
    def get_current_entity(self):
        return 'SYSTEM_LOGGER'


class UserLoggerEntity(BaseLoggerEntity):
    def get_current_entity(self):
        return 'USER_LOGGER'


system_logger = SystemLoggerEntity()
user_logger = UserLoggerEntity()
