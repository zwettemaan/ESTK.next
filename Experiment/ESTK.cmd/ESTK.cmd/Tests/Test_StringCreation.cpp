#include "Test_memchr16.hpp"

#include "../ESTK_N/Utils.hpp"
#include "../ESTK_N/CocoaUtilsWrapper.hpp"
#include "../ESTK_N/Logger.hpp"
#include "../ScCore/String.hpp"

namespace ESTK_N {

bool test_stringCreation() {

  bool retVal = false;

  do {
  
    try {
      ScCore::String* s = new ScCore::String("Hello");
      size_t subStrPos = s->find("lo",0,false);
      if (subStrPos == 3) {
        Logger::trace("test_stringCreation: substring search works OK");
      }
      else {
        Logger::error("test_stringCreation: failed. Position should be 3");
        break;
      }
      
      std::string compareString;
      ESTK_N::scCoreString_to_utf8string(compareString, *s, false);
      if (compareString == "Hello") {
        Logger::trace("test_stringCreation: string roundtrip works OK");
      }
      else {
        Logger::error("test_stringCreation: failed. string should be 'Hello'");
        break;
      }
      
    }
    catch (...) {
        Logger::error("test_stringCreation: failed. Throws an exception");
        break;
    }
  }
  while (false);
  
  return retVal;
}

}
