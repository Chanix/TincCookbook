# Main config

#### 4.4.1 Main configuration variables

- AddressFamily = <ipv4|ipv6|any> (any)

  This option affects the address family of listening and outgoing sockets. If any is selected, then depending on the operating system both IPv4 and IPv6 or just IPv6 listening sockets will be created.

- BindToAddress = <address> [<port>] [experimental]

  If your computer has more than one IPv4 or IPv6 address, tinc will by default listen on all of them for incoming connections. Multiple BindToAddress variables may be specified, in which case listening sockets for each specified address are made.If no port is specified, the socket will be bound to the port specified by the Port option, or to port 655 if neither is given. To only bind to a specific port but not to a specific address, use "*" for the address.This option may not work on all platforms.

- BindToInterface = <interface> [experimental]

  If you have more than one network interface in your computer, tinc will by default listen on all of them for incoming connections. It is possible to bind tinc to a single interface like eth0 or ppp0 with this variable.This option may not work on all platforms.

- Broadcast = <no | mst | direct> (mst) [experimental]

  This option selects the way broadcast packets are sent to other daemons. *NOTE: all nodes in a VPN must use the same Broadcast mode, otherwise routing loops can form.*noBroadcast packets are never sent to other nodes.mstBroadcast packets are sent and forwarded via the VPN’s Minimum Spanning Tree. This ensures broadcast packets reach all nodes.directBroadcast packets are sent directly to all nodes that can be reached directly. Broadcast packets received from other nodes are never forwarded. If the IndirectData option is also set, broadcast packets will only be sent to nodes which we have a meta connection to.

- ConnectTo = <name>

  Specifies which other tinc daemon to connect to on startup. Multiple ConnectTo variables may be specified, in which case outgoing connections to each specified tinc daemon are made. The names should be known to this tinc daemon (i.e., there should be a host configuration file for the name on the ConnectTo line).If you don’t specify a host with ConnectTo, tinc won’t try to connect to other daemons at all, and will instead just listen for incoming connections.

- DecrementTTL = <yes | no> (no) [experimental]

  When enabled, tinc will decrement the Time To Live field in IPv4 packets, or the Hop Limit field in IPv6 packets, before forwarding a received packet to the virtual network device or to another node, and will drop packets that have a TTL value of zero, in which case it will send an ICMP Time Exceeded packet back.Do not use this option if you use switch mode and want to use IPv6.

- Device = <device> (/dev/tap0, /dev/net/tun or other depending on platform)

  The virtual network device to use. Tinc will automatically detect what kind of device it is. Under Windows, use Interface instead of Device. Note that you can only use one device per daemon. See also [Device files](https://www.tinc-vpn.org/documentation/Device-files.html#Device-files).

- DeviceType = <type> (platform dependent)

  The type of the virtual network device. Tinc will normally automatically select the right type of tun/tap interface, and this option should not be used. However, this option can be used to select one of the special interface types, if support for them is compiled in.dummyUse a dummy interface. No packets are ever read or written to a virtual network device. Useful for testing, or when setting up a node that only forwards packets for other nodes.raw_socketOpen a raw socket, and bind it to a pre-existing Interface (eth0 by default). All packets are read from this interface. Packets received for the local node are written to the raw socket. However, at least on Linux, the operating system does not process IP packets destined for the local host.multicastOpen a multicast UDP socket and bind it to the address and port (separated by spaces) and optionally a TTL value specified using Device. Packets are read from and written to this multicast socket. This can be used to connect to UML, QEMU or KVM instances listening on the same multicast address. Do NOT connect multiple tinc daemons to the same multicast address, this will very likely cause routing loops. Also note that this can cause decrypted VPN packets to be sent out on a real network if misconfigured.uml (not compiled in by default)Create a UNIX socket with the filename specified by Device, or /var/run/netname.umlsocket if not specified. Tinc will wait for a User Mode Linux instance to connect to this socket.vde (not compiled in by default)Uses the libvdeplug library to connect to a Virtual Distributed Ethernet switch, using the UNIX socket specified by Device, or /var/run/vde.ctl if not specified.Also, in case tinc does not seem to correctly interpret packets received from the virtual network device, it can be used to change the way packets are interpreted:tun (BSD and Linux)Set type to tun. Depending on the platform, this can either be with or without an address family header (see below).tunnohead (BSD)Set type to tun without an address family header. Tinc will expect packets read from the virtual network device to start with an IP header. On some platforms IPv6 packets cannot be read from or written to the device in this mode.tunifhead (BSD)Set type to tun with an address family header. Tinc will expect packets read from the virtual network device to start with a four byte header containing the address family, followed by an IP header. This mode should support both IPv4 and IPv6 packets.utun (OS X)Set type to utun. This is only supported on OS X version 10.6.8 and higher, but doesn’t require the tuntaposx module. This mode should support both IPv4 and IPv6 packets.tap (BSD and Linux)Set type to tap. Tinc will expect packets read from the virtual network device to start with an Ethernet header.

- DirectOnly = <yes|no> (no) [experimental]

  When this option is enabled, packets that cannot be sent directly to the destination node, but which would have to be forwarded by an intermediate node, are dropped instead. When combined with the IndirectData option, packets for nodes for which we do not have a meta connection with are also dropped.

- Forwarding = <off|internal|kernel> (internal) [experimental]

  This option selects the way indirect packets are forwarded.offIncoming packets that are not meant for the local node, but which should be forwarded to another node, are dropped.internalIncoming packets that are meant for another node are forwarded by tinc internally.This is the default mode, and unless you really know you need another forwarding mode, don’t change it.kernelIncoming packets are always sent to the TUN/TAP device, even if the packets are not for the local node. This is less efficient, but allows the kernel to apply its routing and firewall rules on them, and can also help debugging.

- GraphDumpFile = <filename> [experimental]

  If this option is present, tinc will dump the current network graph to the file filename every minute, unless there were no changes to the graph. The file is in a format that can be read by graphviz tools. If filename starts with a pipe symbol |, then the rest of the filename is interpreted as a shell command that is executed, the graph is then sent to stdin.

- Hostnames = <yes|no> (no)

  This option selects whether IP addresses (both real and on the VPN) should be resolved. Since DNS lookups are blocking, it might affect tinc’s efficiency, even stopping the daemon for a few seconds every time it does a lookup if your DNS server is not responding.This does not affect resolving hostnames to IP addresses from the configuration file, but whether hostnames should be resolved while logging.

- IffOneQueue = <yes|no> (no) [experimental]

  (Linux only) Set IFF_ONE_QUEUE flag on TUN/TAP devices.

- Interface = <interface>

  Defines the name of the interface corresponding to the virtual network device. Depending on the operating system and the type of device this may or may not actually set the name of the interface. Under Windows, this variable is used to select which network interface will be used. If you specified a Device, this variable is almost always already correctly set.

- KeyExpire = <seconds> (3600)

  This option controls the time the encryption keys used to encrypt the data are valid. It is common practice to change keys at regular intervals to make it even harder for crackers, even though it is thought to be nearly impossible to crack a single key.

- LocalDiscovery = <yes | no> (no) [experimental]

  When enabled, tinc will try to detect peers that are on the same local network. This will allow direct communication using LAN addresses, even if both peers are behind a NAT and they only ConnectTo a third node outside the NAT, which normally would prevent the peers from learning each other’s LAN address.Currently, local discovery is implemented by sending broadcast packets to the LAN during path MTU discovery. This feature may not work in all possible situations.

- MACExpire = <seconds> (600)

  This option controls the amount of time MAC addresses are kept before they are removed. This only has effect when Mode is set to "switch".

- MaxTimeout = <seconds> (900)

  This is the maximum delay before trying to reconnect to other tinc daemons.

- Mode = <router|switch|hub> (router)

  This option selects the way packets are routed to other daemons.routerIn this mode Subnet variables in the host configuration files will be used to form a routing table. Only unicast packets of routable protocols (IPv4 and IPv6) are supported in this mode.This is the default mode, and unless you really know you need another mode, don’t change it.switchIn this mode the MAC addresses of the packets on the VPN will be used to dynamically create a routing table just like an Ethernet switch does. Unicast, multicast and broadcast packets of every protocol that runs over Ethernet are supported in this mode at the cost of frequent broadcast ARP requests and routing table updates.This mode is primarily useful if you want to bridge Ethernet segments.hubThis mode is almost the same as the switch mode, but instead every packet will be broadcast to the other daemons while no routing table is managed.

- Name = <name> [required]

  This is a symbolic name for this connection. The name must consist only of alphanumeric and underscore characters (a-z, A-Z, 0-9 and _).If Name starts with a $, then the contents of the environment variable that follows will be used. In that case, invalid characters will be converted to underscores. If Name is $HOST, but no such environment variable exist, the hostname will be read using the gethostname() system call.

- PingInterval = <seconds> (60)

  The number of seconds of inactivity that tinc will wait before sending a probe to the other end.

- PingTimeout = <seconds> (5)

  The number of seconds to wait for a response to pings or to allow meta connections to block. If the other end doesn’t respond within this time, the connection is terminated, and the others will be notified of this.

- PriorityInheritance = <yes|no> (no) [experimental]

  When this option is enabled the value of the TOS field of tunneled IPv4 packets will be inherited by the UDP packets that are sent out.

- PrivateKey = <key> [obsolete]

  This is the RSA private key for tinc. However, for safety reasons it is advised to store private keys of any kind in separate files. This prevents accidental eavesdropping if you are editing the configuration file.

- PrivateKeyFile = <path> (/etc/tinc/netname/rsa_key.priv)

  This is the full path name of the RSA private key file that was generated by ‘tincd --generate-keys’. It must be a full path, not a relative directory.

- ProcessPriority = <low|normal|high>

  When this option is used the priority of the tincd process will be adjusted. Increasing the priority may help to reduce latency and packet loss on the VPN.

- Proxy = socks4 | socks5 | http | exec ... [experimental]

  Use a proxy when making outgoing connections. The following proxy types are currently supported:socks4 <address> <port> [<username>]Connects to the proxy using the SOCKS version 4 protocol. Optionally, a username can be supplied which will be passed on to the proxy server.socks5 <address> <port> [<username> <password>]Connect to the proxy using the SOCKS version 5 protocol. If a username and password are given, basic username/password authentication will be used, otherwise no authentication will be used.http <address> <port>Connects to the proxy and sends a HTTP CONNECT request.exec <command>Executes the given command which should set up the outgoing connection. The environment variables `NAME`, `NODE`, `REMOTEADDRES` and `REMOTEPORT` are available.

- ReplayWindow = <bytes> (16)

  This is the size of the replay tracking window for each remote node, in bytes. The window is a bitfield which tracks 1 packet per bit, so for example the default setting of 16 will track up to 128 packets in the window. In high bandwidth scenarios, setting this to a higher value can reduce packet loss from the interaction of replay tracking with underlying real packet loss and/or reordering. Setting this to zero will disable replay tracking completely and pass all traffic, but leaves tinc vulnerable to replay-based attacks on your traffic.

- StrictSubnets = <yes|no> (no) [experimental]

  When this option is enabled tinc will only use Subnet statements which are present in the host config files in the local /etc/tinc/netname/hosts/ directory. Subnets learned via connections to other nodes and which are not present in the local host config files are ignored.

- TunnelServer = <yes|no> (no) [experimental]

  When this option is enabled tinc will no longer forward information between other tinc daemons, and will only allow connections with nodes for which host config files are present in the local /etc/tinc/netname/hosts/ directory. Setting this options also implicitly sets StrictSubnets.

- UDPRcvBuf = <bytes> (OS default)

  Sets the socket receive buffer size for the UDP socket, in bytes. If unset, the default buffer size will be used by the operating system.

- UDPSndBuf = <bytes> Pq OS default

  Sets the socket send buffer size for the UDP socket, in bytes. If unset, the default buffer size will be used by the operating system.

- 