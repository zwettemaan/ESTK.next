#ifndef __ScCore_File__
#define __ScCore_File__

#include "String.hpp"

namespace ScCore {

  //
  // All of these signatures are guesswork!
  // Most are _known_ to be incorrect - they're placeholders until
  // they will be properly analyzed
  //

class FileSpec;
class String;

class File {
public:
  File(ScCore::File const&);
  File(ScCore::FileSpec const&);
  ~File();
  void close();
  void copyTo(FileSpec const&) const;
  void eof() const;
  bool execute();
  void flush();
  void getContent(String&, int);
  String::CRLFEncoding getEncoding() const;
  void getLF() const;
  void getSize(long long&) const;
  void isOpen() const;
  void open(String const&, unsigned int, unsigned int);
  File& operator=(File const&);
  void read(long long, String&);
  void readln(String&);
  void seek(long long, int);
  void setEncoding(String const&);
  void setLF(String::CRLFEncoding);
  void setSize(long long);
  long long tell() const;
  void write(String const&, bool);
};
  
};

#endif
