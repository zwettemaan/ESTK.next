#ifndef __ScCore_FileSpec__
#define __ScCore_FileSpec__

#include "Root.hpp"
#include "String.hpp"
#include "Array.hpp"

namespace ScCore {

  //
  // All of these signatures are guesswork!
  // Many are bound to be incorrect - they're placeholders until
  // they will be properly analyzed
  //

class SpecData;
class FileFilter;
class FSRef;

class FileSpec: Root {
public:
  enum PackageTreatment {
  };
  
  FileSpec(FileSpec const&);
  FileSpec(FileSpec const&, String const&);
  FileSpec(SpecData*);
  FileSpec(String const&, bool);
  virtual ~FileSpec();
  
  bool changePath(String const&);
  static FileSpec& chooseFile(String const&, bool, String const*, FileFilter*, Array*);
  static FileSpec& chooseFolder(String const&);
  static FileSpec& chooseSaveFile(String const&, String const*, FileFilter*);
  bool createAlias(String const&, bool);
  const String& getAbsoluteURI(bool) const;
  void getAttributes(int*, int*) const;
  const String& getCreator() const;
  const String& getDisplayName() const;
  const String& getExtension() const;
  const FSRef& getFSRef() const;
  bool getFSRef(FSRef&) const;
  const String& getHFSPath(String&, PackageTreatment) const;
  const String& getName() const;
  void getParent() const;
  bool getParentSpec(FileSpec&) const;
  const String& getPath() const;
  const String& getRelativeURI() const;
  const String& getRelativeURI(FileSpec const&) const;
  const String& getResolvedPath() const;
  const String& getRootName() const;
  void getType() const;
  static void initData();
  FileSpec& operator=(FileSpec const&);
  bool operator==(FileSpec const&) const;
  static void releaseData();
  FileSpec& resolve(FileSpec&) const;
  void setAttributes(short);
  void setFSRef(FSRef const&);
  void setFSRef(FSRef const&, String const&);
  void setPath(String const&, bool);
  const String& tempName();
};
  
};

#endif
