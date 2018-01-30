#ifndef ESTK_N_Callback_hpp
#define ESTK_N_Callback_hpp

#include "../ScScript/Callback.hpp"
#include "../ScScript/Engine.hpp"

namespace ESTK_N {

class Callback: public ScScript::Callback {

  ScScript::Callback* fOldCallback;
  
public:

  Callback(ScScript::Callback* oldCallback):
  ScScript::Callback(),
  fOldCallback(oldCallback) {  
  };
  
  virtual void engineNotify(ScScript::Engine&, int, long);
  virtual void enterDebugMode(ScScript::Engine&);
  virtual bool garbageCollecting(ScScript::Engine&);
  virtual void* getClassObject(ScScript::Engine&, ScCore::String const&, unsigned int&);
  virtual bool isValidClassName(ScScript::Engine&, ScCore::String const&);
  virtual void leaveDebugMode(ScScript::Engine&, bool);
  virtual bool running(ScScript::Engine&);
  virtual ScCore::Error runtimeError(ScScript::Engine&);
  virtual ScCore::Error undefinedError(ScScript::Engine&, ScCore::Variant const&, ScCore::Variant const&, ScCore::Variant&);
};
  
};

#endif /* ESTK_N_Callback_hpp */
