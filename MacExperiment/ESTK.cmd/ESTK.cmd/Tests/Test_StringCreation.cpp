#include "Test_memchr16.hpp"

#include "../ESTK_N/Utils.hpp"
#include "../ESTK_N/Logger.hpp"
#include "../ScCore/String.hpp"

namespace ESTK_N {

bool test_stringCreation() {

  bool retVal = false;

  do {
  
    try {
      ScCore::String* s = new ScCore::String("Hello");
      size_t l = s->find("lo",0,false);
      if (l != 3) {
        ESTK_N::Logger::logError("test_memchr16: failed. Position should be 3");
        break;
      }
    }
    catch (...) {
        ESTK_N::Logger::logError("test_stringCreation: failed. Throws an exception");
        break;
    }
  }
  while (false);
  
  return retVal;
}

}
