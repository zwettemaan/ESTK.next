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
  
  std::cout << "ESTK.cmd started\n";
  
  const ScScript::Engine& e(ScScript::Engine::createEngine(ScScript::Engine::Default));
  const ScCore::String& engineName(e.getName());
  
  
  const ScCore::String s1("alert('x');");
  const ScCore::String s2("");
  
  ScScript::InitTerm::exit();
  ScCore::InitTerm::exit();
  
  return 0;
}
