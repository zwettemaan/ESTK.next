export INDESIGN_NAME="Adobe InDesign CC 2018"
export curDir=`dirname "$0"`
cd "$curDir"
export curDir=`pwd`
if [ ! -d "$curDir/ESTK.cmd/AdobeExtendScript.framework" ]; then
	cp -R "/Applications/$INDESIGN_NAME/$INDESIGN_NAME.app/Contents/Frameworks/AdobeExtendScript.framework" "$curDir/ESTK.cmd"
fi
if [ ! -d "$curDir/ESTK.cmd/AdobeScCore.framework" ]; then
	cp -R "/Applications/$INDESIGN_NAME/$INDESIGN_NAME.app/Contents/Frameworks/AdobeScCore.framework" "$curDir/ESTK.cmd"
fi