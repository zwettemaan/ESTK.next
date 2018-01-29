#ifndef __ScScript_ScriptContainer__
#define __ScScript_ScriptContainer__

#include "../ScCore/FileSpec.hpp"
#include "../ScCore/Error.hpp"

class Script;
class Engine;

namespace ScScript {

  //
  // All of these signatures are guesswork!
  // Most are _known_ to be incorrect - they're placeholders until
  // they will be properly analyzed
  //

class ScriptContainer {
  
public:
  ScriptContainer();
  ScriptContainer(bool);
  ~ScriptContainer();
  
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
  
  ScCore::Error& getError() const;
  
  Script& getScript(int scriptIdx) const;
  void insert(Script&, int afterScriptIdx);
  void isContinueOnError() const;
  size_t length() const; // number of scripts added in
  
  void load(ScScript::Engine&);
};
  
};

#endif
