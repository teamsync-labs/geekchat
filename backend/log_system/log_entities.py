from log_system.base_logging import BaseLoggingEntity


class SystemLoggingEntity(BaseLoggingEntity):
    def get_current_entity(self):
        return 'SYSTEM_LOGGER'
    