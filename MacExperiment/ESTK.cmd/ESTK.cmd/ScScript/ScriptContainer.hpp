#ifndef __ScScript_ScriptContainer__
#define __ScScript_ScriptContainer__

#include "../ScCore/Root.hpp"
#include "../ScCore/FileSpec.hpp"
#include "../ScCore/Error.hpp"

#include "Script.hpp"
#include "Engine.hpp"

namespace ScScript {

  //
  // All of these signatures are guesswork!
  // Many are bound to be incorrect - they're placeholders until
  // they will be properly analyzed
  //

class ScriptContainer: ScCore::Root {
  
public:
  // constructor creates an engine, type 0x10000?
  ScriptContainer();
  ScriptContainer(bool);
  
  virtual ~ScriptContainer();
  
  // add scripts to container
  void add(ScriptContainer const&, bool);
  void compile(ScCore::FileSpec const&, bool, bool (*)(ScCore::FileSpec const&));
  void compile(ScCore::String const&, ScCore::String const&);
  
  // empty container
  void erase();
  
  void errorAlert() const;
  void errorAlert(ScCore::Error const&);
  void errorMessage() const;
  void errorMessage(ScCore::Error const&);
  
  void execute(Engine&, int scriptIdx);
  
  ScCore::Error* getError() const;
  
  const Script* getScript(int scriptIdx) const;
  void insert(Script&, int afterScriptIdx);
  bool isContinueOnError() const;
  size_t length() const; // number of scripts added in
  
  void load(Engine& out_engine);
};
  
};

#endif
