# Script

Apart from reading the server and host configuration files, tinc can also run scripts at certain moments. Below is a list of filenames of scripts and a description of when they are run. A script is only run if it exists and if it is executable.

Scripts are run synchronously; this means that tinc will temporarily stop processing packets until the called script finishes executing. This guarantees that scripts will execute in the exact same order as the events that trigger them. If you need to run commands asynchronously, you have to ensure yourself that they are being run in the background.

Under Windows (not Cygwin), the scripts must have the extension .bat.

- /etc/tinc/netname/tinc-up

  This is the most important script. If it is present it will be executed right after the tinc daemon has been started and has connected to the virtual network device. It should be used to set up the corresponding network interface, but can also be used to start other things.Under Windows you can use the Network Connections control panel instead of creating this script.

- /etc/tinc/netname/tinc-down

  This script is started right before the tinc daemon quits.

- /etc/tinc/netname/hosts/host-up

  This script is started when the tinc daemon with name host becomes reachable.

- /etc/tinc/netname/hosts/host-down

  This script is started when the tinc daemon with name host becomes unreachable.

- /etc/tinc/netname/host-up

  This script is started when any host becomes reachable.

- /etc/tinc/netname/host-down

  This script is started when any host becomes unreachable.

- /etc/tinc/netname/subnet-up

  This script is started when a subnet becomes reachable. The Subnet and the node it belongs to are passed in environment variables.

- /etc/tinc/netname/subnet-down

  This script is started when a subnet becomes unreachable.





The scripts are started without command line arguments, but can make use of certain environment variables. Under UNIX like operating systems the names of environment variables must be preceded by a $ in scripts. Under Windows, in .bat files, they have to be put between % signs.

- `NETNAME`

  If a netname was specified, this environment variable contains it.

- `NAME`

  Contains the name of this tinc daemon.

- `DEVICE`

  Contains the name of the virtual network device that tinc uses.

- `INTERFACE`

  Contains the name of the virtual network interface that tinc uses. This should be used for commands like ifconfig.

- `NODE`

  When a host becomes (un)reachable, this is set to its name. If a subnet becomes (un)reachable, this is set to the owner of that subnet.

- `REMOTEADDRESS`

  When a host becomes (un)reachable, this is set to its real address.

- `REMOTEPORT`

  When a host becomes (un)reachable, this is set to the port number it uses for communication with other tinc daemons.

- `SUBNET`

  When a subnet becomes (un)reachable, this is set to the subnet.

- `WEIGHT`

  When a subnet becomes (un)reachable, this is set to the subnet weight.