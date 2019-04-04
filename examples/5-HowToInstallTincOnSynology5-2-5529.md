为了在外面也能方便的访问到家里NAS上的数据，这次折腾是将群晖也通过 tinc 连入我自己的 vnet34。毕竟群晖已经服役有一段时间了，里面存了不少数据，怕出意外不敢直接搞。所以特意安装了个黑群晖虚拟机，在这台虚拟机上进行安装和测试。具体的黑群晖安装过程，请移步这个帖子 http://www.meishixiazheteng.com/thread-4-1-1.html。

群晖DSM从本质上说就是个 Linux 的定制包。接上面安装的那个帖子，打开SSH以后，通过SSH登录到群晖上。登录名用“root”，密码就是安装群晖时输入的管理员帐号的密码。

最正统和彻底的做法是下载 tinc 的源代码，然后在群晖上进行编译。登录到群晖上，先看看系统版本吧。
uname -a
复制代码
嗯，gcc 4.7.3 编译的，核心版本是 3.10.35，x86_64位版本，支持 SMP（多CPU），交叉编译出来的。再看看 gcc
gcc
-ash: gcc: not found
复制代码
呃……没有安装 gcc，难道要自己建  ToolChain 么？想想就头大，什么工具啊、库啊、头文件啊、交叉编译啊、冲突啊……折腾是要折腾，但是这种折腾有点浪费生命的感觉了……

既然，群晖DSM是 Linux，又跑在 x86_64 的虚拟机上，那找一个已经编译好的，复制过去应该也能用啊，没必要啥都自己从头编译吧。嗯，感觉走得通，试试吧。

从安装 Ubuntu Server 16.04.4 64bit 的虚拟机上下载 /usr/sbin/tincd，复制到黑群晖上，按照群晖DSM的存放规范，放到 /usr/sbin/tincd，然后记得 chmod +x /usr/sbin/tincd，赋予其可执行权限。嘿嘿嘿，应该搞定了吧。测试一下看看：
tincd --help
tincd error while loading shared libraries: libcrypto.so.1.0.0: cannot open shared object file: No such file or directory
复制代码
嗯？缺库文件？到 /lib 和 /lib64 看看，的确没有。到 Ubuntu 里找这个东东：
locate libcrypto.so.1.0.0
/lib/x86_64-linux-gnu/libcrypto.so.1.0.0
复制代码
OK，同样下载下来，按照群晖DSM的的存放规范，放到 /lib64，再执行：
tincd --help
Usage: tincd [option]...

  -c, --config=DIR               Read configuration options from DIR.
  -D, --no-detach                Don't fork and detach.
  -d, --debug[=LEVEL]            Increase debug level or set it to LEVEL.
  -k, --kill[=SIGNAL]            Attempt to kill a running tincd and exit.
  -n, --net=NETNAME              Connect to net NETNAME.
  -K, --generate-keys[=BITS]     Generate public/private RSA keypair.
  -L, --mlock                    Lock tinc into main memory.
      --logfile[=FILENAME]       Write log entries to a logfile.
      --pidfile=FILENAME         Write PID to FILENAME.
  -o, --option=[HOST.]KEY=VALUE  Set global/host configuration value.
  -R, --chroot                   chroot to NET dir at startup.
  -U, --user=USER                setuid to given USER at startup.
      --help                     Display this help and exit.
      --version                  Output version information and exit.

Report bugs to tinc@tinc-vpn.org.
复制代码
吼吼，执行成功，然后参照 http://www.meishixiazheteng.com/thread-1-1-1.html 里 Ubuntu 的那段，进行配置文件夹的配置就好了。具体配置过程就不多说了。然后再 tincd -n vnet34，和原来VPN里面的机器能互相  ping 通，相互之间数据传输，复制文件啥的也没问题。
VPN调通了，但这次是手工启动的，不可能以后每次都要手工启动一次。所以需要将启动命令设置 为开机自动启动，随系统启动而启动。这样即使NAS关机或者重启，也能自动加入到 VPN 中。群晖DSM开机自启程序的做法可以参照这个帖子 http://www.meishixiazheteng.com/thread-5-1-1.html。我用的是第二种方法，即 /usr/syno/etc/rc.d/S99tinc.sh，文件内容为 “/usr/sbin/tincd -n vnet34”，记得不要忘记 “chmod +x /usr/syno/etc/rc.d/S99tinc.sh”。


总结：这个是取巧的办法，思路是：既然黑群晖运行在 x86_64 的虚拟机上，而它本质上是个 Linux，所以复制一个对应环境已编译好的 Linux 版本，应能正确运行。这个做法在PC架构（x86）的群晖DSM上理论上是可以走通的，但如果设备不是的话，例如是 ARM 架构，可能会有点问题。如果有这种设备的话可以下载对应架构版本的 tincd 来试试。再不行，估计也只能搭建交叉编译环境，自己编译了。

我把从 Ubuntu 复制下来的文件打了包放到附件里了，有需要的自便。