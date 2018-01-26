#ifndef __ScCore_InitTerm__
#define __ScCore_InitTerm__

#include <cstdarg>

namespace ScCore {

  //
  // All of these signatures are guesswork!
  //

class Encoder;
class Array;

class String {

  enum CRLFEncoding {
  };
  
public:

  String();
  String(char const*);
  String(char const*, Encoder const*);
  String(ScCore::String const&);
  String(unsigned int const*, int);
  String(unsigned short const*, int);
  ~String();

  void adjust(int);
  void append(char const*, int);
  void append(unsigned short const*, int);
  void clear();
  int cmp(char const*) const;
  int cmp(ScCore::String const&) const;
  int cmp(unsigned short const*) const;
  void convertLF(String::CRLFEncoding);
  void decode(char const*, int, ScCore::Encoder const*);
  void decode(unsigned int const*);
  void decodeURI();
  void emptyString();
  void encode(char const*&, int&, ScCore::Encoder const*) const;
  void encode(ScCore::Encoder const*) const;
  void encodeURI(char const*);
  void encodeURI(unsigned short const*);
  void encodeUtf32() const;
  void erase();
  void erase(int, int);
  void escape(bool) const;
  size_t find(char const*, int, bool) const;
  size_t find(ScCore::String const&, int, bool) const;
  size_t find(unsigned short const*, int, bool) const;
  size_t find(unsigned short, int, bool) const;
  size_t findAny(char const*, int) const;
  size_t findAny(ScCore::String const&, int) const;
  size_t findAny(unsigned short const*, int) const;
  size_t getEncodedLength();
  void init(int);
  void insert(char const*, int);
  void insert(ScCore::String const&, int);
  void insert(unsigned short const*, int);
  void insert(unsigned short, int);
  void localize(Array const*);
  void makeUnique();
  int ncmp(char const*, int) const;
  int ncmp(ScCore::String const&, int) const;
  int ncmp(unsigned short const*, int) const;
  int nucmp(char const*, int) const;
  int nucmp(ScCore::String const&, int) const;
  int nucmp(unsigned short const*, int) const;
  ScCore::String operator+(char const*) const;
  ScCore::String operator+(char) const;
  ScCore::String operator+(ScCore::String const&) const;
  ScCore::String operator+(unsigned short const*) const;
  ScCore::String operator+(unsigned short) const;
  ScCore::String& operator+=(char const*);
  ScCore::String& operator+=(char);
  ScCore::String& operator+=(ScCore::String const&);
  ScCore::String& operator+=(unsigned short const*);
  ScCore::String& operator+=(unsigned short);
  ScCore::String& operator=(char const*);
  ScCore::String& operator=(char);
  ScCore::String& operator=(ScCore::String const&);
  ScCore::String& operator=(unsigned int const*);
  ScCore::String& operator=(unsigned short const*);
  ScCore::String& operator=(unsigned short);
  bool operator==(ScCore::String const&) const;
  void parse(ScCore::String&);
  void parse(ScCore::String&, int&) const;
  void print(char const*, ...);
  void print(unsigned short const*, ...);
  void replace(char const*, char const*, int);
  void replace(char const*, ScCore::String const&, int);
  void replace(ScCore::String const&, char const*, int);
  void replace(ScCore::String const&, ScCore::String const&, int);
  void replace(ScCore::String const&, unsigned short const*, int);
  void replace(unsigned short const*, ScCore::String const&, int);
  void replace(unsigned short const*, unsigned short const*, int);
  void replace(unsigned short, unsigned short, int);
  void replaceAll(char const*, char const*, int);
  void replaceAll(char const*, ScCore::String const&, int);
  void replaceAll(ScCore::String const&, char const*, int);
  void replaceAll(ScCore::String const&, ScCore::String const&, int);
  void replaceAll(ScCore::String const&, unsigned short const*, int);
  void replaceAll(unsigned short const*, ScCore::String const&, int);
  void replaceAll(unsigned short const*, unsigned short const*, int);
  void replaceAll(unsigned short, unsigned short, int);
  void set(int, unsigned short);
  void setup(unsigned short, int);
  void split(char const*);
  void split(char);
  void split(ScCore::String const&);
  void split(unsigned short const*);
  void split(unsigned short);
  void strip();
  ScCore::String& substr(int, int) const;
  ScCore::String& toLower();
  ScCore::String& toMixed();
  ScCore::String& toUpper();
  int ucmp(char const*) const;
  int ucmp(ScCore::String const&) const;
  int ucmp(unsigned short const*) const;
  void unique();
  void vprint(char const*, va_list);
  void vprint(unsigned short const*, va_list);
  
};
  
};

#endif
