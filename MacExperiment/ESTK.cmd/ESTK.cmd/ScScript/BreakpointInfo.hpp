#ifndef __ScScript_BreakpointInfo__
#define __ScScript_BreakpointInfo__

#include "../ScCore/Root.hpp"

namespace ScScript {

 //
  // All of these signatures are guesswork!
  // Many are bound to be incorrect - they're placeholders until
  // they will be properly analyzed
  //

class BreakpointInfo: ScCore::Root {
public:
	BreakpointInfo();
	virtual ~BreakpointInfo();
  BreakpointInfo(BreakpointInfo const&);
  
  BreakpointInfo& operator=(ScScript::BreakpointInfo const&);
  };

};

#endif

