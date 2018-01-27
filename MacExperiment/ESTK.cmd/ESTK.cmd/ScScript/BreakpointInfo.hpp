#ifndef __ScScript_BreakpointInfo__
#define __ScScript_BreakpointInfo__

namespace ScScript {

 //
  // All of these signatures are guesswork!
  // Most are _known_ to be incorrect - they're placeholders until
  // they will be properly analyzed
  //

class BreakpointInfo {
public:
	BreakpointInfo();
	~BreakpointInfo();
  BreakpointInfo(BreakpointInfo const&);
  
  BreakpointInfo& BreakpointInfo::operator=(ScScript::BreakpointInfo const&);
  };

};

#endif

