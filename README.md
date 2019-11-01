# Temperature Converter [<img align="right" src=".github/fxaddon.png">](https://addons.mozilla.org/en-CA/firefox/addon/temperature-converter-tool/)
Nearly half of the world’s population has access to the internet from hundreds of countries. The internet is the largest global knowledge base and community, but some users may have issues with measurement units that are not commonly used in their region. In order to fully appreciate and comprehend the countless amounts of data that are displayed on the World Wide Web, users need to see these measurements in units which they can fully understand and relate to.

The most common measurement which internet users like to see converted to their local unit is temperature. People frequently find a need to convert between Celsius and Fahrenheit. To do so, they will often resort to an online temperature conversion website.

But what if there was a way to convert your temperatures directly from Firefox? Well now there is!

The Temperature Converter is the first Firefox add-on that allows you go quickly convert onscreen temperatures without any external navigation. Simply highlight the temperature with the mouse cursor and use the convenient context menu button to display the temperature in either Celsius or Fahrenheit.

## Development
This repository contains all of the required source code files to make changes to this extension. The "master" branch contains the source code for the latest stable release. If you want to test that version, you can view the release section to download the XPI file or visit the add-on listing on Mozilla.

If you want to make changes to this extension, you are welcome to do so. All files for the extension are located in the "firefox" folder. The source code of upcoming versions (if any) will be located in another branch.

To develop and test the extension, you need to open the "about:debugging" page in Firefox and select "Load Temporary Add-on". Then you can select any file within the "firefox" folder of this repository.

Further documentation about developing Firefox extensions can be found [here](https://developer.mozilla.org/docs/Mozilla/Add-ons/WebExtensions/Your_first_WebExtension).

## Release Notes
### Version 2.0
* **[NEW]** Temperatures are automatically converted when a website loads [(more details)](https://github.com/WesleyBranton/Temperature-Converter/wiki/Automatic-temperature-converting)

### Version 1.3.1
* **[NEW]** Added error message icons
* **[NEW]** Added usage instructions
* **[NEW]** Added release notes
* **[FIXED]** Fixed decimal detection issue

### Version 1.3
See version 1.3.1 release notes

### Version 1.2
* **[NEW]** Digit separator for large conversions
* **[NEW]** User add-on review reminder system
* **[FIXED]** Code optimization

### Version 1.1
* **[CHANGED]** Moved error messages to Firefox notifications so that they are not as intrusive
* **[CHANGED]** Error messages are more detailed
* **[FIXED]** Extension now outputs the same number of decimals as the original selection
