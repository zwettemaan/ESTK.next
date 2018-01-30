#ifndef __ScCore_Error__
#define __ScCore_Error__

namespace ScCore {

  //
  // All of these signatures are guesswork!
  // Many are bound to be incorrect - they're placeholders until
  // they will be properly analyzed
  //

class String;
class Variant;
class Cloneable;
class ErrorInfo;
class LiveObject;

class Error {
public:
	Error();
	Error(int, String const&, bool);
	Error(Error const&);
	~Error();
	void defineError(int, String const&, char const*);
	void erase();
	void getErrorDefinition(int, String&, String&);
	void getFullText(String&) const;
	bool isErrorClass(String const&);
	Error operator=(Error const&);
	void push(int, Cloneable const*);
	void push(int, LiveObject const&, int, bool, Cloneable const*);
	void push(int, String const&, Cloneable const*, bool);
	void push(int, Variant const&, Cloneable const*);
	void push(Error const&);
	void push(ErrorInfo const&);
	void setMoreInfo(String const&, int, int, int, unsigned short);
	void undefineError(int);
	void unique();
};
  
};

#endif
