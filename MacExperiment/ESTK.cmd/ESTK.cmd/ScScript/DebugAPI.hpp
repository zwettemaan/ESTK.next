#ifndef __ScScript_DebugAPI__
#define __ScScript_DebugAPI__

#include "../ScCore/String.hpp"
#include "../ScCore/Variant.hpp"
#include "../ScCore/Error.hpp"
#include "../ScCore/Array.hpp"
#include "../ScCore/XML.hpp"
#include "../ScCore/TSimpleArray.hpp"
#include "../ScCore/THashTable.hpp"

#include "BreakpointInfo.hpp"
#include "ProfilerData.hpp"

namespace ScScript {

 //
  // All of these signatures are guesswork!
  // Most are _known_ to be incorrect - they're placeholders until
  // they will be properly analyzed
  //

class Engine;

class DebugAPI {
public:
  enum Cmd {
  };

  enum WatchAction {
  };

  DebugAPI(Engine&);
  
  void command(Cmd, bool);
  void debugBreak(ScCore::String const&) const;
  void eval(ScCore::String const&, ScCore::Variant&);
  void executeStaticXML(ScCore::XML const&, ScCore::Error&);
  void executeXML(ScCore::XML const&, ScCore::Error&);
  void getBreakpoints(ScCore::TSimpleArray<BreakpointInfo>&) const;
  void getContextInfo(int, ScCore::String&, ScCore::Array&) const;
  void getDebugState() const;
  void getProfilerData(ScCore::TSimpleArray<ProfilerData>*, bool);
  void getProperties(ScCore::Variant const&, ScCore::THashTable<ScCore::Variant>&, bool, bool);
  void getProperties(ScCore::Variant const&, ScCore::THashTable<ScCore::Variant>&, int);
  void getScript() const;
  void getSource() const;
  void getSourceFileID() const;
  void getSourceLine() const;
  void getStackDepth() const;
  void getStackTrace(int, int) const;
  void getWatchpointInfo(ScCore::Variant&, ScCore::Variant&, ScCore::Variant&);
  void isCommandEnabled(Cmd);
  void isReadOnly(ScCore::Variant const&, ScCore::String const&);
  void setBreakpoints(ScCore::TSimpleArray<BreakpointInfo> const*);
  void setContextLevel(int);
  void watchpoint(ScCore::Variant const&, ScCore::Variant const&, WatchAction) const;
};

};

#endif

