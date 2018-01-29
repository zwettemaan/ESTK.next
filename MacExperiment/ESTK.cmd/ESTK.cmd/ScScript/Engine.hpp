#ifndef __ScScript_Engine__
#define __ScScript_Engine__

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
  // Most are _known_ to be incorrect - they're placeholders until
  // they will be properly analyzed
  //
class Callback;
class RuntimeError;

class Engine {

private:

  Engine();
  ~Engine();

public:

  // Probably persistent vs nonpersistent or private vs non-private?
  enum Type {
    DunnoYet, // Made up name,
  };

  void clearError();
  void clone(Engine**) const;
  static Engine& createEngine(Engine::Type);
  static Engine& findEngine(ScCore::String const&);
  void gcAll();
  void getAll(ScCore::TSimpleArray<Engine>&);
  const Callback& getCallback() const;
  static Engine* getCurrent();
  const ScCore::Dictionary& getDictionary() const;
  const ScCore::Error& getError() const;
  const ScCore::ErrorInfo& getErrorInfo() const;
  const ScCore::String& getID() const;
  const ScCore::Localizer& getLocalizer() const;
  const ScCore::String& getName() const;
  int getVersion();
  void invalidateClassAll(ScCore::String const&);
  void restoreError(ScCore::Error const&);
  void setCallback(Callback*);
  void setDebugLevel(int);
  void setDictionary(ScCore::Dictionary*);
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


