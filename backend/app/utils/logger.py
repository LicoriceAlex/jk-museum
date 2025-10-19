from loguru import logger as loguru_logger


class Logger:
    def __init__(self):
        self.logger = loguru_logger

    def info(self, message: str):
        self.logger.info(message)

    def error(self, message: str):
        self.logger.error(message)

    def debug(self, message: str):
        self.logger.debug(message)


logger = Logger()
