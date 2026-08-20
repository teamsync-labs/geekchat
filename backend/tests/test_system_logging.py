import pytest
from core.program_codes import LogLevel, SystemState
from log_system.log_entities import SystemLoggingEntity


@pytest.mark.asyncio
async def test_create_log_line_valid_args(caplog):
    logger = SystemLoggingEntity()
    with caplog.at_level('INFO'):
        await logger.create_log_line(
            SystemState.CODE_1003,
            LogLevel.INFO
        )
    assert len(caplog.records) == 1
    assert caplog.messages[0] == "DB_INIT - INFO - None - web_code: not required"

