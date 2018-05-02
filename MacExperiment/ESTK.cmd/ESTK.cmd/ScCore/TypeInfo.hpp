#ifndef __ScCore_Root__
#define __ScCore_Root__

#include "Root.hpp"
#include "String.hpp"
#include "Variant.hpp"

namespace ScCore {

  //
  // All of these signatures are guesswork!
  // Many are bound to be incorrect - they're placeholders until
  // they will be properly analyzed
  //

class TypeInfo: Root {
public:
  String* convertDataTypeToString(VariantType v);
  void getDataClass(String& dataClass) const
  void getDataTypeAsString(String& dataType) const
  void getDefaultValue(Variant&) const
  void getDescription(String& description) const
  bool getValidRange(double&, double&) const
  bool isCollection() const
  static void parse(ScCore::String const&, int, ScCore::String*, ScCore::String*, ScCore::String*, ScCore::TypeInfo**);
};
  
};

#endif
