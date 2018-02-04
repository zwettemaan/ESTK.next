#include "Logger.hpp"
#include <iostream>
#include "Utils.hpp"
#include "../ScCore/String.hpp"

#if MACINTOSH
#include "CocoaUtilsWrapper.hpp"
#endif

namespace ESTK_N {

LogLevel Logger::fLogLevel = Error;

void Logger::message(const cstr& msg, MessageWrap messageWrap) {
  if (messageWrap == eWithEOL || messageWrap == eWithLevelPrefixAndEOL) {
    std::cerr << msg << "\n";
  }
  else {
    std::cerr << msg;
  }
}

void Logger::message(const ScCore::String& msg, MessageWrap messageWrap) {
  std::string msgWrapper;
  scCoreString_to_utf8string(msgWrapper, msg, false);
  Logger::message(msgWrapper, messageWrap);
}

void Logger::message(const ScCore::String* msg, MessageWrap messageWrap) {
  std::string msgWrapper;
  scCoreString_to_utf8string(msgWrapper, *msg, false);
  Logger::message(msgWrapper, messageWrap);
}

void Logger::message(const std::u16string& msg, MessageWrap messageWrap) {
  std::string msgWrapper = u16string_to_utf8(msg);
  Logger::message(msgWrapper, messageWrap);
}

void Logger::message(const std::string& msg, MessageWrap messageWrap) {
  if (messageWrap == eWithEOL || messageWrap == eWithLevelPrefixAndEOL) {
    std::cerr << msg << "\n";
  }
  else {
    std::cerr << msg;
  }
}


}
