#ifndef __ScCore_Utils__
#define __ScCore_Utils__

namespace ScCore {

extern "C" {

  //
  // All of these signatures are guesswork!
  // They're placeholders until they will be properly analyzed
  //

  void*      memchr16(const void *, int, size_t);
  char16_t*  strchr16(const char16_t*, int);
  int        strcmp16(const char16_t*, const char16_t*);
  int        strcmp16(const char16_t*, const char16_t*);
  char16_t*  strcpy16(char16_t*, const char16_t*);
  int        stricmp16(const char16_t*, const char16_t*);
  size_t     strlen16(const char16_t);
  int        strncmp16(const char16_t*, const char16_t*, size_t num);
  int        strnicmp16(const char16_t*, const char16_t*, size_t num);
  char16_t*  strstr16(const char16_t*, const char16_t*);
  
  // Not yet guessed: ScAtomicDec, ScAtomicInc
  // I suspect they will take a pointer to an int or some data structure

}

}

#endif
