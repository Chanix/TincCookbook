# 介绍

　　本教程是一本关于 tinc VPN 的实操指南，记录了作者几年来使用 tinc 的经验、教训和建议，可作为 tinc 入门参考和快速指南。



　　您可以在这里发现本教程的最新版本：https://chanix.github.io/TincCookbook




# 作者序

　　*谨以此文献给我的家人，感谢一直以来对我的容忍和支持。我不擅长表达，在这里说声谢谢，或许未来他们能够知道。*



　　在工作和生活中，我有将不同地点和网络环境的设备连接在一起，形成虚拟专有网络（VPN）的需要：

	希望能进行异地之间数据的交换（远程办公，远程访问家庭NAS，远程备份……）；
	希望安全的连接，不用担心隐私和数据的泄露；
	希望能简化安全和网络配置，不用考虑各台设备所处环境的区别；
	希望尽可能的降低搭建和运维成本，最好是折腾完了就扔一边不用管；
	希望尽可能的简单快捷，在下不是IT科班出身，太深奥的东西理解不了；

　　经过比较和测试，最终选择了 tinc 作为虚拟专有网络的实现工具。目前搭建的几个 tinc 网络已经稳定运行了超过3年+。在实际操作中，遇到了不少问题踩了不少坑，相对小众所以资料也不多。因此我将相关的经验和文档整理了一下，形成本教程，作为个人使用 tinc 的总结和备忘。同时也公开分享出来，如果能为您答疑解惑，将不胜荣幸。

　　本教程针对非专业人士，重点在于实操。作为读者，您不需要是专业IT人员，但需对网络有基本的了解并有一定的动手能力。本教程重点在于如何快捷的使用 tinc，而不是对其原理和源码深入的剖析和讲解。作者试图让您在读完本教程后，拥有快速搭建和管理 tinc 网络的能力。换句话说，如果完成一件事有很多种方法，本教程只会告诉你一个经过作者验证和总结的方法（可能最笨但确保实用），不会教你”茴香“的”茴“有九种写法。

　　本教程的目的在于让一个具有网络使用和电脑使用经验的**文科生**在**半小时内**搭建完成自己的 tinc 网络。如果您遇到了困难和麻烦，那一定是本教程写的还不够清晰明了，请及时反馈，这是我逐步修改和完善的动力和方向。





# 相关内容
- 本书源码仓库：https://github.com/Chanix/TincCookbook
- tinc 官网：https://www.tinc-vpn.org
- tinc 源码仓库：https://github.com/gsliepen/tinc



# 转载注意事项

　　本教程采用 [Creative Commons BY-NC-ND 4.0（自由转载-保持署名-非商用-禁止演绎）](http://creativecommons.org/licenses/by-nc-nd/4.0/deed.zh) 协议发布，可以在非商业的前提下免费转载，但同时**必须**：

- 保持文章原文，不作修改。
- 明确署名，即至少注明 `作者：Chanix` 字样以及文章的原始链接，且不得使用 `rel="nofollow"` 标记。
- 商业用途请点击最下面图片联系本人。
- 微信公众号转载一律不授权 `原创` 标志。