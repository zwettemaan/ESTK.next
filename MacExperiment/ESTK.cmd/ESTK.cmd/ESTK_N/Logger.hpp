#ifndef __ESTK_N_Logger__
#define __ESTK_N_Logger__

#include <string>

#define Continued ESTK_N::Logger::eRawMessage

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

  enum MessageWrap {
    eRawMessage,
    eWithEOL,
    eWithLevelPrefix,
    eWithLevelPrefixAndEOL
  };
  
  static void setLogLevel(LogLevel in_logLevel) {
    fLogLevel = in_logLevel;
  }
  
  static LogLevel getLogLevel() {
    return fLogLevel;
  }
  
  typedef const char* cstr;
  
  // Use 'Continued' to suppress new line
  static void logMessage(const cstr& msg, MessageWrap messageWrap = eWithEOL);
  static void logMessage(const std::string& msg, MessageWrap messageWrap = eWithEOL);
  static void logMessage(const std::u16string& msg, MessageWrap messageWrap = eWithEOL);
  
  template<typename T>
  static void logMessage(LogLevel level, T msg, MessageWrap messageWrap = eWithLevelPrefixAndEOL) {
  
    if (level == Off || level > fLogLevel) {
      return;
    }
    
    if (messageWrap == eWithLevelPrefix || messageWrap == eWithLevelPrefixAndEOL) {
      switch (level) {
      default:
          break;
      case Fatal:
          logMessage("FATAL: ", messageWrap);
          break;
      case Error:
          logMessage("ERROR: ", messageWrap);
          break;
      case Warn:
          logMessage("WARN : ", messageWrap);
          break;
      case Note:
          logMessage("NOTE : ", messageWrap);
          break;
      case Trace:
          logMessage("TRACE: ", messageWrap);
          break;
      }
    }
  }
  
  template<typename T>
  static void logFatal(T msg, MessageWrap messageWrap = eWithLevelPrefixAndEOL) {
      logMessage(Fatal, msg);
  };

  template<typename T>
  static void logError(T msg, MessageWrap messageWrap = eWithLevelPrefixAndEOL) {
      logMessage(Error, msg);
  };

  template<typename T>
  static void logWarn(T msg, MessageWrap messageWrap = eWithLevelPrefixAndEOL) {
      logMessage(Warn, msg);
  };

  template<typename T>
  static void logNote(T msg, MessageWrap messageWrap = eWithLevelPrefixAndEOL) {
      logMessage(Note, msg);
  };

  template<typename T>
  static void logTrace(T msg, MessageWrap messageWrap = eWithLevelPrefixAndEOL) {
      logMessage(Trace, msg);
  };
};

}
#endif
