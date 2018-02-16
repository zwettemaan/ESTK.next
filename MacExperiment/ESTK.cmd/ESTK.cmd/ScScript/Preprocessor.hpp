#ifndef __ScScript_Preprocessor__
#define __ScScript_Preprocessor__

#include "../ScCore/Root.hpp"
#include "../ScCore/String.hpp"
#include "../ScCore/Error.hpp"

namespace ScScript {

class Script;

  //
  // All of these signatures are guesswork!
  // Many are bound to be incorrect - they're placeholders until
  // they will be properly analyzed
  //

class Preprocessor: ScCore::Root {

public:

  // ? do we need to derive from ScCore::Root?
  class Data {
    protected:
      Data();
      virtual ~Data();
  };

  class ProcData: Data {
    ProcData(ScCore::String const&, ScCore::String const&, ProcData*);
    void skipWS();
    void transfer();
  };

  Preprocessor();
  virtual ~Preprocessor();
  
  void doProcess(ProcData&);
  void directive(ProcData&);

	ScCore::String* getDirective(ScCore::String const&) const;
	ScCore::String* getIncludes() const;
	// This calls 'doProcess'; maybe doProcess is private or protected
	Script* process(ScCore::String const&, ScCore::String const&, ScCore::String&, ScCore::Error*);
	void setIncludes(ScCore::String const&);
};
  
};

#endif
