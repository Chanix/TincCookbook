# 5. 群晖 / Synology 5.2 5529

　　我有一台群辉放在房间的角落里，用来集中存储家庭照片和视频。为了在外面也能方便的访问到家里 NAS上 的数据，将群晖也通过 tinc 连入 home_vpn。我的群晖是 x86 配置的，运行的操作系统为群辉 DSM 5.2 5529。可以理解为一台运行群晖 DSM 的定制 PC 机。DSM 从本质上说就是个 Linux 的定制包，因此可以类比 Linux 去理解和操作。



VPN 设置：

| 项目         | 数据          |
| ------------ | ------------- |
| VPN 网络名称 | home_vpn      |
| VPN 主机名称 | notebook      |
| VPN IP       | 10.0.0.101    |
| VPN 子网掩码 | 255.255.255.0 |
| VPN CIDR     | 10.0.0.101/24 |
| tinc 端口    | 655(默认)     |



## 安装 tinc

　　截止本章截稿，群辉官方商店中没有找到 tinc，需自行安装。最正统和彻底的做法是下载 tinc 的源代码，然后在群晖上进行编译。但这么做的话，群辉默认没有所需的工具链，需要先下载和配置一堆东西（内核、头文件、编译器、编译工具……），这显然超出了本教程的范围。所以我用了一个取巧的办法：复制一个能用的版本。

　　用 SSH 登录到群晖上（登录名为“root”，密码就是安装群晖时输入的管理员帐号的密码），查看一下相关信息，确认该版本的群辉 DSM 用 gcc 4.7.3 编译的，核心版本是 3.10.35，x86_64位版本，支持 SMP（多CPU）。

```
　　从 Ubuntu Server 16.04 系统中复制 /usr/sbin/tincd，复制到群晖上，按群晖 DSM的存放规范，放到 /usr/sbin/tincd，然后记得 chmod +x /usr/sbin/tincd，赋予其可执行权限。

　　从 Ubuntu Server 16.04 系统中复制 /lib/x86_64-linux-gnu/libcrypto.so.1.0.0，按群晖 DSM 的的存放规范，放到 /lib64。
```


　　这个是取巧的办法，思路是：既然群晖运行在 x86_64 上，本质上是个 Linux，所以复制一个对应环境已编译好的 Linux 版本，应能正确运行。

　　我将需要复制的文件打了个压缩包，可以 [点这里下载](./assets/tincd_UbuntuServer_16.04.4_64bit.zip) 。



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
Name = nas
ConnectTo = tinc_ali
```

指明本主机的主机名为 nas。ConnectTo 指定启动时，自动连接核心主机 tinc_ali。



3.建立启动和关闭脚本
创建启动脚本 tinc-up

```
sudo vi /etc/tinc/home_vpn/tinc-up
```

编辑 tinc-up 内容如下：

```
#!/bin/sh

ifconfig $INTERFACE 10.0.0.103 netmask 255.255.0.0
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



4.创建本主机描述文件（主机名称为 *nas*）

```
sudo vi /etc/tinc/home_vpn/hosts/nas
```

编辑 nas 内容如下：

```
Subnet = 10.0.0.103/32
```



## 生成密钥

执行 tincd 生成脚本， -n 指定网络名称，-K 指明生成密钥，可以在 -K 后以数字指定密钥长度，普通用途用默认值（2048）即可。命令执行过程中，需要指定文件名，不用管直接两次回车用默认值即可。

```
sudo tincd -n home_vpn -K
```

运行完成以后，会生成私钥文件 /etc/tinc/home_vpn/rsa_key.priv，并更新本主机的描述文件 /etc/tinc/home_vpn/hosts/nas。



## 交换密钥

之前有提到，tinc 的加密和认证需要公钥文件，需要通讯的双方主机都有对方的公钥。所以我们要确保核心主机和本主机都有对方的主机描述文件。

将本主机的 /etc/tinc/home_vpn/hosts/nas 复制到核心主机的同样位置。

复制核心主机的 /etc/tinc/home_vpn/hosts/tinc_ali 到本主机的同样位置。



## 设为自启

　　在 /usr/syno/etc/rc.d/ 下新建一个文件 S99tinc.sh，文件内容为 “/usr/sbin/tincd -n home_vpn”，记得不要忘记 “chmod +x /usr/syno/etc/rc.d/S99tinc.sh”。



重启系统：

```
sudo reboot
```



## 测试

重启完成后，通过 ping 来验证网络是否互通。

在 desktop 上：

```
ping -c 10.0.0.254
```

在 tinc_ali 上：

```
ping -c 10.0.0.103
```

如果您是严格按照教程做，无意外的话已经能相互 ping 通了。如果ping不通，请检查双方，尤其是 tinc_ali 的防火墙设置是否正确。



## 完成

