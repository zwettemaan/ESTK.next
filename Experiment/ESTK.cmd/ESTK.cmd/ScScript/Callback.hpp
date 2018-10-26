#ifndef __ScScript_Callback__
#define __ScScript_Callback__

#include "../ScCore/Variant.hpp"
#include "../ScCore/String.hpp"
#include "../ScCore/Error.hpp"

namespace ScScript {

class Error;
class Engine;

  //
  // All of these signatures are guesswork!
  // Many are bound to be incorrect - they're placeholders until
  // they will be properly analyzed
  //

class Callback {
public:
  virtual void engineNotify(Engine&, int, long) = 0;
  virtual void enterDebugMode(Engine&) = 0;
  virtual void garbageCollecting(Engine&) = 0;
  virtual void* getClassObject(Engine&, ScCore::String const&, unsigned int&) = 0;
  virtual bool isValidClassName(Engine&, ScCore::String const&) = 0;
  virtual void leaveDebugMode(Engine&, bool) = 0;
  virtual void running(Engine&) = 0;
  virtual void runtimeError(Engine&) = 0;
  virtual void undefinedError(Engine&, ScCore::Variant const&, ScCore::Variant const&, ScCore::Variant&) = 0;
};
  
};

#endif
