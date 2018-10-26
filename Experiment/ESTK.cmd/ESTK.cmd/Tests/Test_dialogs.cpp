#include "Test_dialogs.hpp"

#include "../ScCore/Dialogs.hpp"
#include "../ScCore/String.hpp"
#include "../ESTK_N/Logger.hpp"

namespace ESTK_N {

bool test_dialogs() {

  bool retVal = false;

  do {
  
    try {  

      ScCore::Dialogs::alert(ScCore::String("hello"));
      ScCore::Dialogs::alert(ScCore::String("hello"), ScCore::String("hello2"));
      ScCore::Dialogs::alert(ScCore::String("hello"), ScCore::String("hello3"), true);
      //int color = ScCore::Dialogs::colorPicker(0x112233);
      bool result = ScCore::Dialogs::confirm(ScCore::String("confirm?"), true);
      if (result) {
        Logger::note("test_dialogs: clicked yes");
      }
      else {
        Logger::note("test_dialogs: clicked no");
      }
    
      Logger::note("test_dialogs: succeeded");
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
