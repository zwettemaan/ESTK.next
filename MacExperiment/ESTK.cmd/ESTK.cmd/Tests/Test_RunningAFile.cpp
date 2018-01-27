#include "Test_RunningAFile.hpp"

#include "../ESTK_N/Utils.hpp"
#include "../ESTK_N/Logger.hpp"
#include "../ScCore/String.hpp"
#include "../ScCore/FileSpec.hpp"
#include "../ScCore/File.hpp"

namespace ESTK_N {

#define TEST_APP_PATH "/Applications/Adobe InDesign CC 2018/Adobe Indesign CC 2018.app"

bool test_runningAFile() {

  bool retVal = false;

  do {
  
    try {
    
      ScCore::String* s = new ScCore::String(TEST_APP_PATH);
      if (s == nullptr) {
        ESTK_N::Logger::logError("test_runningAFile: failed. No String");
        break;
      }
      
      ScCore::FileSpec* fs = new ScCore::FileSpec(*s, false);
      if (fs == nullptr) {
        ESTK_N::Logger::logError("test_runningAFile: failed. No FileSpec");
        break;
      }
      
      ScCore::File* f = new ScCore::File(*fs);
      if (f == nullptr) {
        ESTK_N::Logger::logError("test_runningAFile: failed. No File");
        break;
      }

/*
      // This simply the same as double-clicking the file.
      if (! f->execute()) {
        ESTK_N::Logger::logError("test_runningAFile: failed to execute");
        break;
      }
*/
    }
    catch (...) {
        ESTK_N::Logger::logError("test_runningAFile: failed. Throws an exception");
        break;
    }
  }
  while (false);
  
  return retVal;
}

}

