#include "Logger.hpp"
#include <iostream>
#include "Utils.hpp"

namespace ESTK_N {

LogLevel Logger::fLogLevel = Error;

void Logger::logMessage(const cstr& msg, MessageWrap messageWrap) {
  if (messageWrap == eWithEOL || messageWrap == eWithLevelPrefixAndEOL) {
    std::cerr << msg << "\n";
  }
  else {
    std::cerr << msg;
  }
}

void Logger::logMessage(const std::u16string& msg, MessageWrap messageWrap) {
  std::string msgWrapper = u16string_to_utf8(msg);
  Logger::logMessage(msgWrapper, messageWrap);
}

void Logger::logMessage(const std::string& msg, MessageWrap messageWrap) {
  if (messageWrap == eWithEOL || messageWrap == eWithLevelPrefixAndEOL) {
    std::cerr << msg << "\n";
  }
  else {
    std::cerr << msg;
  }
}


}
