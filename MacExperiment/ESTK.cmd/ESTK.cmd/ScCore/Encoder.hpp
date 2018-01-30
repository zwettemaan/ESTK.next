#ifndef __ScCore_Encoder__
#define __ScCore_Encoder__

namespace ScCore {

  //
  // All of these signatures are guesswork!
  // Many are bound to be incorrect - they're placeholders until
  // they will be properly analyzed
  //

class Encoder {
public:
  Encoder();
  ~Encoder();

  void add(ScCore::Encoder const&);
  void addAlias(char const*, char const*);
  void addAlias(ScCore::Encoder const&, char const*);
  void find(ScCore::String const&) const;
  void get(char const*);
  void get(unsigned short const*);
  void getAscii();
  void getBinary();
  void getDefault();
  void getMBCSLength(unsigned short const*, int, int&) const;
  void getSystem();
  void getUnicodeLength(char const*, int, int&) const;
  void getUtf32();
  void getUtf8();
  void setDefault(ScCore::Encoder const&);
  void toMBCS(unsigned short const*, int&, char*, int&, bool) const;
  void toUnicode(char const*, int&, unsigned short*, int&, bool) const;

};
  
};

#endif
