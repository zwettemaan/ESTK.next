#include "Test_FileCreation.hpp"

#define TEST_FILE_PATH "~/Desktop/Test_FileCreation.txt"

#include "../ScCore/String.hpp"
#include "../ScCore/FileSpec.hpp"
#include "../ScCore/File.hpp"
#include "../ESTK_N/Logger.hpp"

namespace ESTK_N {

bool test_creatingAFile() {

  bool retVal = false;

  do {
  
    try {
    
      const ScCore::String s1("Some content for the file");
      const ScCore::String path(TEST_FILE_PATH);
      const ScCore::String mode("w");
      
    // This is all crashy.
      ScCore::FileSpec fs(path, false);
      
      ScCore::File* f = new ScCore::File(fs);
      
      f->open(mode, 0, 0);
      f->write(s1,false);
      f->close();

      Logger::trace("test_creatingAFile: there should now be a file at '", LogMessageStart);
      Logger::trace(TEST_FILE_PATH, LogMessageContinued);
      Logger::trace("'", LogMessageLineEnd);
      
      Logger::note("test_creatingAFile: succeeded");
      
      /*
      * This alternate form does not work:For some reason ScCore::File f(fs) causes a crash

      ScCore::File f(fs);
      
      f.open(mode, 0, 0);
      f.write(s1,false);
      f.close();


      */
    }
    catch (...) {
        Logger::error("test_creatingAFile: failed. Throws an exception");
        break;
    }
  }
  while (false);
  
  return retVal;
}

}

