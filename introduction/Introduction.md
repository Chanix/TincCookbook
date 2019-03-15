# tinc 简介

　　tinc VPN 虚拟专有网络（VPN）的实现软件，以 GNU 协议发布并开源。其通过隧道及加密技术在互联网上点与点之间创建专有网络。tinc 工作在 IP 层，所以可以像普通的网络设备那样，不需要去适配其他已经存在的软件。可以安全的在点与点之间进行数据传输，无需担心数据泄露。其优势在于：

*《TODO》这里以后逐项进行解释，现在列一下就好了，目标用户并不会太关心。*

- 加密 / 认证 / 压缩

- 自动分布式网状路由

- 支持NAT，内网穿透

- 易于扩展网络节点

- 支持以太网络桥接

- 跨平台，支持 IPv6

  

<!--分布式的，基于网状结构的网络路由，基于P2P的技术，可以实现流量直接到达目标机器，而不像传统VPN 那样必须经过中间的服务端。-->

<!--When one introduces encryption, we can form a true VPN. Other people may see encrypted traffic, but if they don’t know how to decipher it (they need to know the key for that), they cannot read the information that flows through the VPN. This is what tinc was made for.-->





注：

与tinc类似的软件还有 N2N、PeerVPN、ZeroTire等