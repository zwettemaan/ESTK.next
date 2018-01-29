#include "Test_FileCreation.hpp"

#include "../ScCore/String.hpp"
#include "../ScScript/Engine.hpp"
#include "../ESTK_N/Logger.hpp"
#include "../ESTK_N/CocoaUtilsWrapper.hpp"

namespace ESTK_N {

bool test_engineInteraction() {

  bool retVal = false;

  do {
  
    try {
    
      ScScript::Engine& e(ScScript::Engine::createEngine(ScScript::Engine::DunnoYet));

      Logger::note("test_engineInteraction: Initial Engine Name: '", LogMessageStart);
      Logger::note(e.getName(), LogMessageContinued);
      Logger::note("'", LogMessageLineEnd);
      
      const ScCore::String newEngineName("myEngine");
      e.setName(newEngineName);
      
      Logger::note("test_engineInteraction: New Engine Name: '", LogMessageStart);
      Logger::note(e.getName(), LogMessageContinued);
      Logger::note("'", LogMessageLineEnd);
      
      if (e.getName() == newEngineName) {
        Logger::note("test_engineInteraction: Correct engine name");
      }
      else {
        Logger::error("test_engineInteraction: Wrong engine name");
        break;
      }
      
      //
      // returns nullptr
      //
      ScScript::Engine* eCurrent(ScScript::Engine::getCurrent());

      retVal = true;
      Logger::note("test_engineInteraction: succeeded");

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

