---
title: 'BeatmaniaIIDX HDD好弟弟折腾笔记：各路问题解决方案合集'
date: 2018-12-26T11:54:29+08:00
lastmod: 2024-05-16T12:45:43+08:00
author: DJ.WH*M
# avatar: /img/author.jpg
referlink: 'https://cowlevel.net/article/2017694'
cover: 'https://media.vgm.io/products/12/10121/10121-1616309197.png'
callout: '这篇文章最近想要再重置一次，受到大佬LR2教学的启发。'
categories:
  - 教程
tags:
  - 奶牛关
  - 音乐游戏/MUG
draft: false
---

> 删掉了所有的废话，想看原文可以去奶牛关。

因为IIDX破解相关内容太过亚逼和零散，国内音游圈因为人少又太过封闭，网上很难找到一篇足够完整的说明。

本文旨在整理自己的折腾过程中积攒的经验，希望可以帮助其他想要玩IIDX的玩家。

理坛反对伸手党，那不好意思，小弟就是要跟他们反着来。

只要我看到评论就会回复，欢迎开放交流。

<!--more-->

IIDX相关科普可以参考[这里](https://wiki.bemani.cc/index.php?title=Beatmania_IIDX%E6%A6%82%E5%86%B5)；谱面黑话暂时只能参考我之前写的[清凉翻译#3](https://shinonome-shizuka.github.io/post/review/game/cowlevel/01/)。

由于我对国内音游圈了解的不多，也不太想深入这个圈子，所以详细的历史相关和人物就不提及，仅仅只锐评游戏。

目前最新版本为IIDX 32 Freelancia，中文音游圈通常可以找到的版本为**最新版本N-1**。

从DMR引用两句话献给所有喜欢硬核音游的玩家：

> You need more practice !
> We respect you !

## HDD如何安装启动

首先，你需要自己寻找HDD的资源，[理科论坛](https://bemani.cc)更容易获得你想要的东西。现在理科论坛已经开放注册（需要绑定手机号）并且限制国内IP访问。

当然，你也可以直接去墙外寻找资源，举几个例子：

- ~~[emuline论坛](https://www.emuline.org/)：目前已经爆炸。~~
- [TP论坛](http://teknoparrot.link.free.fr/)：语言默认法文，自备deepl和gpt。
- [nyaa种子站](https://nyaa.si/)：可以直接搜出相关资源。

**前两天谷歌发邮件给我，说这篇文章里面因为挂了盗版资源的相关链接，所以把这篇文章的搜索索引条目干没了。我因此发现了一个[列表](https://lumendatabase.org/notices/51277639)，里面有大量的海外盗版资源网站，更容易找到我们需要的内容。**

如果你从外国资源网站下载好游戏，你会发现整个压缩包足够“纯净”。IIDX是街机软件，从设计之初就从未考虑过在正常PC上运行。

据我个人经验，IIDX破解最初使用的开源软件是[bemanitools](https://github.com/djhackersdev/bemanitools)，目前仍在更新。

这套组件在集成度和傻瓜度更强的[spicetools](https://github.com/spicetools/spicetools)出现之前，几乎是Bemani系音游破解运行的唯一解。

如果使用`bemanitools`，玩家需要手动配置`ea3-config.xml`和键位绑定，并通过bat文件调用dll现场编译后运行。`ea3-config.xml`暂时没有足够完整的配置文档，本文末尾处附了一段根据自己有限开发经验和试错过程中发现的字段功能，欢迎参考。

如果使用`spicetools`，软件会先读取`ea3-config.xml`的设置，并在此基础上引用软件GUI中的设置的参数启动游戏。软件GUI中的参数修改不会覆盖默认`ea3-config.xml`中原有的内容，而且还提供了各版本通用的patch功能，方便玩家调整自己的游戏功能。

作为一个联网的街机游戏，IIDX如果没有服务端端的配合则无法单独运行，玩家的游戏数据也是保存在服务器端。

所以，你还需要一个可以链接的“Bemani服务器”。正版IIDX通常会连接到Konami的机房，而我们破解佬当然不可能白嫖正版服务器资源，所以我们得自己架设服务器端。尽管说是服务器，实际上就是在你的PC上运行一个程序，并且将游戏联网的地址指向你的本机。

离线服务器有很多，但我只推荐Asphyxia-core。这是最新的模组化地服务器，由内核与插件共同组成。插件支持大量Bemani音游，而且没有功能阉割，甚至可以通过各类虚拟局域网工具让大家一起玩。[内核下载地址](https://asphyxia-core.github.io/)，[IIDX插件下载地址](https://github.com/rumatsuki/iidx-plugin/tree/master)。

IIDX插件需要简单的修改才能支持IIDX30，如果你有Typescript代码知识，很快就能搞定。如果懒得动手，这里也有[修改好的版本](https://github.com/duel0213/asphyxia-plugins)可以下载使用，感谢评论区大兄弟指路。

![img](https://asphyxia-core.github.io/img/core-logo.png)

开发者为了规避Konami的法务铁拳，只提供了Linux和Windows版本可执行文件，另外也提供了额外的ARM架构的源码，理论上可以在绝大多数操作系统中运行。

使用自己架设的服务器只能满足保存数据这一个需求，但整个服务器里只有你一个玩家，也就排行榜这类社交功能统统没法体验。

所以为了让游戏体验更丰富，我们也可以直接连接到第三方提供的私服网络，比如传说中的[arcana.nu](https://arcana.nu)。

最后检查你的电脑设置：

- 使用`3DM游戏运行库安装工具v3.0`，解决运行库问题（IIDX需要VC2010）
- 禁用多余网卡，包括`虚拟网卡`，留一张即可
- 禁用蓝牙
- 在声音面板将“板载声卡输出”设置为`默认设备`或者`你想输出的声音设备`，并选择“允许应用程序独占”
  - 将声源输出设置为CD音质（16bit + 44.1kHz）
  - 禁用多余声音设备
- 禁用多余显卡，IIDX没有自动识别多屏的能力
- 禁用摄像头，IIDX启动时会自动检测，或者前往[这里](https://mon.im/bemanipatcher/)打上禁用摄像头的补丁
  - 非必须，打上补丁可以减少启动检测所需的时长
  - 如果使用`spicetools`可以直接在软件中设置，需等待开发者适配游戏版本
- 修改`iidxhook.conf`，使窗口化运行时可以调整游戏显示的位置
  - 如果使用`spicetools`可以在设置里面勾选相关配置
- 修改防火墙配置，以免被程序识别为未联网
  - 将`launcher.exe`设置为以管理员身份运行，并允许通过防火墙
  - 如果使用`spicetools`则设置`spice64.exe`允许通过防火墙
- 检查`ea3_config.xml`中的`<Network>`网络配置
  - 联网（使用第三方服务器）：请参考A网、理网的设置方法
    - 填写`pcb-id`及对应的`<Network>`信息
    - 务必填写私服中自己申请到的`pcb-id`，否则会被拒绝访问
  - 本地：启动离线服务器，`<Network>`指向`localhost`及对应端口
- 启动游戏
  - `开始游戏\Start\Run\etc.bat`
  - `spice64.exe`

## HDD黑话解释

**好弟弟**：HDD的“中文版”，Hard Disk Data，指代的是经过破解之后可以直接在一般PC上运行的街机程序，其实就是常说的硬盘版，据说最佳体验是在XP PE系统专机。

**理科**：有可能指代Bemanicn论坛管理员Richard_di，同时根据字面意义延伸指代整个非法Bemani相关资源的下载、运行、联网等等。

**理网**：Bemanicn提供的国内街机e-amusement联网服务。

**理台**：指连接到国内e-amusement网络的机台，可以使用老版的e-pass卡，目前和BJMANIA完成了合并，两者互通paseli账号。

**A网**：指邀请制网站`arcana.nu`，提供国内外非正版街机的联网服务，支持所有bemani系列游戏，一般支持**N-1**版本。

**ea3-config.xml**：前缀为`e-amusement v3`的缩写 ~~（大概）~~，是IIDX HDD运行环境的主要设置文件，beatmania tools的核心文件，游戏无法运行基本上都是这里出了问题。

**pcbid**：机台基板ID，类似网卡的MAC地址，IIDX联网时需要作为身份标示，唯一。

**离线服务器**：由于IIDX默认会访问服务器检测，不联网游戏则无法运行，所以需要架设本地服务器，伪造e-amusement服务器正在维护中的效果。

**ICC**：e-pass卡模拟器，全写目前不明。

**PIN**：e-pass卡的四位密码，正常情况可以在可乐妹官网设置。

**ea-emu**：一个离线服务器，只支持到IIDX 18。

## 补充

### 刷卡的方法

设置键位绑定时，找到设置栏中标有`1P\2P Card`或者类似含义字眼的位置，绑定“刷卡键”。

Bemani游戏使用的IC卡存档都有`NFC识别码`和`卡号`，识别码正常情况下必须刷卡之后才能读取到，但由于我们是破解版，所以我们可以手填一个甚至不存在的识别码。

在游戏根目录位置新建TXT文件，写入卡片的NFC识别码并存储为**card0.txt（1P）**或者**card1.txt（2P）**，如果使用`spicetools`可以直接在GUI中配置。

启动游戏后按下刷卡键，如果你的识别码符合要求，游戏会把你的卡号显示在屏幕上，则需要记录下卡号。如果你输入的是实体卡的识别码，那么游戏显示的卡号一定是卡片背面的卡号。

登陆A网之后，将识别码和卡号都输入卡片管理的位置，系统就会将你识别为此卡片对应玩家数据的拥有者。

之后每次刷卡只需要输入第一次刷卡时设置的密码即可使用。

### 升级包的使用

下载版本更新的压缩包前需检查自己当前的版本号，检查方法看下面。只有配合的版本号才能使用升级压缩包，一般情况下会覆盖一部分dll文件。

更新包主要更新的内容为：

- bm2dx.dll
- 文件夹
  - prof
  - data

其他文件均可无视。覆盖更新包之后可能会改变`ea3-config.xml`的设置，需要重新填写，否则无法使用网络的刷卡功能。

如果使用spicetools则不用调整。

### XML文档的部分意义

这里只写有必要管的部分。

XML文档入门：欢迎查看[菜鸟教程](https://www.runoob.com/xml/xml-tutorial.html)

```xml
<!-- ea3-config.xml -->

    ea3/timezone
    <!-- 时区，秒为单位，offset -->

    ea3/id/pcbid
    <!-- 基版ID，可以在spicetools中直接设置 -->
                  
    ea3/soft/model
    <!-- 框体类型，可以在spicetools中直接设置 -->

    ea3/soft/ext              
    <!-- 版本号，一般是更新或者实装的时间，半年更新一次 -->

    ea3/network/timeout
    <!-- 联网超时的时间 -->

    ea3/network/service
    <!-- 联网的地址，一般是A网或者理网，可以在spicetools中直接设置 -->

    ea3/option/service
    <!-- 是否联网，默认值1 -->

    ea3/opiton/posevent
    <!-- 是否开启活动，默认值0 -->

    ea3/option/pcbevent
    <!-- 是否开启单机活动，默认值1 -->

    ea3/option/bookkeeping
    <!-- 否开启预定功能，国内没用，默认值0 -->

    ea3/option/autofactory
    <!-- 是否开启自动恢复出厂设置，默认值1 -->

<!-- coin.xml -->

    coin/free
    <!-- 免费游玩开启时需要的硬币 -->
    
    coin/event
    <!-- 是否开启活动，默认值0，需要与上面的统一 -->
    
    coin/pp_event
    <!-- 是否开启高级游玩时的活动，默认值0，需要与上面的统一 -->
```

当游戏无法启动时，查看加载日志，spicetools会自动输出一个logs.txt，根据其中的报错信息反查XML相关部分，就可以大概知道问题出在何处。

例如：

```plain text
ea3-pos: ea3_posev_init: reading opt file failed
```

此处检查`ea3-config.xml`中`ea3/option/posevnt`及其他`event`设置，全部设置为`1`之后即可正常启动。有时此错误会因为dev文件夹被占用而出现，删除文件夹重新运行即可。

如果遇到nvram错误，可以将预编译的文件全部删除，替换为[链接](https://1drv.ms/u/s!AmteDcWaA0g7dbL028G87xfOkcI?e=x4OImq)中的文件尝试一下。

由于iidx研发设计时没有考虑兼容性，所以xml文件可能会出现编码错误导致读失败的问题，可以使用vscode等现代文本编辑器来解决。

另外spicetools有时会遇到d3d9的相关错误导致音画掉帧错位，此问题通常与Windows系统有关。如果是spicetools可以直接把对应的文件放入`content/api/cpp/spiceapi`文件夹。
