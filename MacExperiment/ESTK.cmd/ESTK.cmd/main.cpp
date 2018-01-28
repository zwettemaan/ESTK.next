#include <iostream>

#include "ScCore/InitTerm.hpp"
#include "ScCore/Utils.h"

#include "ScScript/InitTerm.hpp"

#include "ESTK_N/Logger.hpp"

#include "Tests/Tests_All.hpp"

#include "ScScript/Engine.hpp"
#include "ScScript/ParserAPI.hpp"
#include "ScCore/String.hpp"
#include "ScCore/FileSpec.hpp"
#include "ScCore/File.hpp"
#include "ScCore/CocoaUtils.hpp"
#include "ESTK_N/CocoaUtilsWrapper.hpp"

#include <CoreFoundation/CoreFoundation.h>
#include <objc/objc.h>
#include <objc/objc-runtime.h>

void exitFunc() {
	ESTK_N::Logger::logNote("exitFunc called");
}

int main(int argc, const char * argv[]) {
  // insert code here...
  
  ScCore::InitTerm::init();
  ScCore::InitTerm::atExit(exitFunc);
  
  ScScript::InitTerm::init();
  ScScript::InitTerm::atExit(exitFunc);
  
  bool testOK = ESTK_N::test_all();
  if (! testOK) {
    ESTK_N::Logger::logError("main: some startup tests failed");
  }
  
  ESTK_N::Logger::logMessage("ESTK.cmd started");
  
  const ScScript::Engine& e(ScScript::Engine::createEngine(ScScript::Engine::Default));
  const ScCore::String& engineName(e.getName());
  std::u16string u16EngineName;
  ESTK_N::scCoreString_to_u16string(u16EngineName, engineName, false);
  
  ESTK_N::Logger::logMessage("Engine Name: '", Continued);
  ESTK_N::Logger::logMessage(u16EngineName, Continued);
  ESTK_N::Logger::logMessage("'");
  
  ScScript::InitTerm::exit();
  ScCore::InitTerm::exit();
  
  return 0;
}
