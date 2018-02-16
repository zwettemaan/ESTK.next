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
#include "ScScript/Preprocessor.hpp"

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
  
  ScScript::Engine * e = ScScript::Engine::createEngine(ScScript::Engine::DunnoYet);
  ScCore::String nm("myEngine");
  e->setName(nm);

  const ScCore::String* nm1 = e->getName();
  if (nm1 != nullptr) {
    ESTK_N::Logger::message("engine name is :", Continued);
    ESTK_N::Logger::message(nm1);
  }

  ScScript::Preprocessor* pp = new ScScript::Preprocessor();
  
  ScCore::String* i2 = pp->getIncludes();
  ESTK_N::Logger::message(i2);

  ScCore::String i1("/Users/kris/Library/Preferences/Adobe InDesign/Version 13.0/en_US/Scripts/Scripts Panel/");
  pp->setIncludes(i1);
  
  ScCore::String* i3 = pp->getIncludes();
  ESTK_N::Logger::message(i3);

  //ScCore::String src("#target abc\n#include \"t.jsx\"\na = 1;");
  //ScCore::String src("f=File('~/Desktop/t1.txt');f.open('w');f.write('x');f.close();a = 1;\na");
  ScCore::String src("a = 1;\na"); // 2 line script
  ScCore::String p1("");
  ScCore::String p2;

  ScCore::Error err;
  pp->process(src, p1, p2, &err);

  ScCore::String em;
  err.getFullText(em);
  ESTK_N::Logger::message("returned error message is :", Continued);
  ESTK_N::Logger::message(em);

  std::auto_ptr<ScCore::String> i4(pp->getDirective(ScCore::String("target")));
  if (i4.get() != nullptr) {
    ESTK_N::Logger::message("target directive is ", Continued);
    ESTK_N::Logger::message(i4.get());
  }

  std::auto_ptr<ScCore::String> i5(pp->getDirective(ScCore::String("somethingrandom")));
  if (i5.get() == nullptr) {
    ESTK_N::Logger::message("accessing somethingrandom returns null");
  }
  else {
    ESTK_N::Logger::message("somethingrandom is ", Continued);
    ESTK_N::Logger::message(i5.get());
  }

  ESTK_N::Logger::message("p2 is ", Continued);
  ESTK_N::Logger::message(p2);

  ScScript::ScriptContainer* scc = new ScScript::ScriptContainer();
  
  scc->compile(p2, ScCore::String("a = 1;"));
  
  ScScript::Engine* e1 = ScScript::Engine::findEngine(ScCore::String(""));
  const ScCore::String* nm2 = e1->getName();
  if (nm2 != nullptr) {
    ESTK_N::Logger::message("nm2 is ", Continued);
    ESTK_N::Logger::message(nm2);
  }

  const ScScript::Script* scr = scc->getScript(0); // script # 0 is a 2-line script
  if (ScScript::Script::isValidLine(*scr,0)) {
      ESTK_N::Logger::message("line 0 is valid");
  }
  if (ScScript::Script::isValidLine(*scr,1)) {
      ESTK_N::Logger::message("line 1 is valid");
  }
  if (ScScript::Script::isValidLine(*scr,10)) {
      ESTK_N::Logger::message("line 10 is valid");
  }
  else {
      ESTK_N::Logger::message("line 10 is not valid"); // This ought to fire - script has only 2 lines
  }

  ESTK_N::Callback* cb = new ESTK_N::Callback();
  e->setCallback(cb);

  scc->load(*e);

  scc->execute(*e, 0);

  e->setCallback(nullptr);

  const ScCore::Error* err2 = e->getError();
  err2->getFullText(em);
  ESTK_N::Logger::message("returned error message is :", Continued);
  ESTK_N::Logger::message(em);
  
  ScScript::InitTerm::exit();

  ScCore::InitTerm::exit();

  return 0;
}



