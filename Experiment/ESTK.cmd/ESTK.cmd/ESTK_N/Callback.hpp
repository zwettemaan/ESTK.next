#ifndef ESTK_N_Callback_hpp
#define ESTK_N_Callback_hpp

#include "../ScScript/Callback.hpp"
#include "../ScScript/Engine.hpp"

namespace ESTK_N {

class Callback: public ScScript::Callback {

public:

  Callback(ScScript::Callback* oldCallback):
  ScScript::Callback()//,
  {
  };

  /*
  bool isRunning() {
    return fIsRunning;
  }
  */
  virtual void engineNotify(ScScript::Engine&, int, long);
  virtual void enterDebugMode(ScScript::Engine&);
  virtual void garbageCollecting(ScScript::Engine&);
  virtual void* getClassObject(ScScript::Engine&, ScCore::String const&, unsigned int&);
  virtual bool isValidClassName(ScScript::Engine&, ScCore::String const&);
  virtual void leaveDebugMode(ScScript::Engine&, bool);
  virtual void running(ScScript::Engine&);
  virtual void runtimeError(ScScript::Engine&);
  virtual void undefinedError(ScScript::Engine&, ScCore::Variant const&, ScCore::Variant const&, ScCore::Variant&);
};
  
};

#endif /* ESTK_N_Callback_hpp */
