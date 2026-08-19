from log_system.base_logging_entity import BaseLoggingEntity


class SystemLoggingEntity(BaseLoggingEntity):
    def get_current_entity(self):
        return 'SYSTEM_LOGGER'
