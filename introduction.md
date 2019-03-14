# tinc 简介

Tinc is a Virtual Private Network (VPN) daemon that uses tunneling and encryption to create a secure private network between hosts on the Internet.

Because the tunnel appears to the IP level network code as a normal network device, there is no need to adapt any existing software. The encrypted tunnels allows VPN sites to share information with each other over the Internet without exposing any information to others.

This document is the manual for tinc. Included are chapters on how to configure your computer to use tinc, as well as the configuration process of tinc itself.





I really don’t quite remember what got us started, but it must have been Guus’ idea. He wrote a simple implementation (about 50 lines of C) that used the ethertap device that Linux knows of since somewhere about kernel 2.1.60. It didn’t work immediately and he improved it a bit. At this stage, the project was still simply called "vpnd".

Since then, a lot has changed—to say the least.





Tinc now supports encryption, it consists of a single daemon (tincd) for both the receiving and sending end, it has become largely runtime-configurable—in short, it has become a full-fledged professional package.









Tinc also allows more than two sites to connect to eachother and form a single VPN. Traditionally VPNs are created by making tunnels, which only have two endpoints. Larger VPNs with more sites are created by adding more tunnels. Tinc takes another approach: only endpoints are specified, the software itself will take care of creating the tunnels. This allows for easier configuration and improved scalability.

A lot can—and will be—changed. We have a number of things that we would like to see in the future releases of tinc. Not everything will be available in the near future. Our first objective is to make tinc work perfectly as it stands, and then add more advanced features.

Meanwhile, we’re always open-minded towards new ideas. And we’re available too.



vpn

A Virtual Private Network or VPN is a network that can only be accessed by a few elected computers that participate. This goal is achievable in more than just one way.





Private networks can consist of a single stand-alone Ethernet LAN. Or even two computers hooked up using a null-modem cable. In these cases, it is obvious that the network is *private*, no one can access it from the outside. But if your computers are linked to the Internet, the network is not private anymore, unless one uses firewalls to block all private traffic. But then, there is no way to send private data to trusted computers on the other end of the Internet.





This problem can be solved by using *virtual* networks. Virtual networks can live on top of other networks, but they use encapsulation to keep using their private address space so they do not interfere with the Internet. Mostly, virtual networks appear like a single LAN, even though they can span the entire world. But virtual networks can’t be secured by using firewalls, because the traffic that flows through it has to go through the Internet, where other people can look at it.

As is the case with either type of VPN, anybody could eavesdrop. Or worse, alter data. Hence it’s probably advisable to encrypt the data that flows over the network.

When one introduces encryption, we can form a true VPN. Other people may see encrypted traffic, but if they don’t know how to decipher it (they need to know the key for that), they cannot read the information that flows through the VPN. This is what tinc was made for.