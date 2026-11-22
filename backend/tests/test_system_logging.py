from core.program_codes import LogLevel, SystemState
from log_system.logger_entities import SystemLoggerEntity
import logging


def test_create_log_line_valid_args(caplog, tmp_path, monkeypatch):
    monkeypatch.chdir(tmp_path)

    logger = SystemLoggerEntity()
    with caplog.at_level(logging.INFO):
        logger.create_log_line(
            SystemState.CODE_1003,
            LogLevel.INFO,
        )

    assert len(caplog.records) == 1
    assert caplog.messages[0] == 'DB_INIT - INFO - none - web_code: none'
