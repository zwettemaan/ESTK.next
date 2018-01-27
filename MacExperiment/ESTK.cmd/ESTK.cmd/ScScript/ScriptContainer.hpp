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
private:

  ScriptContainer();
  ScriptContainer(bool);
  ~ScriptContainer();
  
public:
  void add(ScriptContainer const&, bool);
  static ScriptContainer& compile(ScCore::FileSpec const&, bool, bool (*)(ScCore::FileSpec const&));
  static ScriptContainer& compile(ScCore::String const&, ScCore::String const&);
  void erase();
  void errorAlert() const;
  void errorAlert(ScCore::Error const&);
  void errorMessage() const;
  void errorMessage(ScCore::Error const&);
  void execute(Engine&, int);
  void getError() const;
  Script& getScript(int) const;
  void insert(Script&, int);
  void isContinueOnError() const;
  void length() const;
  void load(ScScript::Engine&);
};
  
};

#endif
