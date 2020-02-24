
# Sourcetrail Extenstion for VS Code

This extension enables VS Code to communicate with [Sourcetrail](http://sourcetrail.com)

## Links
* Project Home, News: [www.sourcetrail.com](https://www.sourcetrail.com/) 
* Documentation: [www.sourcetrail.com/documentation](https://www.sourcetrail.com/documentation/#VsCode) 
* Download, Reviews: [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=astallinger.sourcetrail)
* Code, Issues: [GitHub](http://github.com/CoatiSoftware/vsce-sourcetrail.git) 

## Features

> Settings for the Plugin

![Settings](images/vsce-sourcetrail1.png)

> Send Location from VS Code to Sourcetrail via context menu

![Context](images/vsce-sourcetrail2.png)

> Display if the plugin is connected to Sourcetrail. Sourcetrail will be displayed if the TCP Server is running.

![Statusbar](images/vsce-sourcetrail3.png)

## Requirements

Plugin and Sourcetrail should be able to communicate over TCP

## Extension Settings

This extension contributes the following settings:

* `sourcetrail.pluginPort`: port VS Code listens to
* `sourcetrail.sourcetrailPort`: port Sourcetrail listens to
* `sourcetrail.ip`: TCP server ip address
* `sourcetrail.startServerAtStartup`: set to `true` to start the TCP listener at VS Code startup

