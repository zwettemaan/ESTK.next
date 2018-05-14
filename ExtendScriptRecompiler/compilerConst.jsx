//
// Compiler/parser for ExtendScript
//
// Symbolic values for compiler.jsx
//
// By Kris Coppieters, kris@rorohiko.com
//

// Don't try to re-define const if they are already defined
if ("undefined" == typeof kTokenNone)
{
const kParserStateIdle                       =  0;

const kTokenNone                             =  0;
const kTokenLiteralString                    =  1;
const kTokenKeyword                          =  2;
const kTokenOpenParens                       =  3;
const kTokenCloseParens                      =  4;
const kTokenOpenBrace                        =  5;
const kTokenCloseBrace                       =  6;
const kTokenNumber                           =  7;
const kTokenSemicolon                        = 10;
const kTokenIncrement                        = 11;
const kTokenDecrement                        = 12;
const kTokenAdd                              = 13;
const kTokenMultiply                         = 14;
const kTokenSubtract                         = 15;
const kTokenDivide                           = 16;
const kTokenBitAnd                           = 17;
const kTokenBitOr                            = 18;
const kTokenAnd                              = 19;
const kTokenOr                               = 20;
const kTokenPeriod                           = 21;
const kTokenColon                            = 22;
const kTokenEqual                            = 23;
const kTokenAssign                           = 24;
const kTokenComma                            = 25;
const kTokenQuestionMark                     = 26;
const kTokenRegExp                           = 27;
const kTokenGreaterOrEqual                   = 28;
const kTokenGreater                          = 29;
const kTokenLessOrEqual                      = 30;
const kTokenLess                             = 31;
const kTokenAddInTo                          = 32;
const kTokenSubtractInTo                     = 33;
const kTokenMultiplyInTo                     = 34;
const kTokenDivideInTo                       = 35;
const kTokenAndInTo                          = 36;
const kTokenOrInTo                           = 37;
const kTokenBitAndInTo                       = 38;
const kTokenBitOrInTo                        = 39;
const kTokenBitXorInTo                       = 40;
const kTokenBitXor                           = 41;
const kTokenBitShiftLeft                     = 42;
const kTokenBitShiftRight                    = 43;
const kTokenBitShiftLeftInto                 = 44;
const kTokenBitShiftRightInto                = 45;
const kTokenIdentical                        = 46;
const kTokenOpenBracket                      = 47;
const kTokenCloseBracket                     = 48;
const kTokenPreprocessor                     = 49;

const kScriptStateIdle                       =  0;
const kScriptStateKeyword                    =  1;
const kScriptStateDoubleQuote                =  2;
const kScriptStateSingleQuote                =  3;
const kScriptStateNumerical                  =  4;
const kScriptStatePeriod                     =  5;
const kScriptStateNumericalMantisse          =  6;
const kScriptStateNumericalExponent          =  7;
const kScriptStateZero                       =  8;
const kScriptStateHexNumber                  =  9;
const kScriptStateNumericalExponentNumber    = 10;
const kScriptStateMinus                      = 11;
const kScriptStatePlus                       = 12;
const kScriptStateEquals                     = 13;
const kScriptStateLess                       = 14;
const kScriptStateGreater                    = 15;
const kScriptStateRegExp                     = 16;
const kScriptStateRegExpBackslash            = 17;
const kScriptStateDoubleQuoteBackslash       = 18;
const kScriptStateSingleQuoteBackslash       = 19;
const kScriptStateAfterRegExp                = 20;
const kScriptStateTimes                      = 21;
const kScriptStateDivide                     = 22;
const kScriptStateAnd                        = 23;
const kScriptStateOr                         = 24;
const kScriptStateDoubleEquals               = 25;
const kScriptStateDoubleAnd                  = 26;
const kScriptStateDoubleOr                   = 27;
const kScriptStateXor                        = 28;
const kScriptStateDoubleGreater              = 29;
const kScriptStateDoubleLess                 = 30;
const kScriptStatePreprocessor               = 31;
const kScriptStateDoubleQuoteHexChar         = 32;
const kScriptStateDoubleQuoteUnicodeChar     = 33;
const kScriptStateDoubleQuoteOctalChar       = 34;
const kScriptStateSingleQuoteHexChar         = 35;
const kScriptStateSingleQuoteUnicodeChar     = 36;
const kScriptStateSingleQuoteOctalChar       = 37;

const kCommentStateIdle                      =  0;
const kCommentStateSlash                     =  1;
const kCommentStateSlashStarComment          =  2;
const kCommentStateSlashStarCommentStar      =  3;
const kCommentStateSlashSlashComment         =  4;
const kCommentStateDoubleQuote               =  5;
const kCommentStateDoubleQuoteBackslash      =  6;
const kCommentStateSingleQuote               =  7;
const kCommentStateSingleQuoteBackslash      =  8;
const kCommentStateEOF                       =  9;
const kCommentStateRegExp                    = 10;
const kCommentStateRegExpBackslash           = 11;
const kCommentStateAfterRegExp               = 12;
const kCommentStateHash                      = 13;
const kCommentStateHashDoubleQuoted          = 14;
const kCommentStateHashDoubleQuotedBackslash = 15;
const kCommentStateHashSingleQuoted          = 16;
const kCommentStateHashSingleQuotedBackslash = 17;
}
