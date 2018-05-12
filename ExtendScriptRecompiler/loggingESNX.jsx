if (typeof _ESNX_ == "undefined") {
	_ESNX_ = {};
}

if (! _ESNX_.logging) {
	_ESNX_.logging = {};
}

_ESNX_.logging.LOG_NONE = 0;
_ESNX_.logging.LOG_ERROR = 1;
_ESNX_.logging.LOG_WARNING = 2;
_ESNX_.logging.LOG_NOTE = 3;
_ESNX_.logging.LOG_TRACE = 4;

_ESNX_.logging.logLevel = _ESNX_.logging.LOG_WARNING;

_ESNX_.logging.LOG_TO_ESTK = false;

// Comment out or set string to empty to disable
_ESNX_.logging.LOG_TO_FILE_PATH = "~/Desktop/_ESNX_.log.txt";

_ESNX_.logging.setLogLevel = function(level) { 
	_ESNX_.logging.logLevel = level;
}

_ESNX_.logging.getLogLevel = function() {
	return _ESNX_.logging.logLevel;
}

_ESNX_.logging.message = function(msg) {
	if (_ESNX_.logging.LOG_TO_ESTK) {
		$.writeln(msg);
	}
	if (_ESNX_.logging.LOG_TO_FILE_PATH) {
		try {
			var f = File(_ESNX_.logging.LOG_TO_FILE_PATH);
			f.encoding = "UTF-8";
			f.open("a");
			f.writeln(msg);
			f.close();
		}
		catch (err) {
		}
	}
}

_ESNX_.logging.logMessage = function(logLevel, msg) {

	do {

		if (_ESNX_.logging.logLevel < logLevel) {
			break;
		}

		switch (logLevel) {
			case _ESNX_.logging.LOG_ERROR:
				msg = "ERROR: " + msg;
				break;
			case _ESNX_.logging.LOG_WARNING:
				msg = "WARN : " + msg;
				break;
			case _ESNX_.logging.LOG_NOTE:
				msg = "NOTE : " + msg;
				break;
			case _ESNX_.logging.LOG_TRACE:
				msg = "TRACE: " + msg;
				break;
		}

		_ESNX_.logging.message(msg);
		_ESNX_.job.addLogEntryToJobTicket(msg);

	}
	while (false);

}

_ESNX_.logging.logError = function(msg) {
	_ESNX_.logging.logMessage(_ESNX_.logging.LOG_ERROR, msg);
}

_ESNX_.logging.logWarning = function(msg) {
	_ESNX_.logging.logMessage(_ESNX_.logging.LOG_WARNING, msg);
}

_ESNX_.logging.logNote = function(msg) {
	_ESNX_.logging.logMessage(_ESNX_.logging.LOG_NOTE, msg);
}

_ESNX_.logging.logTrace = function(msg) {
	_ESNX_.logging.logMessage(_ESNX_.logging.LOG_TRACE, msg);
}

