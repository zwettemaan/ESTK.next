#ifndef __ScScript_Engine__
#define __ScScript_Engine__

#include "../ScCore/Root.hpp"
#include "../ScCore/String.hpp"
#include "../ScCore/Dictionary.hpp"
#include "../ScCore/Error.hpp"
#include "../ScCore/ErrorInfo.hpp"
#include "../ScCore/LiveObject.hpp"
#include "../ScCore/Localizer.hpp"
#include "../ScCore/TSimpleArray.hpp"

namespace ScScript {

 //
  // All of these signatures are guesswork!
  // Many are bound to be incorrect - they're placeholders until
  // they will be properly analyzed
  //
class Callback;
class RuntimeError;
class ESContext;

class Engine: ScCore::Root {

private:

  Engine(); // creates a Broadcaster; gets an ESContext
  virtual ~Engine();

public:

  // Probably persistent vs nonpersistent or private vs non-private?
  enum Type {
    DunnoYet, // Made up name,
  };
  void clearError();
  void clone(Engine** targetEngine) const;
  static Engine* createEngine(Engine::Type);
  static Engine* findEngine(ScCore::String const&);
  static void gcAll();
  static void getAll(ScCore::TSimpleArray<Engine>&);
  Callback* getCallback() const;
  static ESContext* getCurrent();
  virtual const ScCore::Dictionary* getDictionary() const; // stub, returns 0. For subclasses of Engine?
  const ScCore::Error* getError() const;
  const ScCore::ErrorInfo* getErrorInfo() const;
  const ScCore::String* getID() const;
  const ScCore::Localizer* getLocalizer() const;
  const ScCore::String* getName() const;
  // returns a constant; the engine version#?
  int getVersion(); 
  void invalidateClassAll(ScCore::String const&);
  void restoreError(ScCore::Error const&);
  void setCallback(Callback*);
  void setDebugLevel(int);
  virtual void setDictionary(ScCore::Dictionary*); // stub, do-nothing. For subclasses of Engine to override?
  void setError(int);
  void setError(int, ScCore::LiveObject const&, int, bool, int);
  void setError(int, ScCore::String const&, int, bool);
  void setError(ScCore::Error const&);
  void setError(RuntimeError const&);
  void setLocalizer(ScCore::Localizer const*);
  void setName(ScCore::String const&);
  void setProfilingLevel(int);

};

};

#endif


