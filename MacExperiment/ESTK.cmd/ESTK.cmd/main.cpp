#include <iostream>

#include "config.h"
#include "ESTK_N/Logger.hpp"

#include "ScCore/InitTerm.hpp"
#include "ScCore/Utils.h"
#include "ScCore/String.hpp"
#include "ScCore/FileSpec.hpp"
#include "ScCore/File.hpp"
#include "ScCore/DebugAlert.hpp"

#include "ScScript/InitTerm.hpp"
#include "ScScript/Engine.hpp"
#include "ScScript/Script.hpp"
#include "ScScript/ScriptContainer.hpp"
#include "ScScript/ParserAPI.hpp"

#include "Tests/Tests_All.hpp"

#if MACINTOSH
#include "ScCore/CocoaUtils.hpp"
#include "ESTK_N/CocoaUtilsWrapper.hpp"
#include <CoreFoundation/CoreFoundation.h>
#include <objc/objc.h>
#include <objc/objc-runtime.h>
#endif

void exitFunc() {
	ESTK_N::Logger::note("exitFunc called");
}

int main(int argc, const char * argv[]) {

  ScCore::InitTerm::init();
  ScCore::InitTerm::atExit(exitFunc);

  ScScript::InitTerm::init();
  ScScript::InitTerm::atExit(exitFunc);
  
  ESTK_N::Logger::setLogLevel(LOG_LEVEL);
  
  bool testOK = ESTK_N::test_all();
  if (! testOK) {
    ESTK_N::Logger::error("main: some startup tests failed");
  }
  
  ESTK_N::Logger::message("ESTK.cmd started");
  
  ScScript::ScriptContainer* sc = new ScScript::ScriptContainer();
  sc->compile(ScCore::String("$.writeln('hello');"), ScCore::String(""));
  int scriptNum = 0;
  
  ScCore::DebugAlert("hallo","world",1);
  
  ScScript::Script& s1(sc->getScript(0));
  
  ScScript::Engine& e(ScScript::Engine::createEngine(ScScript::Engine::DunnoYet));
  /*
  ScScript::ParserAPI* papi = new ScScript::ParserAPI(e);
  papi->setIncludePath("~/Desktop");
  ScCore::String& ip = papi->getIncludePath();
  ESTK_N::Logger::message(ip);
  //ScScript::Script& s2 = papi->parse(ScCore::String("$.writeln('hello');"));
  
  //sc->insert(s2, 0);
*/
  sc->load(e);
  sc->execute(e, 0);
  
  ScScript::InitTerm::exit();

  ScCore::InitTerm::exit();

  return 0;
}


