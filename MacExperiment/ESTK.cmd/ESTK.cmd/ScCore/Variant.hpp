#ifndef __ScCore_Variant__
#define __ScCore_Variant__

#include "Root.hpp"
#include "Error.hpp"
#include "FileSpec.hpp"
#include "Array.hpp"
#include "String.hpp"

#include "InterfacePtr.hpp"
#include "THashTable.hpp"

namespace ScScript {
  class Engine;
  class Object;
};

namespace ScCore {

class Encoder;
class LiveObject;
class LiveCollection;
class Point;
class Rect;
class RegExp;
class UnitValue;

  //
  // All of these signatures are guesswork!
  // Many are bound to be incorrect - they're placeholders until
  // they will be properly analyzed
  //

class Variant: Root {
public:

  enum VariantType {
  };

  Variant(bool);
  Variant(char const*);
  Variant(char const*, Encoder*);
  Variant(double);
  Variant(int);
  Variant(int, String const&, Root*);
  Variant(Array const&);
  Variant(FileSpec const&);
  Variant(LiveObject&, int);
  Variant(LiveObject*, int);
  Variant(Point const&);
  Variant(Rect const&);
  Variant(RegExp const&);
  Variant(String const&);
  Variant(UnitValue const&);
  Variant(Variant const&);
  Variant(Variant const*);
  Variant(unsigned short const*);	
  virtual ~Variant();
  int compare(Variant const&) const;
  Variant& convert(VariantType);
  void doErase();
  void doGetDouble() const;
  void doIsFinite() const;
  void doIsMinus0() const;
  void doIsNaN() const;
  void doSetNumAttrs() const;
  void doToString(int) const;
  void getArray() const;
  void getArray(Array&) const;
  void getAsLiveCollection(InterfacePtr<LiveCollection>&) const;
  void getAsLiveObject(InterfacePtr<LiveObject>&) const;
  bool getBool() const;
  void getDataType() const;
  ScScript::Engine* getExtendScriptEngine() const;
  FileSpec* getFileSpec() const;
  int getInteger() const;
  void getInteger(int, int) const;
  void getJSObject() const;
  LiveCollection* getLiveCollection() const;
  LiveObject* getLiveObject() const;
  void getObjectData() const;
  void getObjectProperties(THashTable<Variant>&, int, Error*) const;
  void getPoint() const;
  void getRect() const;
  void getRegExp() const;
  String* getString(int, int) const;
  UnitValue* getUnitValue() const;
  void hasUnassignedObjectData() const;
  void isValidObject() const;
  Variant& operator=(Variant const&);
  bool operator==(Variant const&) const;
  void scanDouble(String const&, int, String*);
  void scanInteger(String const&, int, int, String*);
  void setArray(Array const&);
  void setBool(bool);
  void setDouble(double);
  void setFileSpec(FileSpec const&);
  void setInteger(int);
  void setInteger(unsigned int);
  void setJSObject(ScScript::Object&);
  void setJSObject(ScScript::Object*);
  void setLiveObject(LiveObject&, int);
  void setLiveObject(LiveObject*, int);
  void setMinus0();
  void setNaN();
  void setNegInfinity();
  void setNull();
  void setNumAttrs() const;
  void setObject(int, String const&, Root*);
  void setObjectData(Root*);
  void setObjectID(int);
  void setObjectProperties(THashTable<Variant> const&, Error*);
  void setPoint(Point const&);
  void setPosInfinity();
  void setRect(Rect const&);
  void setRegExp(RegExp const&);
  void setString(char const*);
  void setString(char const*, Encoder*);
  void setString(String const&);
  void setString(unsigned short const*);
  void setUnitValue(UnitValue const&);
  String* toString() const;
  void toString(String&) const;
  bool validate(double, double) const;
  bool validate(int, int) const;
  bool validate(VariantType) const;
  bool validate(unsigned int, unsigned int) const;
};
  
};

#endif
