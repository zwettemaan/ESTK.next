#ifndef __ScCore_File__
#define __ScCore_File__

#include "Root.hpp"
#include "String.hpp"
#include "FileSpec.hpp"

namespace ScCore {

  //
  // All of these signatures are guesswork!
  // Many are bound to be incorrect - they're placeholders until
  // they will be properly analyzed
  //

class File: Root {
public:
  File(File const&);
  File(FileSpec const&);
  virtual ~File();
  void close();
  void copyTo(FileSpec const&) const;
  void eof() const;
  void execute();
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
