#ifndef __ScCore_Dialogs__
#define __ScCore_Dialogs__

namespace ScCore {

class String;
class Variant;

  //
  // All of these signatures are guesswork!
  // Many are bound to be incorrect - they're placeholders until
  // they will be properly analyzed
  //

class Dialogs {
public:
  static void alert(String const&);
  static void alert(String const&, String const&);
  static void alert(String const&, String const&, bool);
  static int colorPicker(int);
  static bool confirm(String const&, bool);
  static bool confirm(String const&, String const&, bool);
  static void prompt(String const&, String const&, String const&, Variant&);
  static void prompt(String const&, String const&, Variant&);
  static void setAppModality(bool);
  static void setAppModalityCallback(void (*)(bool));
  
};

  
};

#endif
