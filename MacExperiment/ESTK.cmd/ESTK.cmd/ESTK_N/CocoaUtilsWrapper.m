#import <Foundation/Foundation.h>

#import "CocoaUtilsWrapper.hpp"

size_t nsString_length(const NSString* nsString) {
  size_t retVal = [nsString length];
  return retVal;
}

void nsString_release(const NSString* in_nsString) {
  [in_nsString release];
}

void nsString_to_UTF16(const NSString* in_nsString, unichar* buffer, size_t bufSize) {
  size_t length = [in_nsString length];
  if (bufSize < length) {
    length = bufSize;
  }
  [in_nsString getCharacters: buffer range:NSMakeRange(0, length)];
}

const NSString* utf8_to_NSString(const char* in_s) {
  NSString *str = [NSString stringWithUTF8String: in_s];
  return str;
}

const NSString* utf16_to_NSString(const unichar* in_sUTF16, size_t in_length) {
  const NSString *str = [NSString stringWithCharacters: (const unichar*) in_sUTF16 length: in_length];
  return str;
}

