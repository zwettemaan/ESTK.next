#include "Test_memchr16.hpp"

#include "../ESTK_N/Utils.hpp"
#include "../ESTK_N/Logger.hpp"
#include "../ScCore/Utils.h"

namespace ESTK_N {

bool test_memchr16() {

  bool retVal = false;

  do {
  
    try {
    
      std::u16string s1 = utf8_to_u16string(std::string("Hello"));
      
      const char16_t* s1Begin = s1.c_str();
      const char16_t* letterPtr = (const char16_t*) ScCore::memchr16(s1.c_str(), 'l', s1.length());
      long letterPos = letterPtr - s1Begin;
      
      if (letterPos != 2) {
        Logger::error("test_memchr16: failed. Position should be 2");
        break;
      }

      Logger::note("test_memchr16: succeeded");
      retVal = true;
    }
    catch (...) {
        Logger::error("test_memchr16: failed. Throws an exception");
        break;
    }
  }
  while (false);
  
  return retVal;
}

}
