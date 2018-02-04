#ifndef __ESTK_N_Logger__
#define __ESTK_N_Logger__

#include <string>

//
// Readable wrapper name for message
//
// e.g.
//   Logger::message("message ", Continued);
//   Logger::message("continues", Continued);
//   Logger::message("on and on ", Continued);
//   Logger::message("and ends here");
//

#define Continued           ESTK_N::Logger::eRawMessage
#define LineEnd             ESTK_N::Logger::eWithEOL

//
// Readable wrapper names for LogFatal, LogError,...
//
// e.g.
//   Logger::LogNote("message ",      LogMessageStart);
//   Logger::LogNote("continues ",    LogMessageContinued);
//   Logger::LogNote("on and on ",    LogMessageContinued);
//   Logger::LogNote("and ends here", LogMessageLineEnd);
//
#define LogMessageStart     ESTK_N::Logger::eWithLevelPrefix
#define LogMessageContinued ESTK_N::Logger::eRawMessage
#define LogMessageLineEnd   ESTK_N::Logger::eWithEOL
#define LogMessage          ESTK_N::Logger::eWithLevelPrefixAndEOL

namespace ScCore {
  class String;
}

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

public:

  enum MessageWrap {
    eRawMessage,
    eWithEOL,
    eWithLevelPrefix,
    eWithLevelPrefixAndEOL
  };
  
private:

  static LogLevel fLogLevel;
  
  template<typename T>
  static void logMessage(LogLevel level, const MessageWrap messageWrap, T msg) {
  
    if (level == Off || level > fLogLevel) {
      return;
    }
    
    if (messageWrap == eWithLevelPrefix || messageWrap == eWithLevelPrefixAndEOL) {
      switch (level) {
      default:
          break;
      case Fatal:
          message("FATAL: ", Continued);
          break;
      case Error:
          message("ERROR: ", Continued);
          break;
      case Warn:
          message("WARN : ", Continued);
          break;
      case Note:
          message("NOTE : ", Continued);
          break;
      case Trace:
          message("TRACE: ", Continued);
          break;
      }
    }
    
    message(msg, messageWrap);
  };

public:

  static void setLogLevel(LogLevel in_logLevel) {
    fLogLevel = in_logLevel;
  }
  
  static LogLevel getLogLevel() {
    return fLogLevel;
  }
  
  typedef const char* cstr;
  
  // Use messageWrap = Continued to suppress new line
  static void message(const cstr& msg, const MessageWrap messageWrap = eWithEOL);
  static void message(const std::string& msg, const MessageWrap messageWrap = eWithEOL);
  static void message(const std::u16string& msg, const MessageWrap messageWrap = eWithEOL);
  static void message(const ScCore::String& msg, const MessageWrap messageWrap = eWithEOL);
  static void message(const ScCore::String* msg, const MessageWrap messageWrap = eWithEOL);

  template<typename T>
  static void fatal(T msg, const MessageWrap messageWrap = eWithLevelPrefixAndEOL) {
      logMessage(Fatal, messageWrap, msg);
  };

  template<typename T>
  static void error(T msg, const MessageWrap messageWrap = eWithLevelPrefixAndEOL) {
      logMessage(Error, messageWrap, msg);
  };

  template<typename T>
  static void warn(T msg, const MessageWrap messageWrap = eWithLevelPrefixAndEOL) {
      logMessage(Warn, messageWrap, msg);
  };

  template<typename T>
  static void note(T msg, const MessageWrap messageWrap = eWithLevelPrefixAndEOL) {
      logMessage(Note, messageWrap, msg);
  };

  template<typename T>
  static void trace(T msg, const MessageWrap messageWrap = eWithLevelPrefixAndEOL) {
      logMessage(Trace, messageWrap, msg);
  };
};

}
#endif
