#ifndef __ScCore_String__
#define __ScCore_String__

#include <cstdarg>
#include <cstddef>

#include "Root.hpp"
#include "Array.hpp"

namespace ScCore {

  //
  // All of these signatures are guesswork!
  // Many are bound to be incorrect - they're placeholders until
  // they will be properly analyzed
  //

class Encoder;

class String: Root {

public:

  enum CRLFEncoding {
  };
  
  String();
  String(char const*);
  String(char const*, Encoder const*);
  String(String const&);
  String(unsigned int const*, int);
  String(unsigned short const*, int);
  virtual ~String();

  void adjust(int);
  void append(char const*, int);
  void append(unsigned short const*, int);
  void clear();
  int cmp(char const*) const;
  int cmp(String const&) const;
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
  size_t find(String const&, int, bool) const;
  size_t find(unsigned short const*, int, bool) const;
  size_t find(unsigned short, int, bool) const;
  size_t findAny(char const*, int) const;
  size_t findAny(String const&, int) const;
  size_t findAny(unsigned short const*, int) const;
  size_t getEncodedLength();
  void init(int);
  void insert(char const*, int);
  void insert(String const&, int);
  void insert(unsigned short const*, int);
  void insert(unsigned short, int);
  void localize(Array const*);
  void makeUnique();
  int ncmp(char const*, int) const;
  int ncmp(String const&, int) const;
  int ncmp(unsigned short const*, int) const;
  int nucmp(char const*, int) const;
  int nucmp(String const&, int) const;
  int nucmp(unsigned short const*, int) const;
  String operator+(char const*) const;
  String operator+(char) const;
  String operator+(String const&) const;
  String operator+(unsigned short const*) const;
  String operator+(unsigned short) const;
  String& operator+=(char const*);
  String& operator+=(char);
  String& operator+=(String const&);
  String& operator+=(unsigned short const*);
  String& operator+=(unsigned short);
  String& operator=(char const*);
  String& operator=(char);
  String& operator=(String const&);
  String& operator=(unsigned int const*);
  String& operator=(unsigned short const*);
  String& operator=(unsigned short);
  bool operator==(String const&) const;
  void parse(String&);
  void parse(String&, int&) const;
  void print(char const*, ...);
  void print(unsigned short const*, ...);
  void replace(char const*, char const*, int);
  void replace(char const*, String const&, int);
  void replace(String const&, char const*, int);
  void replace(String const&, String const&, int);
  void replace(String const&, unsigned short const*, int);
  void replace(unsigned short const*, String const&, int);
  void replace(unsigned short const*, unsigned short const*, int);
  void replace(unsigned short, unsigned short, int);
  void replaceAll(char const*, char const*, int);
  void replaceAll(char const*, String const&, int);
  void replaceAll(String const&, char const*, int);
  void replaceAll(String const&, String const&, int);
  void replaceAll(String const&, unsigned short const*, int);
  void replaceAll(unsigned short const*, String const&, int);
  void replaceAll(unsigned short const*, unsigned short const*, int);
  void replaceAll(unsigned short, unsigned short, int);
  void set(int, unsigned short);
  void setup(unsigned short, int);
  void split(char const*);
  void split(char);
  void split(String const&);
  void split(unsigned short const*);
  void split(unsigned short);
  void strip();
  String& substr(int, int) const;
  String& toLower();
  String& toMixed();
  String& toUpper();
  int ucmp(char const*) const;
  int ucmp(String const&) const;
  int ucmp(unsigned short const*) const;
  void unique();
  void vprint(char const*, va_list);
  void vprint(unsigned short const*, va_list);
  
};
  
};

#endif
