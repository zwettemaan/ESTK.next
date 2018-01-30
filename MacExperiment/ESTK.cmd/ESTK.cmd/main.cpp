#include <iostream>

#include "config.h"
#include "ESTK_N/Logger.hpp"

#include "ScCore/InitTerm.hpp"
#include "ScCore/Utils.h"
#include "ScCore/String.hpp"
#include "ScCore/FileSpec.hpp"
#include "ScCore/File.hpp"
#include "ScCore/DebugAlert.hpp"
#include "ScCore/Dialogs.hpp"

#include "ScScript/InitTerm.hpp"
#include "ScScript/Engine.hpp"
#include "ScScript/Node.hpp"
#include "ScScript/ScopeNode.hpp"
#include "ScScript/Script.hpp"
#include "ScScript/ScriptContainer.hpp"
#include "ScScript/ParserAPI.hpp"

#include "ESTK_N/Callback.hpp"

#include "Tests/Tests_All.hpp"
#include "Debug/VerifyObject.hpp"

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
  ESTK_N::VerifyObject(*sc);
  
  sc->compile(ScCore::String("'abc';"), ScCore::String("$.writeln('hello');"));
  int scriptNum = 0;

  ScScript::Script& s1(sc->getScript(0));
  
  ScScript::Engine& e(ScScript::Engine::createEngine(ScScript::Engine::DunnoYet));
  //ESTK_N::VerifyObject(e);
  
  //ScScript::Callback* oldCallback = e.getCallback();
  
  //ESTK_N::Callback* callback = new ESTK_N::Callback(oldCallback);
  //e.setCallback(callback);
  
  sc->execute(e, 0);
  
  ScScript::ParserAPI* papi = new ScScript::ParserAPI(e);
  ESTK_N::VerifyObject(*papi);
  
  ScCore::String& ip = papi->getIncludePath();
  ESTK_N::VerifyObject(ip);

  papi->setIncludePath(ScCore::String("~/Desktop"));

  ESTK_N::Logger::message(ip);
  ScScript::Node& s2 = papi->parse(ScCore::String("$.writeln('hello');"));
  
  //bool b = s2.dump(e, 0);
  //if (s3 != nullptr) {
    //ESTK_N::Logger::message(*s3);
  //}
  
  //sc->load(e);
 
  ScScript::InitTerm::exit();

  ScCore::InitTerm::exit();

  return 0;
}


