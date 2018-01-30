#include "../config.h"
#include "Tests_All.hpp"

#include "Test_memchr16.hpp"
#include "Test_StringCreation.hpp"
#include "Test_RunningAFile.hpp"
#include "Test_FileCreation.hpp"
#include "Test_Engine.hpp"
#include "Test_dialogs.hpp"

#include "../ESTK_N/Logger.hpp"

namespace ESTK_N {

bool test_all() {

  bool retVal = true;
  
#if ! STARTUP_TESTS_ENABLED

  Logger::logNote("test_all: STARTUP_TESTS_ENABLED is off. No tests are being run");
  
#else

  retVal = test_memchr16() || retVal;
  retVal = test_stringCreation() || retVal;
  retVal = test_runningAFile() || retVal;
  //retVal = test_creatingAFile() || retVal;
  retVal = test_engineInteraction() || retVal;
  //retVal = test_dialogs() || retVal;
  
#endif

  return retVal;
  
}

}
