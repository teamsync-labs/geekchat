import pytest

from core.program_codes import LogLevel
from log_system.log_entities import SystemLoggingEntity


@pytest.mark.asyncio
async def test_create_log_line_valid_args(caplog):
    logger = SystemLoggingEntity()

    test_code = 'CODE_1001'
    test_level = LogLevel.INFO
    test_description = 'APP_START'

    with caplog.at_level('INFO'):
        await logger.create_log_line(
            test_code,
            test_level,
            test_description,
        )

    assert len(caplog.records) == 1

    log_record = caplog.records[0]
    expected_message = (
        f'{test_code} - {test_level} - {test_description} '
        f'- web_code: not required'
    )

    assert log_record.message == expected_message
    assert log_record.levelname == LogLevel.INFO
