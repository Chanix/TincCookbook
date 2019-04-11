# 1. 核心主机 / Ubuntu Server 16.04

　　本节我们将配置核心主机，这是一台购买的阿里云主机。这台核心主机的 tinc 作为服务自动启动，启动后等待其他主机来连接，其他所有的主机都配置为主动连接核心主机。核心主机负责处理其他主机的认证和必要的中继转发。




详细配置与 VPN 设置：

| 项目 | 数据 |
| --------   | -----   |
| 硬件配置     | 1核 1GB 20G云盘　|
| 带宽流量     | 固定带宽 1m/s　|
| 操作系统     | Ubuntu 16.04　|
| 公网 IP      | 111.111.111.111　|
| 内网 IP      | 222.222.222.222　|
|  |   |
| VPN 网络名称  | home_vpn　|
| VPN 主机名称  | tinc_ali　|
| VPN IP       | 10.0.0.254　|
| VPN 子网掩码  | 255.255.255.0　|
| VPN CIDR     | 10.0.0.254/24　|
| tinc 端口     | 655(默认)　|

*注意：云主机一般都配有防火墙（默认可能没有开放 655 端口）。您需要打开 TCP/UDP 协议的 655 端口以供 tinc 使用。具体请参阅阿里云或者您提供商的文档。*



## 安装 tinc

登录服务器，进入终端。阿里云的安装镜像不是最新的，建议先将系统升级到最新状态。下面的这行命令将更新软件列表，升级到最新版本并自动删除不再使用的软件包：

```
sudo apt-get update && sudo apt-get upgrade -y && sudo apt-get dist-upgrade -y && sudo apt-get autoremove -y
```
然后安装 tinc：
```
sudo apt-get install tinc -y
```

好了，安装完成。tinc 的默认主配置目录为 /etc/tinc，现在这个目录里面只有一个文件 nets.boot。

```

>which tincd
/usr/sbin/tincd

>tincd --version
tinc version 1.0.26 (built Jul  5 2015 23:17:56, protocol 17)
Copyright (C) 1998-2015 Ivo Timmermans, Guus Sliepen and others.
See the AUTHORS file for a complete list.

tinc comes with ABSOLUTELY NO WARRANTY.  This is free software,
and you are welcome to redistribute it under certain conditions;
see the file COPYING for details.

>ls /etc/tinc
nets.boot

>cat /etc/tinc/nets.boot
## This file contains all names of the networks to be started on system startup.

```



## 创建配置文件

1.建立网络配置目录（网络名称为 *home_vpn*）：

```
sudo mkdir -p /etc/tinc/home_vpn/hosts
```



2.建立配置文件 tinc.conf

```
sudo vi /etc/tinc/home_vpn/tinc.conf
```
编辑 tinc.conf 内容如下：
```
Name = tinc_ali
```

由于本主机为核心主机，只负责等待和认证其他主机的连接。因此，本主机没有配置 ConnectTo。



3.建立启动和关闭脚本
创建启动脚本 tinc-up

```
sudo vi /etc/tinc/home_vpn/tinc-up
```
编辑 tinc-up 内容如下：
```
#!/bin/sh

ifconfig $INTERFACE 10.0.0.254 netmask 255.255.0.0
```
创建启动脚本 tinc-down

```
sudo vi /etc/tinc/home_vpn/tinc-down
```
编辑 tinc-down 内容如下：
```
#!/bin/sh

ifconfig $INTERFACE down
```
赋予脚本可执行权限：
```
sudo chmod +x /etc/tinc/home_vpn/tinc-up
sudo chmod +x /etc/tinc/home_vpn/tinc-down
```



4.创建本主机描述文件（网络名称为 *tinc_ali*）

```
sudo vi /etc/tinc/home_vpn/hosts/tinc_ali
```

编辑 tinc_ali 内容如下：

```
Address = 111.111.111.111
Subnet = 10.0.0.254/32
```

其中 Address 指明公网地址，告诉其他主机怎么连接核心主机。Subnet 中 “10.0.0.254” 是本主机的 VPN IP，“/32”说明是本主机的一台普通类型的主机。不了解没关系，先这么写，以后可以参阅进阶进一步学习。



## 生成密钥
执行 tincd 生成脚本， -n 指定网络名称，-K 指明生成密钥，可以在 -K 后以数字指定密钥长度，普通用途用默认值（2048）即可。命令执行过程中，需要指定文件名，不用管直接两次回车用默认值即可。
```
sudo tincd -n home_vpn -K
```

运行完成以后，会生成私钥文件 /etc/tinc/home_vpn/rsa_key.priv，并在本主机的描述文件中增加公钥。



查看私钥文件：

```
cat /etc/tinc/home_vpn/rsa_key.priv 
```
/etc/tinc/home_vpn/rsa_key.priv 内容类似下面这样，“*-----BEGIN RSA PRIVATE KEY-----*” 和 “*-----END RSA PRIVATE KEY-----*” 之间是本机私钥，这个文件的内容注意保密不要泄露。

```
-----BEGIN RSA PRIVATE KEY-----
...
...
...
-----END RSA PRIVATE KEY-----
```


查看本主机描述文件内容：

```
cat /etc/tinc/home_vpn/hosts/tinc_ali 
```
可以看到这个文件的内容发生了变化。在原来编辑的两行后增加了 “*-----BEGIN RSA PUBLIC KEY-----*” 和 “*-----END RSA PUBLIC KEY-----*” 之间的内容，这段内容是本主机的公钥。

```
Address = 111.111.111.111
Subnet = 10.0.0.254/32

-----BEGIN RSA PUBLIC KEY-----
...
...
...
-----END RSA PUBLIC KEY-----
```

*注：如果您正在设置您的主机，请记得将上面 111.111.111.111 修改为您主机的公网 IP。*



## 交换密钥

由于我们这里配置的是 VPN 里第一台主机，还没有其他主机连接进来。所以交换密钥先略过了，等后面加入其他主机的时候再进行。



## 设为自启

　　Ubuntu 中，安装了 tinc 软件包即安装了 tinc 服务。系统启动后会自动运行这个服务，其读取 /etc/tinc/nets.boot 的内容来确定启动哪些 VPN。也就是说，如果想自动启动某个 VPN，只需将编辑该文件，加入 VPN 的网络名称即可。这样每次机器重启后会自动启动 home_vpn。也可以 sudo service tinc start、sudo service tinc stop 等命令来手工控制服务。

编辑/etc/tinc/nets.boot：

```
sudo vi /etc/tinc/nets.boot
```

在文件末尾加上一行：

```
home_vpn
```

重启系统：

```
sudo reboot
```

重启完成后，可以用下列命令来查看进程：

```
ps -efa | grep tinc
```





## 测试

由于我们这里配置的是 VPN 里第一台主机，还没有其他主机连接进来。所以测试先略过了，等后面加入其他主机的时候再进行。

现在，我们可以先 ping 自己，看看虚拟网卡是否已经启动并绑定了指定的地址：

```
ping -c 5 10.0.0.254 
```



## 完成

核心主机的安装配置过程大概就是这样。由于是第一台主机，所以交换密钥和测试都略过了。截止目前，我们拥有了第一台 tinc VPN 主机。这台主机暂时孤独的运行在互联网上，等待其他 VPN 主机的连接。

