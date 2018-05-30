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
const kParserStateIdle                       = 3000;
const kParserStateExpression                 = 3001;
const kParserStateExpressionPeriod           = 3002;
const kParserState_LHS_Expression            = 3003;
const kParserState_LHS_ExpressionPeriod      = 3004;
const kParserState_LHS_ExpressionToCome      = 3005;
const kParserStateAssignment                 = 3006;
const kParserStateBrace                      = 3007;
const kParserStateArray                      = 3008;

const kStatementType_None                    = 8000;
const kStatementType_Line                    = 8001;
const kStatementType_Block                   = 8002;

// Got these keywords by grabbing a list of JavaScript keywords and seeing which ones
// turn blue in ESTK (meaning it recognizes them)

const kReservedWord_abstract                 = 9001;
const kReservedWord_boolean                  = 9002;
const kReservedWord_break                    = 9003;
const kReservedWord_byte                     = 9004;
const kReservedWord_case                     = 9005;
const kReservedWord_catch                    = 9006;
const kReservedWord_char                     = 9007;
const kReservedWord_class                    = 9008;
const kReservedWord_const                    = 9009;
const kReservedWord_continue                 = 9010;
const kReservedWord_debugger                 = 9011;
const kReservedWord_default                  = 9012;
const kReservedWord_delete                   = 9013;
const kReservedWord_do                       = 9014;
const kReservedWord_double                   = 9015;
const kReservedWord_else                     = 9016;
const kReservedWord_enum                     = 9017;
const kReservedWord_eval                     = 9018;
const kReservedWord_export                   = 9019;
const kReservedWord_extends                  = 9020;
const kReservedWord_false                    = 9021;
const kReservedWord_final                    = 9022;
const kReservedWord_finally                  = 9023;
const kReservedWord_float                    = 9024;
const kReservedWord_for                      = 9025;
const kReservedWord_function                 = 9026;
const kReservedWord_goto                     = 9027;
const kReservedWord_if                       = 9028;
const kReservedWord_implements               = 9029;
const kReservedWord_import                   = 9030;
const kReservedWord_in                       = 9031;
const kReservedWord_instanceof               = 9032;
const kReservedWord_int                      = 9033;
const kReservedWord_interface                = 9034;
const kReservedWord_long                     = 9035;
const kReservedWord_native                   = 9036;
const kReservedWord_new                      = 9037;
const kReservedWord_null                     = 9038;
const kReservedWord_package                  = 9039;
const kReservedWord_private                  = 9040;
const kReservedWord_protected                = 9041;
const kReservedWord_public                   = 9042;
const kReservedWord_return                   = 9043;
const kReservedWord_short                    = 9044;
const kReservedWord_static                   = 9045;
const kReservedWord_super                    = 9046;
const kReservedWord_switch                   = 9047;
const kReservedWord_synchronized             = 9048;
const kReservedWord_this                     = 9049;
const kReservedWord_throw                    = 9050;
const kReservedWord_throws                   = 9051;
const kReservedWord_transient                = 9052;
const kReservedWord_true                     = 9053;
const kReservedWord_try                      = 9054;
const kReservedWord_typeof                   = 9055;
const kReservedWord_var                      = 9056;
const kReservedWord_void                     = 9057;
const kReservedWord_volatile                 = 9058;
const kReservedWord_while                    = 9059;
const kReservedWord_with                     = 9060;

const kTokenNone                             = 7000;
const kTokenLiteralString                    = 7001;
const kTokenName                             = 7002;
const kTokenOpenParens                       = 7003;
const kTokenCloseParens                      = 7004;
const kTokenOpenBrace                        = 7005;
const kTokenCloseBrace                       = 7006;
const kTokenNumber                           = 7007;
const kTokenSemicolon                        = 7010;
const kTokenIncrement                        = 7011;
const kTokenDecrement                        = 7012;
const kTokenAdd                              = 7013;
const kTokenMultiply                         = 7014;
const kTokenSubtract                         = 7015;
const kTokenDivide                           = 7016;
const kTokenBitAnd                           = 7017;
const kTokenBitOr                            = 7018;
const kTokenAnd                              = 7019;
const kTokenOr                               = 7020;
const kTokenPeriod                           = 7021;
const kTokenColon                            = 7022;
const kTokenEqual                            = 7023;
const kTokenAssign                           = 7024;
const kTokenComma                            = 7025;
const kTokenQuestionMark                     = 7026;
const kTokenRegExp                           = 7027;
const kTokenGreaterOrEqual                   = 7028;
const kTokenGreater                          = 7029;
const kTokenLessOrEqual                      = 7030;
const kTokenLess                             = 7031;
const kTokenAddInTo                          = 7032;
const kTokenSubtractInTo                     = 7033;
const kTokenMultiplyInTo                     = 7034;
const kTokenDivideInTo                       = 7035;
const kTokenAndInTo                          = 7036;
const kTokenOrInTo                           = 7037;
const kTokenBitAndInTo                       = 7038;
const kTokenBitOrInTo                        = 7039;
const kTokenBitXorInTo                       = 7040;
const kTokenBitXor                           = 7041;
const kTokenBitShiftLeft                     = 7042;
const kTokenBitShiftRight                    = 7043;
const kTokenBitShiftLeftInto                 = 7044;
const kTokenBitShiftRightInto                = 7045;
const kTokenIdentical                        = 7046;
const kTokenOpenBracket                      = 7047;
const kTokenCloseBracket                     = 7048;
const kTokenPreprocessor                     = 7049;
const kTokenReservedWord                     = 7050;

const kScriptStateIdle                       = 6000;
const kScriptStateKeyword                    = 6001;
const kScriptStateDoubleQuote                = 6002;
const kScriptStateSingleQuote                = 6003;
const kScriptStateNumerical                  = 6004;
const kScriptStatePeriod                     = 6005;
const kScriptStateNumericalMantisse          = 6006;
const kScriptStateNumericalExponent          = 6007;
const kScriptStateZero                       = 6008;
const kScriptStateHexNumber                  = 6009;
const kScriptStateNumericalExponentNumber    = 6010;
const kScriptStateMinus                      = 6011;
const kScriptStatePlus                       = 6012;
const kScriptStateEquals                     = 6013;
const kScriptStateLess                       = 6014;
const kScriptStateGreater                    = 6015;
const kScriptStateRegExp                     = 6016;
const kScriptStateRegExpBackslash            = 6017;
const kScriptStateDoubleQuoteBackslash       = 6018;
const kScriptStateSingleQuoteBackslash       = 6019;
const kScriptStateAfterRegExp                = 6020;
const kScriptStateTimes                      = 6021;
const kScriptStateDivide                     = 6022;
const kScriptStateAnd                        = 6023;
const kScriptStateOr                         = 6024;
const kScriptStateDoubleEquals               = 6025;
const kScriptStateDoubleAnd                  = 6026;
const kScriptStateDoubleOr                   = 6027;
const kScriptStateXor                        = 6028;
const kScriptStateDoubleGreater              = 6029;
const kScriptStateDoubleLess                 = 6030;
const kScriptStatePreprocessor               = 6031;
const kScriptStateDoubleQuoteHexChar         = 6032;
const kScriptStateDoubleQuoteUnicodeChar     = 6033;
const kScriptStateDoubleQuoteOctalChar       = 6034;
const kScriptStateSingleQuoteHexChar         = 6035;
const kScriptStateSingleQuoteUnicodeChar     = 6036;
const kScriptStateSingleQuoteOctalChar       = 6037;

const kCommentStateIdle                      = 5000;
const kCommentStateSlash                     = 5001;
const kCommentStateSlashStarComment          = 5002;
const kCommentStateSlashStarCommentStar      = 5003;
const kCommentStateSlashSlashComment         = 5004;
const kCommentStateDoubleQuote               = 5005;
const kCommentStateDoubleQuoteBackslash      = 5006;
const kCommentStateSingleQuote               = 5007;
const kCommentStateSingleQuoteBackslash      = 5008;
const kCommentStateEOF                       = 5009;
const kCommentStateRegExp                    = 5010;
const kCommentStateRegExpBackslash           = 5011;
const kCommentStateAfterRegExp               = 5012;
const kCommentStateHash                      = 5013;
const kCommentStateHashDoubleQuoted          = 5014;
const kCommentStateHashDoubleQuotedBackslash = 5015;
const kCommentStateHashSingleQuoted          = 5016;
const kCommentStateHashSingleQuotedBackslash = 5017;
}
