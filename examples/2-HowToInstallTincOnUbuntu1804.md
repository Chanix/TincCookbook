# 2. 台式机主机 / Ubuntu Server 18.04

　　本节我们配置台式机，并将其加入到 VPN 中，完成后，整个 VPN 内将有两台机器。这台机器位于杂物房，通过路由器连入互联网。



VPN 设置：

| 项目         | 数据            |
| ------------ | --------------- |
| VPN 网络名称 | home_vpn        |
| VPN 主机名称 | desktop        |
| VPN IP       | 10.0.0.100      |
| VPN 子网掩码 | 255.255.255.0   |
| VPN CIDR     | 10.0.0.100/24   |
| tinc 端口    | 655(默认)       |



## 安装 tinc

　　Ubuntu 系列的安装都差不多，均通过包管理器 apt 进行，不再赘述。其实其他的 Linux 发行版也差不多，只是包管理器的差异，tinc 在流行的发行版中一般都有预编译版本。

　　登录服务器，进入终端：

```
sudo apt-get update && sudo apt-get upgrade -y && sudo apt-get dist-upgrade -y && sudo apt-get autoremove -y && sudo apt-get install tinc -y
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
Name = desktop
ConnectTo = tinc_alil
```

指明本主机的主机名为 desktop。注意这里多了一行 ConnectTo，这行 ConnectTo 指定启动时，自动连接上一节我们配置好的核心主机 tinc_ali。



3.建立启动和关闭脚本
创建启动脚本 tinc-up

```
sudo vi /etc/tinc/home_vpn/tinc-up
```

编辑 tinc-up 内容如下：

```
#!/bin/sh

ifconfig $INTERFACE 10.34.34.100 netmask 255.255.0.0
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



4.创建本主机描述文件（网络名称为 *desktop*）

```
sudo vi /etc/tinc/home_vpn/hosts/desktop
```

编辑 tinc_ali 内容如下：

```
Subnet = 10.0.0.100/32
```

与核心主机比较，desktop 没有公网IP，所以没有 Address 这一行。Subnet 中 “10.0.0.100” 是本主机的 VPN IP，“/32”说明是本主机的一台普通类型的主机。不了解没关系，先这么写，以后可以参阅进阶进一步学习。



## 生成密钥

执行 tincd 生成脚本， -n 指定网络名称，-K 指明生成密钥，可以在 -K 后以数字指定密钥长度，普通用途用默认值（2048）即可。命令执行过程中，需要指定文件名，不用管直接两次回车用默认值即可。

```
sudo tincd -n home_vpn -K
```

运行完成以后，会生成私钥文件 /etc/tinc/home_vpn/rsa_key.priv，并更新本主机的描述文件 /etc/tinc/home_vpn/hosts/desktop。



## 交换密钥

之前有提到，tinc 的加密和认证需要公钥文件，需要通讯的双方主机都有对方的公钥。所以我们要确保核心主机和本主机都有对方的主机描述文件。

将本主机的 /etc/tinc/home_vpn/hosts/desktop 复制到核心主机的同样位置。

复制核心主机的 /etc/tinc/home_vpn/hosts/tinc_ali 到本主机的同样位置。



## 设为自启

编辑/etc/tinc/nets.boot，加入 VPN 的网络名称 home_vpn，然后重启系统。

```
sudo echo -e "home_vpn\n" >> /etc/tinc/nets.boot
sudo reboot
```





## 测试

重启完成后，通过 ping 来验证网络是否互通。

在 desktop 上

```
ping -c 10.0.0.254
```
在 tinc_ali 上

```
ping -c 10.0.0.100
```

OK，如无意外的话，都能ping通。如果ping不通，请检查双方，尤其是 tinc_ali 的防火墙设置是否正确。



## 完成

到这里，我们的VPN有了两台机器。分别是 tinc_ali 和 desktop。这两台机器现在可以互相通讯，而不用关心各自的网络环境。

