# 配置

>本节简要说明了 tinc 配置文件的基本规则，包括命名规范和常用参数。并提供了最最基本的配置模板下载，结合自身情况稍作修改即可使用。

默认情况下，tinc以 /etc/tinc 作为配置文件根目录。Windows 上是 prog/x86。tinc支持多VPN，可以通过运行多个实例的方式来加入多个tinc网络。每个tinc网络之间，用网络名称（net_name）来区分，可以使用 a-z 这些字符。配置主目录下，每个子目录为一个tinc网络的配置文件，目录名称同网络名称一致。

tinc有着自己的配置文件结构、可配置项丰富。对于普通用户，使用基本的默认值就可以了，可以点这里下载。这里是最基本的tinc网络的配置文件模板。您可以下载本教程的最简模板，修改一下即可使用。

如果有进一步的需求，请参阅官网或者本手册的进阶部分以获得更进一步的信息。

tinc 基本配置文件说明：

tinc 的配置文件一般是一个目录，由一系列文件组成。一个最简单的配置目录结构是酱紫的（括号里面的是注释和说明）：



注意：脚本需要可执行的权限。对于 Unix Like 系统，需要 chmod+x，对于windows系统，需要增加 “.bat”后缀名。

```
$TINC_CONFIG_DIR
     └── NETNAME_1 （tinc 网络的名称，在启动 tinc 的时候作为标识）
     		├── hosts （放置本节点要连接到的各节点的基本配置信息）
     		│   ├── HOST_1 （主机1的配置文件）
     		│   ├── HOST_2 （主机2的配置文件）
     		│   ├── ...
     		│   └── HOST_n （节点n的配置文件）
     		├── rsa_key.priv （由 tincd 生成的本主机使用的非对称私钥，加密通讯使用）
     		├── tinc.conf （tinc 网络的配置文件）
	 		├── tinc-down （关闭该网络时，会调用执行的脚本，可选）
	 		└── tinc-up （启动该网络时，会调用执行的脚本，可选）
```

最简单的配置文件是酱紫的

tinc.conf

```
Name = node_010_034_034_102
AddressFamily = ipv4
Cipher = aes-256-cbc
Digest = SHA512
#Interface = /dev/tap0
Device = /dev/tap0

Port = 34

Compression = 11

ConnectTo = node_010_034_000_001

```

rsa_key.priv

tinc-down

```
#!/bin/sh

ifconfig $INTERFACE down
```

tinc-up

```
#!/bin/sh

#ifconfig $INTERFACE up
ifconfig $INTERFACE 10.34.34.102 netmask 255.255.0.0
```

/hosts/自己节点的描述文件和要connectto的主机描述文件。

