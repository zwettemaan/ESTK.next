#include "loggingESNX.jsx"

function LOG_ERROR(msg) {
	_ESNX_.logging.logError(msg);
}

function LOG_WARNING(msg) {
	_ESNX_.logging.logWarning(msg);
}

function LOG_NOTE(msg) {
	_ESNX_.logging.logNote(msg);
}

function LOG_TRACE(msg) {
	_ESNX_.logging.logTrace(msg);
}