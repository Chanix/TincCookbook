# 配置/交换密钥

所谓配置，就是理解 tinc 的配置规范，建立好相应的目录和相应的文件。

所谓交换密钥，就是在进行连接的主机配置目录中，添加对应的主机描述文件。





　　tinc 的配置方式是通过一套目录和其中的文件（以下简称为**配置主目录**）来完成的，配置主目录中按规范存放一系列子目录和文件。



　　tinc 的配置主目录默认值为 /etc/tinc （Unix-like OS）或 C:\Program Files\tinc （Windows OS）。

　　配置主目录下，每个子目录是以该目录名为名称的 VPN 网络的配置目录（以下简称为 **网络配置目录**）。每个网络配置目录，指定了该网络的相关配置。tinc 实例启动时接受参数来指定要启动的网络，并定位到对应的网络配置目录读取配置。



每个网络配置目录中，都有以下内容：

- tinc.conf

　　主配置文件，其中的内容指定了该网络下 tinc 的配置 。其中的 Name 说明本主机名称，ConnectTo 指定启动后要自动连接的主机（可以多个）。

- tinc-up、tinc-down

　　脚本文件，这两个脚本是在 tinc 启动和关闭该网络时被调用。一般用来设置虚拟网卡的IP、路由。
　　如果是 Unix-like 系统，需要有运行权限，如果是 Windows 系统，则需要增加 “.bat”后缀，即 “tinc-up.bat” 和 “tinc-down.bat”。

- rsa_key.priv

　　RSA 私钥文件，存放本主机的 RSA 私钥；

- hosts 子目录
　　主机描述文件存放目录。其中的每一个文件描述了一台主机的信息，文件名与主机名保持一致。



以在下笔记本上的 tinc 配置举栗：

```
$TINC_CONFIG_DIR         (配置主目录：/etc/tinc 或 C:\Program Files\tinc )
│
├── vpn_home            （第一个 VPN 的网络配置目录，目录名和网络名保持一致，为 vpn_home）
│   ├── hosts
│   │   ├── tinc_ecs    （主机 tinc_ecs 的描述文件）
│   │   └── notebook    （主机 notebook 的描述文件）
│   ├── rsa_key.priv    （本主机的 RSA 私钥）
│   ├── tinc.conf       （tinc 主配置文件）
│   ├── tinc-down       （当关闭 vpn_home 时，执行该脚本）
│   └── tinc-up	        （当启动 vpn_home 时，执行该脚本）
│
└── vpn_work            （第二个 VPN 的网络配置目录，目录名和网络名保持一致，为 vpn_work）
    ├── hosts
    │   ├── server      （主机 server 的描述文件）
    │   └── notebook    （主机 notebook 的描述文件）
    ├── rsa_key.priv    （本主机的 RSA 私钥）
    ├── tinc.conf       （tinc 主配置文件）
    ├── tinc-down       （当关闭 vpn_work 时，执行该脚本）
    └── tinc-up         （当启动 vpn_work 时，执行该脚本）
```

　　在这个示例中，主机上共配置了两个VPN，*vpn_home* 和 *vpn_work*。每个网络的配置都是在配置主目录下的一个子目录，子目录名称和网络名称一致。



以 vpn_home 中的主机 notebook 为例：

tinc.conf
```
# 本主机名称
Name = notebook

# 指定启动时自动连接的主机。
# 可以使用多个ConnectTo来自动连接多个主机。
# 也可以没有，等待其他主机发起连接。
ConnectTo = tinc_ecs
```



tinc-down

```
#!/bin/sh

# 关闭虚拟网卡
ifconfig $INTERFACE down
```



tinc-up

```
#!/bin/sh

# 启用虚拟网卡，并设置其 IP 为 10.0.0.100，子网掩码为 255.255.255.0
ifconfig $INTERFACE 10.0.0.100 netmask 255.255.255.0
```



hosts/tinc_ecs

```
# tinc_ecs 是一台公网机器，公网IP为 111.222.333.444
Address = 111.222.333.444

# tinc_ecs 的 VPN 内部 IP 为 10.0.0.1
# /32 说明其为一台机器而不是子网（普通用户直接用 /32 就可以了）
Subnet = 10.0.0.1/32

-----BEGIN RSA PUBLIC KEY-----
......
......
......
-----END RSA PUBLIC KEY-----
```
hosts/notebook

```
# notebook 是移动办公的笔记本，没有公网IP，所以没有 Address 这一行。
# notebook 的 VPN 内部 IP 为 10.0.0.100，这里要和 tinc-up 里面设定的一致。
# /32 说明其为一台机器而不是子网（普通用户直接用 /32 就可以了）
Subnet = 10.0.0.100/32

-----BEGIN RSA PUBLIC KEY-----
......
......
......
-----END RSA PUBLIC KEY-----
```



