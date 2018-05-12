//
// Compiler/parser for ExtendScript
//
// By Kris Coppieters, kris@rorohiko.com
//

#include "compilerConst.jsx"

if (typeof _ESNX_ == "undefined") {
    _ESNX_ = {};
}

(function(){

_ESNX_.compiler = {};

var template = function() {

    var retVal = undefined;

    do {
        try {
            LOG_ERROR("template function - don't use");
        }
        catch (err) {
            LOG_ERROR("template: throws " + err)
        }
    }
    while (false);
}
_ESNX_.compiler.template = template;

var compileFile = function(in_file) {

    var retVal = "";

    do {
        try {
            if (! in_file) {
                LOG_ERROR("compileFile: need in_file");
                break;
            }

            if (! in_file.exists) {
                LOG_ERROR("compileFile: in_file does not exist");
                break;
            }

            in_file.open("r");
            var scriptText = in_file.read();
            in_file.close();

            retVal = compileScript(scriptText);
        }
        catch (err) {
            LOG_ERROR("compileFile: throws " + err)
        }
    }
    while (false);

    return retVal;
}
_ESNX_.compiler.compileFile = compileFile;

var tokenListToString = function(tokenList) {

    var dump = "";
    var lineNumber = 1;
    var prvTokenType = kTokenNone;
    for (var idx = 0; idx < tokenList.length; idx++) {
        var token = tokenList[idx];
        while (lineNumber < token.lineNumber) {
            lineNumber++;
            dump += '\n';
            prvTokenType = kTokenNone;
        }
        switch (token.tokenType) {
            case kTokenNone:
                break;
            case kTokenLiteralString:
                dump += '"' + token.token.replace(/\\/g,"\\\\").replace(/"/g, "\\\"") + '"';
                break;
            case kTokenRegExp:
                dump += token.token;
                break;
            case kTokenPreprocessor:
                dump += token.token + "\n";
                lineNumber++;
                break;
            case kTokenKeyword:
                if (prvTokenType == kTokenKeyword || prvTokenType == kTokenNumber || prvTokenType == kTokenRegExp) {
                    dump += ' ';
                }
                dump += token.token;
                break;
            case kTokenOpenParens:
                dump += '(';
                break;
            case kTokenCloseParens:
                dump += ')';
                break;
            case kTokenOpenBrace:
                dump += '{';
                break;
            case kTokenCloseBrace:
                dump += '}';
                break;
            case kTokenNumber:
                if (prvTokenType == kTokenKeyword || prvTokenType == kTokenNumber || prvTokenType == kTokenRegExp) {
                    dump += ' ';
                }
                dump += token.token;
                break;
            case kTokenSemicolon:
                dump += ';';
                break;
            case kTokenIncrement:
                dump += '++';
                break;
            case kTokenDecrement:
                dump += '--';
                break;
            case kTokenAdd:
                dump += '+';
                break;
            case kTokenMultiply:
                dump += '*';
                break;
            case kTokenSubtract:
                dump += '-';
                break;
            case kTokenDivide:
                dump += '/';
                break;
            case kTokenBitAnd:
                dump += '&';
                break;
            case kTokenBitOr:
                dump += '|';
                break;
            case kTokenAnd:
                dump += '&&';
                break;
            case kTokenOr:
                dump += '||';
                break;
            case kTokenPeriod:
                dump += '.';
                break;
            case kTokenColon:
                dump += ':';
                break;
            case kTokenEqual:
                dump += '==';
                break;
            case kTokenAssign:
                dump += '=';
                break;
            case kTokenComma:
                dump += ',';
                break;
            case kTokenQuestionMark:
                dump += '?';
                break;
            case kTokenGreaterOrEqual:
                dump += '>=';
                break;
            case kTokenGreater:
                dump += '>';
                break;
            case kTokenLessOrEqual:
                dump += '<=';
                break;
            case kTokenLess:
                dump += '<';
                break;
            case kTokenAddInTo:
                dump += '+=';
                break;
            case kTokenSubtractInTo:
                dump += '-=';
                break;
            case kTokenMultiplyInTo:
                dump += '*=';
                break;
            case kTokenDivideInTo:
                dump += '/=';
                break;
            case kTokenAndInTo:
                dump += '&&=';
                break;
            case kTokenOrInTo:
                dump += '||=';
                break;
            case kTokenBitAndInTo:
                dump += '&=';
                break;
            case kTokenBitOrInTo:
                dump += '|=';
                break;
            case kTokenBitXorInTo:
                dump += '^=';
                break;
            case kTokenBitXor:
                dump += '^';
                break;
            case kTokenBitShiftLeft:
                dump += '<<';
                break;
            case kTokenBitShiftRight:
                dump += '>>';
                break;
            case kTokenBitShiftLeftInto:
                dump += '<<=';
                break;
            case kTokenBitShiftRightInto:
                dump += '>>=';
                break;
            case kTokenIdentical:
                dump += '===';
                break;
            case kTokenOpenBracket:
                dump += '[';
                break;
            case kTokenCloseBracket:
                dump += ']';
                break;
        }
        prvTokenType = token.tokenType;
    }

    return dump;
}
_ESNX_.compiler.tokenListToString = tokenListToString;

var compileScript = function(in_scriptText) {

    var retVal = "";

    do {
        try {

            var scriptCharsQueue = "";
            var scriptCharsLineNumber = [];
            var whiteSpace = "";

            function addCharToScriptCharsQueue(rawChr, lineNumber) {

                if (" \t".indexOf(rawChr) >= 0) {
                    if (whiteSpace.length == 0) {
                        whiteSpace = " ";
                    }
                }
                else if ("\n\r".indexOf(rawChr) >= 0) {
                    whiteSpace = "\n";
                }
                else {
                    if (whiteSpace.length > 0) {
                        scriptCharsQueue += whiteSpace;
                        whiteSpace = "";
                    }
                    scriptCharsQueue += rawChr;
                    scriptCharsLineNumber.push(lineNumber);
                }
            }

            function addToScriptCharsQueue(chars, lineNumber) {
                for (var idx = 0; idx < chars.length; idx++) {
                    addCharToScriptCharsQueue(chars.charAt(idx), lineNumber);
                }
            }

            var scriptState = kScriptStateIdle;
            var lastTokenType = kTokenNone;
            var scriptCharsQueuePos = 0;
            var stringConst = "";
            var keyword = "";
            var numberStr = "";
            var regExp = "";
            var preprocessorString = "";
            var prvNonWhiteScriptChr = "";
            var prvLineNumber = 0;
            var tokenLineNumber = 0;
            var scriptChr = "";

            var tokenQueue = [];

            function processToken() {
            }
            var counter = 0;
            
            function addToTokenQueue(token) {
                tokenQueue.push(token);
                lastTokenType = token.tokenType;
            }

            function processFilteredScriptChar() {

                do {

                    if (scriptCharsQueuePos >= scriptCharsQueue.length) {
                        if (scriptCharsQueuePos) {
                            scriptCharsQueue = "";
                            scriptCharsLineNumber = [];
                            scriptCharsQueuePos = 0;
                        }
                        break;
                    }

                    if (scriptChr > ' ') {
                        prvNonWhiteScriptChr = scriptChr;
                    }

                    scriptChr = scriptCharsQueue.charAt(scriptCharsQueuePos);
                    var prvLineNumber = lineNumber;
                    var lineNumber = scriptCharsLineNumber[scriptCharsQueuePos];
                    scriptCharsQueuePos++;
                    switch (scriptState) {
                        default:
                            LOG_ERROR("processFilteredScriptChar: unexpected scriptState");
                            break;
                        case kScriptStateIdle:
                            if (scriptChr <= ' ') {
                                // do nothing
                            }
                            else if (scriptChr == '#' && prvLineNumber != lineNumber) {
                                preprocessorString = scriptChr;
                                tokenLineNumber = lineNumber;
                                scriptState = kScriptStatePreprocessor;
                            }
                            else if (scriptChr == '"') {
                                tokenLineNumber = lineNumber;
                                scriptState = kScriptStateDoubleQuote;
                            }
                            else if (scriptChr == "'") {
                                tokenLineNumber = lineNumber;
                                scriptState = kScriptStateSingleQuote;
                            }
                            else if (scriptChr == ';') {
                                addToTokenQueue({
                                    tokenType: kTokenSemicolon,
                                    lineNumber: lineNumber,
                                    token: ';'
                                });
                            }
                            else if (scriptChr == ':') {
                                addToTokenQueue({
                                    tokenType: kTokenColon,
                                    lineNumber: lineNumber,
                                    token: ':'
                                });
                            }
                            else if (scriptChr == '{') {
                                addToTokenQueue({
                                    tokenType: kTokenOpenBrace,
                                    lineNumber: lineNumber,
                                    token: '{'
                                });
                            }
                            else if (scriptChr == '}') {
                                addToTokenQueue({
                                    tokenType: kTokenCloseBrace,
                                    lineNumber: lineNumber,
                                    token: '}'
                                });
                            }
                            else if (scriptChr == '[') {
                                addToTokenQueue({
                                    tokenType: kTokenOpenBracket,
                                    lineNumber: lineNumber,
                                    token: '['
                                });
                            }
                            else if (scriptChr == ']') {
                                addToTokenQueue({
                                    tokenType: kTokenCloseBracket,
                                    lineNumber: lineNumber,
                                    token: ']'
                                });
                            }
                            else if (scriptChr == '(') {
                                addToTokenQueue({
                                    tokenType: kTokenOpenParens,
                                    lineNumber: lineNumber,
                                    token: '('
                                });
                            }
                            else if (scriptChr == ')') {
                                addToTokenQueue({
                                    tokenType: kTokenCloseParens,
                                    lineNumber: lineNumber,
                                    token: ')'
                                });
                            }
                            else if (scriptChr == ',') {
                                addToTokenQueue({
                                    tokenType: kTokenComma,
                                    lineNumber: lineNumber,
                                    token: ','
                                });
                            }
                            else if (scriptChr == '?') {
                                addToTokenQueue({
                                    tokenType: kTokenQuestionMark,
                                    lineNumber: lineNumber,
                                    token: '?'
                                });
                            }
                            else if (scriptChr == '0') {
                                numberStr = "0";
                                tokenLineNumber = lineNumber;
                                scriptState = kScriptStateZero;
                            }
                            else if (scriptChr >= '1' && scriptChr <= '9') {
                                numberStr = scriptChr;
                                tokenLineNumber = lineNumber;
                                scriptState = kScriptStateNumerical;
                            }
                            else if (scriptChr == '.') {
                                tokenLineNumber = lineNumber;
                                scriptState = kScriptStatePeriod;
                            }
                            else if (scriptChr == '+') {
                                tokenLineNumber = lineNumber;
                                scriptState = kScriptStatePlus;
                            }
                            else if (scriptChr == '-') {
                                tokenLineNumber = lineNumber;
                                scriptState = kScriptStateMinus;
                            }
                            else if (scriptChr == '&') {
                                tokenLineNumber = lineNumber;
                                scriptState = kScriptStateAnd;
                            }
                            else if (scriptChr == '^') {
                                tokenLineNumber = lineNumber;
                                scriptState = kScriptStateXor;
                            }
                            else if (scriptChr == '|') {
                                tokenLineNumber = lineNumber;
                                scriptState = kScriptStateOr;
                            }
                            else if (scriptChr == '*') {
                                tokenLineNumber = lineNumber;
                                scriptState = kScriptStateTimes;
                            }
                            else if (scriptChr == '=') {
                                tokenLineNumber = lineNumber;
                                scriptState = kScriptStateEquals;
                            }
                            else if (scriptChr == '<') {
                                tokenLineNumber = lineNumber;
                                scriptState = kScriptStateLess;
                            }
                            else if (scriptChr == '>') {
                                tokenLineNumber = lineNumber;
                                scriptState = kScriptStateGreater;
                            }
                            else if (scriptChr == '/') {
                                tokenLineNumber = lineNumber;
                                if 
                                (
                                    (prvNonWhiteScriptChr >= 'a' && prvNonWhiteScriptChr <= 'z')
                                    ||
                                    (prvNonWhiteScriptChr >= '0' && prvNonWhiteScriptChr <= '9')
                                    ||
                                    prvNonWhiteScriptChr == '.'
                                    ||
                                    prvNonWhiteScriptChr == '$'
                                    ||
                                    prvNonWhiteScriptChr == '_'
                                    ||
                                    prvNonWhiteScriptChr == ')'
                                ) {
                                    scriptState = kScriptStateDivide;
                                }
                                else {
                                    regExp = scriptChr;
                                    scriptState = kScriptStateRegExp;
                                }
                            }
                            else if (scriptChr > ' ') {
                                tokenLineNumber = lineNumber;
                                keyword = scriptChr;
                                scriptState = kScriptStateKeyword;
                            }                           
                            break;
                        case kScriptStatePreprocessor:
                            if (scriptChr < ' ') {
                                addToTokenQueue({
                                    tokenType: kTokenPreprocessor,
                                    lineNumber: tokenLineNumber,
                                    token: preprocessorString
                                });
                                preprocessorString = "";
                                scriptState = kScriptStateIdle;
                            }
                            else {
                                preprocessorString += scriptChr;
                            }
                            break;
                        case kScriptStateGreater:
                            if (scriptChr == '=') {
                                addToTokenQueue({
                                    tokenType: kTokenGreaterOrEqual,
                                    lineNumber: lineNumber,
                                    token: '>='
                                });
                                scriptState = kScriptStateIdle;
                            }
                            else if (scriptChr == '>') {
                                scriptState = kScriptStateDoubleGreater;
                            }
                            else {
                                scriptCharsQueuePos--;
                                addToTokenQueue({
                                    tokenType: kTokenGreater,
                                    lineNumber: lineNumber,
                                    token: '>'
                                });
                                scriptState = kScriptStateIdle;
                            }
                            break;
                        case kScriptStateDoubleGreater:
                            if (scriptChr == '=') {
                                addToTokenQueue({
                                    tokenType: kTokenBitShiftRightInTo,
                                    lineNumber: tokenLineNumber,
                                    token: '>>='
                                });
                                scriptState = kScriptStateIdle;
                            }
                            else 
                            {
                                scriptCharsQueuePos--;
                                addToTokenQueue({
                                    tokenType: kTokenBitShiftRight,
                                    lineNumber: tokenLineNumber,
                                    token: '>>'
                                });
                                scriptState = kScriptStateIdle;
                            }
                            break;
                        case kScriptStateLess:
                            if (scriptChr == '=') {
                                addToTokenQueue({
                                    tokenType: kTokenLessOrEqual,
                                    lineNumber: tokenLineNumber,
                                    token: '<='
                                });
                                scriptState = kScriptStateIdle;
                            }
                            else if (scriptChr == '<') {
                                scriptState = kScriptStateDoubleLess;
                            }
                            else {
                                scriptCharsQueuePos--;
                                addToTokenQueue({
                                    tokenType: kTokenLess,
                                    lineNumber: tokenLineNumber,
                                    token: '<'
                                });
                                scriptState = kScriptStateIdle;
                            }
                            break;
                        case kScriptStateDoubleLess:
                            if (scriptChr == '=') {
                                addToTokenQueue({
                                    tokenType: kTokenBitShiftLeftInTo,
                                    lineNumber: tokenLineNumber,
                                    token: '<<='
                                });
                                scriptState = kScriptStateIdle;
                            }
                            else 
                            {
                                scriptCharsQueuePos--;
                                addToTokenQueue({
                                    tokenType: kTokenBitShiftLeft,
                                    lineNumber: tokenLineNumber,
                                    token: '<<'
                                });
                                scriptState = kScriptStateIdle;
                            }
                            break;
                        case kScriptStateEquals:
                            if (scriptChr == '=') {
                                scriptState = kScriptStateDoubleEquals;
                            }
                            else {
                                scriptCharsQueuePos--;
                                addToTokenQueue({
                                    tokenType: kTokenAssign,
                                    lineNumber: tokenLineNumber,
                                    token: '='
                                });
                                scriptState = kScriptStateIdle;
                            }
                            break;
                        case kScriptStateDoubleEquals:
                            if (scriptChr == '=') {
                                addToTokenQueue({
                                    tokenType: kTokenIdentical,
                                    lineNumber: tokenLineNumber,
                                    token: '==='
                                });
                                scriptState = kScriptStateIdle;
                            }
                            else {
                                scriptCharsQueuePos--;
                                addToTokenQueue({
                                    tokenType: kTokenEqual,
                                    lineNumber: tokenLineNumber,
                                    token: '=='
                                });
                                scriptState = kScriptStateIdle;
                            }
                            break;
                        case kScriptStateRegExp:
                            if (scriptChr == '/') {
                                regExp += scriptChr;
                                scriptState = kScriptStateAfterRegExp;
                            }
                            else {
                                regExp += scriptChr;
                                if (scriptChr == '\\') {
                                    scriptState = kScriptStateRegExpBackslash;
                                }
                            }
                            break;
                        case kScriptStateRegExpBackslash: 
                            regExp += scriptChr;
                            scriptState = kScriptStateRegExp;
                            break;
                        case kScriptStateAfterRegExp:
                            if (scriptChr >= 'a' && scriptChr <= 'z') {
                                regExp += scriptChr;
                            }
                            else {
                                scriptCharsQueuePos--;
                                addToTokenQueue({
                                    tokenType: kTokenRegExp,
                                    lineNumber: tokenLineNumber,
                                    token: regExp
                                });
                                regExp = "";
                                scriptState = kScriptStateIdle;
                            }
                            break;
                        case kScriptStatePeriod:
                            if (lastTokenType == kTokenKeyword) {
                                scriptCharsQueuePos--;
                                addToTokenQueue({
                                    tokenType: kTokenPeriod,
                                    lineNumber: tokenLineNumber,
                                    token: '.',
                                });
                                scriptState = kScriptStateIdle;
                            }
                            else if 
                              (
                                  (scriptChr >= '0' && scriptChr <= '9') 
                                  || 
                                  scriptChr == 'e' 
                                  || 
                                  scriptChr == 'E'
                              ) {
                                numberStr += '.' + scriptChr;
                                scriptState = kScriptStateNumerical;
                            }
                            else 
                            {
                                scriptCharsQueuePos--;
                                addToTokenQueue({
                                    tokenType: kTokenPeriod,
                                    lineNumber: tokenLineNumber,
                                    token: '.'
                                });
                                scriptState = kScriptStateIdle;
                            }
                            break;
                        case kScriptStatePlus:
                            if (scriptChr == '+') {
                                addToTokenQueue({
                                    tokenType: kTokenIncrement,
                                    lineNumber: tokenLineNumber,
                                    token: '++'
                                });
                                scriptState = kScriptStateIdle;
                            }
                            else if (scriptChr == '=') {
                                addToTokenQueue({
                                    tokenType: kTokenAddInTo,
                                    lineNumber: tokenLineNumber,
                                    token: '+='
                                });
                                scriptState = kScriptStateIdle;
                            }
                            else if (scriptChr >= '0' && scriptChr >= '9') {
                                numberStr += '+' + scriptChr;
                                scriptState = kScriptStateNumerical;
                            }
                            else 
                            {
                                scriptCharsQueuePos--;
                                addToTokenQueue({
                                    tokenType: kTokenAdd,
                                    lineNumber: tokenLineNumber,
                                    token: '+'
                                });
                                scriptState = kScriptStateIdle;
                            }
                            break;
                        case kScriptStateAnd:
                            if (scriptChr == '&') {
                                scriptState = kScriptStateDoubleAnd;
                            }
                            else if (scriptChr == '=') {
                                addToTokenQueue({
                                    tokenType: kTokenBitAndInTo,
                                    lineNumber: tokenLineNumber,
                                    token: '&='
                                });
                                scriptState = kScriptStateIdle;
                            }
                            else 
                            {
                                scriptCharsQueuePos--;
                                addToTokenQueue({
                                    tokenType: kTokenBitAnd,
                                    lineNumber: tokenLineNumber,
                                    token: '&'
                                });
                                scriptState = kScriptStateIdle;
                            }
                            break;
                        case kScriptStateDoubleAnd:
                            if (scriptChr == '=') {
                                addToTokenQueue({
                                    tokenType: kTokenAndInTo,
                                    lineNumber: tokenLineNumber,
                                    token: '&&='
                                });
                                scriptState = kScriptStateIdle;
                            }
                            else 
                            {
                                scriptCharsQueuePos--;
                                addToTokenQueue({
                                    tokenType: kTokenAnd,
                                    lineNumber: tokenLineNumber,
                                    token: '&&'
                                });
                                scriptState = kScriptStateIdle;
                            }
                            break;
                        case kScriptStateOr:
                            if (scriptChr == '|') {
                                scriptState = kScriptStateDoubleOr;
                            }
                            else if (scriptChr == '=') {
                                addToTokenQueue({
                                    tokenType: kTokenBitOrInTo,
                                    lineNumber: tokenLineNumber,
                                    token: '|='
                                });
                                scriptState = kScriptStateIdle;
                            }
                            else 
                            {
                                scriptCharsQueuePos--;
                                addToTokenQueue({
                                    tokenType: kTokenBitOr,
                                    lineNumber: tokenLineNumber,
                                    token: '|'
                                });
                                scriptState = kScriptStateIdle;
                            }
                            break;
                        case kScriptStateDoubleOr:
                            if (scriptChr == '=') {
                                addToTokenQueue({
                                    tokenType: kTokenOrInTo,
                                    lineNumber: tokenLineNumber,
                                    token: '||='
                                });
                                scriptState = kScriptStateIdle;
                            }
                            else 
                            {
                                scriptCharsQueuePos--;
                                addToTokenQueue({
                                    tokenType: kTokenOr,
                                    lineNumber: tokenLineNumber,
                                    token: '||'
                                });
                                scriptState = kScriptStateIdle;
                            }
                            break;
                        case kScriptStateXor:
                            if (scriptChr == '=') {
                                addToTokenQueue({
                                    tokenType: kTokenBitXorInTo,
                                    lineNumber: tokenLineNumber,
                                    token: '^='
                                });
                                scriptState = kScriptStateIdle;
                            }
                            else 
                            {
                                scriptCharsQueuePos--;
                                addToTokenQueue({
                                    tokenType: kTokenBitXor,
                                    lineNumber: tokenLineNumber,
                                    token: '^'
                                });
                                scriptState = kScriptStateIdle;
                            }
                            break;
                        case kScriptStateTimes:
                            if (scriptChr == '=') {
                                addToTokenQueue({
                                    tokenType: kTokenMultiplyInTo,
                                    lineNumber: tokenLineNumber,
                                    token: '*='
                                });
                                scriptState = kScriptStateIdle;
                            }
                            else 
                            {
                                scriptCharsQueuePos--;
                                addToTokenQueue({
                                    tokenType: kTokenMultiply,
                                    lineNumber: tokenLineNumber,
                                    token: '*'
                                });
                                scriptState = kScriptStateIdle;
                            }
                            break;
                        case kScriptStateDivide:
                            if (scriptChr == '=') {
                                addToTokenQueue({
                                    tokenType: kTokenDivideInTo,
                                    lineNumber: tokenLineNumber,
                                    token: '/='
                                });
                                scriptState = kScriptStateIdle;
                            }
                            else 
                            {
                                scriptCharsQueuePos--;
                                addToTokenQueue({
                                    tokenType: kTokenDivide,
                                    lineNumber: tokenLineNumber,
                                    token: '/'
                                });
                                scriptState = kScriptStateIdle;
                            }
                            break;
                        case kScriptStateMinus:
                            if (scriptChr == '-') {
                                addToTokenQueue({
                                    tokenType: kTokenDecrement,
                                    lineNumber: tokenLineNumber,
                                    token: '--'
                                });
                                scriptState = kScriptStateIdle;
                            }
                            else if (scriptChr == '=') {
                                addToTokenQueue({
                                    tokenType: kTokenSubtractInto,
                                    lineNumber: tokenLineNumber,
                                    token: '-='
                                });
                                scriptState = kScriptStateIdle;
                            }
                            else if (scriptChr >= '0' && scriptChr >= '9') {
                                numberStr += '-' + scriptChr;
                                scriptState = kScriptStateNumerical;
                            }
                            else 
                            {
                                scriptCharsQueuePos--;
                                addToTokenQueue({
                                    tokenType: kTokenSubtract,
                                    lineNumber: tokenLineNumber,
                                    token: '-'
                                });
                                scriptState = kScriptStateIdle;
                            }
                            break;
                        case kScriptStateZero:
                            if 
                              (
                                scriptChr == 'x' 
                                ||
                                scriptChr == 'X'
                              ) {
                                numberStr += scriptChr;
                                scriptState = kScriptStateHexNumber;
                            }
                            else if (scriptChr >= '0' && scriptChr <= '9') {
                                numberStr += scriptChr;
                                scriptState = kScriptStateNumerical;
                            }
                            else {
                                scriptCharsQueuePos--;
                                addToTokenQueue({
                                    tokenType: kTokenNumber,
                                    lineNumber: tokenLineNumber,
                                    token: numberStr
                                });
                                numberStr = "";
                                scriptState = kScriptStateIdle;                                
                            }
                            break;
                        case kScriptStateHexNumber:
                            if 
                              (
                                  (scriptChr >= '0' && scriptChr <= '9') 
                                  || 
                                  (scriptChr >= 'a' && scriptChr <= 'f') 
                                  || 
                                  (scriptChr >= 'A' && scriptChr <= 'F')
                              ) {
                                numberStr += scriptChr;
                            }
                            else {
                                scriptCharsQueuePos--;
                                addToTokenQueue({
                                    tokenType: kTokenNumber,
                                    lineNumber: tokenLineNumber,
                                    token: numberStr
                                });                             
                                numberStr = "";
                                scriptState = kScriptStateIdle;
                            }
                            break;
                        case kScriptStateNumericalExponentNumber:
                            if (scriptChr >= '0' && scriptChr <= '9') {
                                numberStr += scriptChr;
                            }
                            else {
                                scriptCharsQueuePos--;
                                addToTokenQueue({
                                    tokenType: kTokenNumber,
                                    lineNumber: tokenLineNumber,
                                    token: numberStr
                                });
                                numberStr = "";
                                scriptState = kScriptStateIdle;
                            }
                            break;
                        case kScriptStateNumericalExponent:
                            if (scriptChr >= '-' && scriptChr <= '+') {
                                numberStr += scriptChr;
                                scriptState = kScriptStateNumericalExponentNumber;
                            }
                            else if (scriptChr >= '0' && scriptChr <= '9') {
                                numberStr += scriptChr;
                                scriptState = kScriptStateNumericalExponentNumber;
                            }
                            else {
                                scriptCharsQueuePos--;
                                addToTokenQueue({
                                    tokenType: kTokenNumber,
                                    lineNumber: tokenLineNumber,
                                    token: numberStr
                                });
                                numberStr = "";
                                scriptState = kScriptStateIdle;
                            }
                            break;
                        case kScriptStateNumericalMantisse:
                            if (scriptChr >= '0' && scriptChr <= '9') {
                                numberStr += scriptChr;
                            }
                            else if (scriptChr == 'e' || scriptChr == 'E') {
                                numberStr += scriptChr;
                                scriptState = kScriptStateNumericalExponent;
                            }
                            else {
                                scriptCharsQueuePos--;
                                addToTokenQueue({
                                    tokenType: kTokenNumber,
                                    lineNumber: tokenLineNumber,
                                    token: numberStr
                                });
                                numberStr = "";
                                scriptState = kScriptStateIdle;
                            }
                            break;
                        case kScriptStateNumerical:
                            if (scriptChr >= '0' && scriptChr <= '9') {
                                numberStr += scriptChr;
                            }
                            else if (scriptChr == '.') {
                                numberStr += scriptChr;
                                scriptState = kScriptStateNumericalMantisse;
                            }
                            else if (scriptChr == 'e' || scriptChr == 'E') {
                                numberStr += scriptChr;
                                scriptState = kScriptStateNumericalExponent;
                            }
                            else {
                                scriptCharsQueuePos--;
                                addToTokenQueue({
                                    tokenType: kTokenNumber,
                                    lineNumber: tokenLineNumber,
                                    token: numberStr
                                });
                                numberStr = "";
                                scriptState = kScriptStateIdle;
                            }
                            break;
                        case kScriptStateKeyword:
                            if 
                              (
                                  (scriptChr >= 'a' && scriptChr <= 'z') 
                                  || 
                                  (scriptChr >= 'A' && scriptChr <= 'Z') 
                                  || 
                                  (scriptChr >= '0' && scriptChr <= '9') 
                                  || scriptChr == '$' 
                                  || scriptChr == '_'
                              ) {
                                keyword += scriptChr;
                            }
                            else {
                                scriptCharsQueuePos--;
                                addToTokenQueue({
                                    tokenType: kTokenKeyword,
                                    lineNumber: tokenLineNumber,
                                    token: keyword
                                });
                                keyword = "";
                                scriptState = kScriptStateIdle;
                            }
                            break;
                        case kScriptStateDoubleQuote:
                            if (scriptChr == "\"") {
                                addToTokenQueue({
                                    tokenType: kTokenLiteralString,
                                    lineNumber: tokenLineNumber,
                                    token: stringConst
                                });
                                stringConst = "";
                                scriptState = kScriptStateIdle;
                            }
                            else {
                                if (scriptChr == "\\") {
                                    scriptState = kScriptStateDoubleQuoteBackslash;
                                }
                                else {
                                    stringConst += scriptChr;
                                }                                    
                            } 
                            break;
                        case kScriptStateDoubleQuoteBackslash:
                            stringConst += scriptChr;
                            scriptState = kScriptStateDoubleQuote;
                            break;
                        case kScriptStateSingleQuote:
                            if (scriptChr == "'") {
                                addToTokenQueue({
                                    tokenType: kTokenLiteralString,
                                    lineNumber: tokenLineNumber,
                                    token: stringConst
                                });
                                stringConst = "";
                                scriptState = kScriptStateIdle;
                            }
                            else {
                                if (scriptChr == "\\") {
                                    scriptState = kScriptStateSingleQuoteBackslash;
                                }
                                else {
                                    stringConst += scriptChr;
                                }                                    
                            } 
                            break;
                        case kScriptStateSingleQuoteBackslash:
                            stringConst += scriptChr;
                            scriptState = kScriptStateSingleQuote;
                            break;
                    }

                }
                while (false);


            }

            var commentState = kCommentStateIdle;
            var charPos = 0;
            var scriptLength = in_scriptText.length;
            var literalString = "";
            var literalStringLineNumber = 0;
            var lineNumber = 1;
            var seenCrLineEnd = false;
            var prvNonWhiteRawChr = "";
            var rawChr = "";
            var nonWhiteCharOnLineCount = false;

            function processRawScriptChar() {

                if (rawChr > ' ') {
                    prvNonWhiteRawChr = rawChr;
                    seenLineBegin = true;
                }
            
                if (charPos >= scriptLength) {
                    if (scriptCharsQueue.length == 0) {
                        commentState = kCommentStateEOF;
                    }
                }
                else {
                    
                    rawChr = in_scriptText.charAt(charPos);
                    if (rawChr == '\r') {
                        nonWhiteCharOnLineCount = 0;
                        lineNumber++;
                        seenCrLineEnd = true;
                    }
                    else {
                        if (rawChr == '\n') {
                            nonWhiteCharOnLineCount = 0;
                            if (! seenCrLineEnd) {
                                lineNumber++;
                            }
                        }
                        else if (rawChr > ' ') {
                            nonWhiteCharOnLineCount++;
                        }
                        seenCrLineEnd = false;
                    }
                    charPos++;
                }

                switch (commentState) {
                    default:
                        LOG_ERROR("processFilteredScriptChar: unexpected commentState");
                        break;
                    case kCommentStateIdle:
                        if (rawChr == '#' && nonWhiteCharOnLineCount == 1) {
                            commentState = kCommentStateHash;
                            literalString = rawChr;
                            literalStringLineNumber = lineNumber;
                        }
                        else if (rawChr == '/') {
                            commentState = kCommentStateSlash;
                        }
                        else if (rawChr == "\"") {
                            commentState = kCommentStateDoubleQuote;
                            literalStringLineNumber = lineNumber;
                        }
                        else if (rawChr == "'") {
                            commentState = kCommentStateSingleQuote;
                            literalStringLineNumber = lineNumber;
                        }
                        else {
                            addToScriptCharsQueue(rawChr, lineNumber);
                        }
                        break;
                    case kCommentStateHash:
                        if (rawChr == '\n' || rawChr == '\r' || rawChr == '/') {
                            addToScriptCharsQueue(literalString + '\n', literalStringLineNumber);
                            literalString = "";
                            commentState = kCommentStateIdle;
                        }
                        else { 
                            literalString += rawChr;
                            if (rawChr == '"') {
                                commentState = kCommentStateHashDoubleQuoted;
                            }
                            else if (rawChr == '\'') {
                                commentState = kCommentStateHashSingleQuoted;
                            }
                        }
                        break;
                    case kCommentStateHashDoubleQuoted:
                        if (rawChr == '\n' || rawChr == '\r') {
                            addToScriptCharsQueue(literalString + '\n', literalStringLineNumber);
                            literalString = "";
                            commentState = kCommentStateIdle;
                        }
                        else {
                            literalString += rawChr;
                            if (rawChr == '"') {
                                commentState = kCommentStateHash;
                            }
                            else if (rawChr == '\\') {
                                commentState = kCommentStateHashDoubleQuotedBackSlash;
                            }
                        }
                        break;
                    case kCommentStateHashDoubleQuotedBackslash:
                        if (rawChr == '\n' || rawChr == '\r') {
                            addToScriptCharsQueue(literalString + '\n', literalStringLineNumber);
                            literalString = "";
                            commentState = kCommentStateIdle;
                        }
                        else {
                            literalString += rawChr;
                            commentState = kCommentStateHashDoubleQuoted;
                        }
                        break;
                    case kCommentStateHashSingleQuoted:
                        if (rawChr == '\n' || rawChr == '\r') {
                            addToScriptCharsQueue(literalString + '\n', literalStringLineNumber);
                            literalString = "";
                            commentState = kCommentStateIdle;
                        }
                        else {
                            literalString += rawChr;
                            if (rawChr == '"') {
                                commentState = kCommentStateHash;
                            }
                            else if (rawChr == '\\') {
                                commentState = kCommentStateHashSingleQuotedBackSlash;
                            }
                        }
                        break;
                    case kCommentStateHashSingleQuotedBackslash:
                        if (rawChr == '\n' || rawChr == '\r') {
                            addToScriptCharsQueue(literalString + '\n', literalStringLineNumber);
                            literalString = "";
                            commentState = kCommentStateIdle;
                        }
                        else {
                            literalString += rawChr;
                            commentState = kCommentStateHashSingleQuoted;
                        }
                        break;
                    case kCommentStateSlash:
                        if (rawChr == '/') {
                            commentState = kCommentStateSlashSlashComment;
                        }
                        else if (rawChr == '*') {
                            commentState = kCommentStateSlashStarComment;
                        }
                        else if 
                        (
                            (prvNonWhiteRawChr >= 'a' && prvNonWhiteRawChr <= 'z')
                            ||
                            (prvNonWhiteRawChr >= '0' && prvNonWhiteRawChr <= '9')
                            ||
                            prvNonWhiteRawChr == '.'
                            ||
                            prvNonWhiteRawChr == ')'
                        ) {
                            addToScriptCharsQueue("/" + rawChr, lineNumber);
                            commentState = kCommentStateIdle;
                        }
                        else {
                            commentState = kCommentStateRegExp;
                            literalString = "/";
                            charPos--;
                            literalStringLineNumber = lineNumber;
                        }
                        break;
                    case kCommentStateRegExp:
                        if (rawChr == '/') {
                            literalString += rawChr;
                            commentState = kCommentStateAfterRegExp;
                        }
                        else {
                            literalString += rawChr;
                            if (rawChr == '\\') {
                                commentState = kCommentStateRegExpBackslash;
                            }
                        }
                        break;
                    case kCommentStateRegExpBackslash:
                        literalString += rawChr;
                        commentState = kCommentStateRegExp;
                        break;
                    case kCommentStateAfterRegExp:
                        if (rawChr >= 'a' && rawChr <= 'z') {
                            literalString += rawChr;
                        }
                        else {
                            addToScriptCharsQueue(literalString, literalStringLineNumber);
                            literalString = "";
                            charPos--;
                            commentState = kCommentStateIdle;
                        }
                        break;
                    case kCommentStateSlashStarComment:
                        if (rawChr == '*') {
                            commentState = kCommentStateSlashStarCommentStar;
                        }
                        else {
                            addToScriptCharsQueue("/" + rawChr, lineNumber);
                            commentState = kCommentStateIdle;
                        }
                        break;
                    case kCommentStateSlashStarCommentStar:
                        if (rawChr == '/') {
                            commentState = kCommentStateIdle;
                        }
                        break;
                    case kCommentStateSlashSlashComment:
                        if (rawChr < ' ') {
                            commentState = kCommentStateIdle;
                        }
                        break;
                    case kCommentStateDoubleQuote:
                        if (rawChr == "\"") {
                            addToScriptCharsQueue("\"" + literalString + "\"", literalStringLineNumber);
                            literalString = "";
                            commentState = kCommentStateIdle;
                        }
                        else {
                            literalString += rawChr;
                            if (rawChr == "\\") {
                                commentState = kCommentStateDoubleQuoteBackslash;
                            }
                        }
                        break;
                    case kCommentStateDoubleQuoteBackslash:
                        literalString += rawChr;
                        commentState = kCommentStateDoubleQuote;
                        break;
                    case kCommentStateSingleQuote:
                        if (rawChr == "'") {
                            addToScriptCharsQueue("'" + literalString + "'", literalStringLineNumber);
                            literalString = "";
                            commentState = kCommentStateIdle;
                        }
                        else {
                            literalString += rawChr;
                            if (rawChr == "\\") {
                                commentState = kCommentStateSingleQuoteBackslash;
                            }
                        }
                        break;
                    case kCommentStateSingleQuoteBackslash:
                        literalString += rawChr;
                        commentState = kCommentStateSingleQuote;
                        break;
                    case kCommentStateEOF:
                        break;
                }
            }

            while (commentState != kCommentStateEOF) {
                processRawScriptChar();
                processFilteredScriptChar();
                processToken();
            }
        }
        catch (err) {
            LOG_ERROR("compileScript: throws " + err)
        }
    }
    while (false);

    return tokenListToString(tokenQueue);
}
_ESNX_.compiler.compileScript = compileScript;

})();
