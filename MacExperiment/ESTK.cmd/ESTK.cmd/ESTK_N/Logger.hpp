#ifndef __ESTK_N_Logger__
#define __ESTK_N_Logger__

#include <string>

namespace ESTK_N {

enum LogLevel {
  Off,
  Fatal,
  Error,
  Warn,
  Note,
  Trace
};

class Logger {

  static LogLevel fLogLevel;
  
public:

  static void setLogLevel(LogLevel in_logLevel) {
    fLogLevel = in_logLevel;
  }
  
  static LogLevel getLogLevel() {
    return fLogLevel;
  }
  
  static void logMessage(LogLevel level, const char* msg);
  static void logMessage(LogLevel level, const std::string& msg);
  static void logFatal(const std::string& msg);
  static void logFatal(const char* msg);
  static void logError(const std::string& msg);
  static void logError(const char* msg);
  static void logWarn(const std::string& msg);
  static void logWarn(const char* msg);
  static void logNote(const std::string& msg);
  static void logNote(const char* msg);
  static void logTrace(const std::string& msg);
  static void logTrace(const char* msg);
};

}
#endif
