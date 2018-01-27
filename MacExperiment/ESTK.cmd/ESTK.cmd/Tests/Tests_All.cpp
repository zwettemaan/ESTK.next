#include "Tests_All.hpp"

#include "Test_memchr16.hpp"
#include "Test_StringCreation.hpp"
#include "Test_RunningAFile.hpp"
#include "Test_FileCreation.hpp"

namespace ESTK_N {

bool test_all() {

  bool retVal = true;
  
  retVal = test_memchr16() || retVal;
  retVal = test_stringCreation() || retVal;
  retVal = test_runningAFile() || retVal;
  retVal = test_creatingAFile() || retVal;

  return retVal;
  
}

}
