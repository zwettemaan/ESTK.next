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
  virtual void engineNotify(Engine&, int, long);
  virtual void enterDebugMode(Engine&);
  virtual bool garbageCollecting(Engine&);
  virtual void* getClassObject(Engine&, ScCore::String const&, unsigned int&);
  virtual bool isValidClassName(Engine&, ScCore::String const&);
  virtual void leaveDebugMode(Engine&, bool);
  virtual bool running(Engine&);
  virtual ScCore::Error runtimeError(Engine&);
  virtual ScCore::Error undefinedError(Engine&, ScCore::Variant const&, ScCore::Variant const&, ScCore::Variant&);
};
  
};

#endif
