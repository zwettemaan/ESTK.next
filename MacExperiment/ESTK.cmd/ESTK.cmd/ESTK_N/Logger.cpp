#include "Logger.hpp"
#include <iostream>

namespace ESTK_N {

LogLevel Logger::fLogLevel = Error;

void Logger::logMessage(LogLevel level, const char* msg) {
  std::string msgWrapper(msg);
  logMessage(level, msgWrapper);
}

void Logger::logMessage(LogLevel level, const std::string& msg) {
  std::cerr << msg << "\n";
}

void Logger::logFatal(const std::string& msg) {
    logMessage(Fatal, msg);
}

void Logger::logFatal(const char* msg) {
    logMessage(Fatal, msg);
}

void Logger::logError(const std::string& msg) {
    logMessage(Error, msg);
}

void Logger::logError(const char* msg) {
    logMessage(Error, msg);
}

void Logger::logWarn(const std::string& msg) {
    logMessage(Warn, msg);
}

void Logger::logWarn(const char* msg) {
    logMessage(Warn, msg);
}

void Logger::logNote(const std::string& msg) {
    logMessage(Note, msg);
}

void Logger::logNote(const char* msg) {
    logMessage(Note, msg);
}

void Logger::logTrace(const std::string& msg) {
    logMessage(Trace, msg);
}

void Logger::logTrace(const char* msg) {
    logMessage(Trace, msg);
}

}
