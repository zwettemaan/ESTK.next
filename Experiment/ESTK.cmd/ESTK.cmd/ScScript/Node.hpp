#ifndef __ScScript_Node__
#define __ScScript_Node__

#include "../ScCore/String.hpp"

namespace ScScript {

class ScanInfo;
class Engine;
class BinaryNode;
class LabelNode;
class ListNode;
class TernaryNode;
class UnaryNode;
class ScopeNode;

  //
  // All of these signatures are guesswork!
  // Many are bound to be incorrect - they're placeholders until
  // they will be properly analyzed
  //

class Node {
private:
  Node(ScanInfo const&);
  virtual ~Node();
public:
  virtual bool dump(Engine&, int);
  virtual void foldConstants();
  virtual BinaryNode& toBinaryNode() const;
  virtual LabelNode& toLabelNode() const;
  virtual ListNode& toListNode() const;
  virtual Node& toScopeNode() const;
  virtual ScCore::String* toString() const;
  virtual TernaryNode& toTernaryNode() const;
  virtual UnaryNode& toUnaryNode() const;
};
  
};

#endif
