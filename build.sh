rm -rf builds/
timestamp=$(date +%Y%m%d%H%M%S)
eas build -p android --profile preview --local --output=builds/TechInsights_${timestamp}.apk
eas build --platform ios --local --output=builds/TechInsights_${timestamp}.ipa
