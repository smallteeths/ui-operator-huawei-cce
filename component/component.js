/*!!!!!!!!!!!Do not change anything between here (the DRIVERNAME placeholder will be automatically replaced at buildtime)!!!!!!!!!!!*/
import ClusterDriver from 'shared/mixins/cluster-driver';

// do not remove LAYOUT, it is replaced at build time with a base64 representation of the template of the hbs template
// we do this to avoid converting template to a js file that returns a string and the cors issues that would come along with that
const LAYOUT;
/*!!!!!!!!!!!DO NOT CHANGE END!!!!!!!!!!!*/


/*!!!!!!!!!!!GLOBAL CONST START!!!!!!!!!!!*/
// EMBER API Access - if you need access to any of the Ember API's add them here in the same manner rather then import them via modules, since the dependencies exist in rancher we dont want to expor the modules in the amd def
const computed     = Ember.computed;
const observer     = Ember.observer;
const get          = Ember.get;
const set          = Ember.set;
const setProperties= Ember.setProperties;
const alias        = Ember.computed.alias;
const service      = Ember.inject.service;
const EmberPromise = Ember.RSVP.Promise;
const all          = Ember.RSVP.all;
const next         = Ember.run.next;
const equal        = Ember.computed.equal;
const reject       = Ember.RSVP.reject;

/*!!!!!!!!!!!GLOBAL CONST END!!!!!!!!!!!*/

const languages = {
  'en-us':   {"clusterNew":{"huaweicce":{"label":"Huawei Cloud Container Engine","shortLabel":"Huawei CCE","name":{"label":"Cluster Name","required":"Cluster name is required.","minLengthError":"Cluster name cannot be less than 4 bytes"},"access":{"title":"Account Access","detail":"Choose the region and API Key that will be used to launch Huawei Cloud Container Engine."},"accessKey":{"label":"Access Key","placeholder":"Your Huawei access key","help":"You can find instructions on how to create Access Key <a href=\"https://support.huaweicloud.com/usermanual-ca/zh-cn_topic_0046606340.html\" target=\"_blank\">here</a>."},"secretKey":{"label":"Secret Key","placeholder":"Your Huawei secret key","help":"You can find instructions on how to obtain Secret Key <a href=\"https://support.huaweicloud.com/usermanual-ca/zh-cn_topic_0046606340.html\" target=\"_blank\">here</a>."},"projectId":{"label":"Project Id","placeholder":"Your CCE project id","help":"You can find instructions on how to obtain Project Id <a href=\"https://support.huaweicloud.com/usermanual-ca/zh-cn_topic_0046606344.html\" target=\"_blank\">here</a>.","required":"Project Id is required."},"region":{"label":"Region","helpText":"You can find instructions on how to obtain Region <a href=\"https://developer.huaweicloud.com/endpoint\" target=\"_blank\">here</a>.","required":"Region is required.","cn_north_1":"CN North-Beijing1","cn_north_4":"CN North-Beijing4","cn_east_3":"CN East-Shanghai1","cn_east_2":"CN East-Shanghai2","cn_south_1":"CN South-Guangzhou","cn_southwest_2":"CN Southwest-Guiyang1","ap_southeast_1":"AP-Hong-Kong","ap_southeast_2":"AP-Bangkok","ap_southeast_3":"AP-Singapore","af_south_1":"AF-Johannesburg","sa_brazil_1":"LA-Sao Paulo1","la_south_2":"LA-Santiago"},"business":{"label":"Business"},"checkAccount":"Next: Configure cluster","checkingAccount":"Authenticating...","configureNode":"Next: Configure Node","configuringNode":"Configuring...","clusterOption":{"title":"Cluster Options","detail":"Customize the cluster that will be used to launch Huawei Cloud Container Engine."},"clusterType":{"label":"Cluster Type","VirtualMachine":{"label":"VirtualMachine"},"BareMetal":{"label":"BareMetal"},"ARM64":{"label":"ARM64"}},"clusterFlavor":{"label":"Cluster Flavor"},"masterVersion":{"label":"Master Version","warningNotRecommend":"“{version}”，This version of Huawei CCE is not recommended. For details, see huawei official documents.","warningRacher":"“{version}”，This version is not supported by Rancher, please upgrade rancher version for reference","warningRancherTip":"Rancher supported versions."},"vpcId":{"label":"VPC Name"},"subnetId":{"label":"Subnet Name","none":"No subnet in this VPC"},"highwaySubnet":{"label":"Highway Subnet","placeholder":"Highway Subnet","none":"No Highway Subnet can be used"},"nodeOption":{"title":"Nodes","detail":"Customize the nodes that will be used to launch Huawei Cloud Container Engine."},"dataVolumeType":{"label":"Data Volume Type"},"dataVolumeSize":{"label":"Data Volume Size","placeholder":"Disk Capacity: 100 to 32768"},"volumetype":{"SAS":"SAS","SSD":"SSD","SATA":"SATA","GPSSD":"GPSSD"},"description":{"label":"Description","placeholder":"e.g. Cluster for Huawei CCE"},"eipBandwidthSize":{"label":"Eip Bandwidth Size"},"eipChargeMode":{"label":"Eip Charge Mode"},"eipCount":{"label":"Eip Count"},"availableZone":{"label":"Zone"},"billingMode":{"label":"Billing Mode","payPerUse":"Pay-per-use","yearly":"Yearly/Monthly"},"containerNetworkCidr":{"label":"Container Network Cidr","placeholder":"e.g. 172.16.0.0/16","none":"No config","cidrFormatError":"\"Container Network Cidr\" format error"},"containerNetworkMode":{"label":"Container Network Mode","none":"No config","overlay":{"label":"overlay_l2"},"underlayIpvlan":{"label":"underlay_ipvlan"},"vpcRouter":{"label":"vpc-router"}},"rootVolumeType":{"label":"Root Volume Type"},"rootVolumeSize":{"label":"Root Volume Size","placeholder":"Disk Capacity: 40 to 1024"},"nodeCount":{"label":"Node Count"},"nodeFlavor":{"label":"Node Flavor"},"ssh":{"label":"SSH Key Name"},"eip":{"label":"Eip"},"eipSelection":{"none":"Disabled","new":"Create Eip","exist":"Select Existed Eip"},"eipIds":{"label":"Eip","none":"No available Eip","countError":"The count of selected or created must be equal to the count of nodes"},"eipType":{"label":"Eip Type"},"clusterLabels":{"label":"Cluster Label","none":"No label"},"nodeLabels":{"label":"Node Label"},"clusterEipId":{"label":"Cluster Eip","prompt":"Choose a Eip...","required":"Cluster Eip is required"},"vipSubnetId":{"label":"ELB subnet","prompt":"Choose a subnet..."},"externalServerEnabled":{"label":"External Server","enabled":"Enabled - Only support in intranet","disabled":"Disabled - Setup cce cluster in the same vpc as Rancher server"},"highAvailability":{"label":"High Availability"},"managementScale":{"label":"Management Scale count"},"nodeOperationSystem":{"label":"Node Operation System"},"authenticatingProxyCa":{"label":"Certificate"},"validityPeriod":{"label":"Validity Period"},"bmsIsAutoRenew":{"label":"Auto Renew"},"loginMode":{"label":"Login Mode","password":"Password","keyPair":"Key Pair"},"password":{"label":"Password","placeholder":"Please enter password"},"userName":{"label":"User Name"},"authentiactionMode":{"label":"Authentiaction Mode","rbac":"RBAC","authenticating_proxy":"Authenticating Proxy"},"eipShareType":{"label":"EIP Share Type"},"generic":{"mbitS":"Mbit/s","isRequired":"is required"}}}},
  'zh-hans': {"clusterNew":{"huaweicce":{"label":"华为云容器引擎","shortLabel":"Huawei CCE","name":{"label":"集群名称","required":"集群名称必须填写","minLengthError":"集群名称不能小于4字节"},"access":{"title":"帐户访问","detail":"选择用于启动华为云容器引擎的区域和API KEY。"},"accessKey":{"label":"访问密钥ID","placeholder":"CCE访问密钥ID","help":"创建访问密钥ID参考<a href=\"https://support.huaweicloud.com/usermanual-ca/zh-cn_topic_0046606340.html\" target=\"_blank\">这里</a>。"},"secretKey":{"label":"访问密钥","placeholder":"CCE访问密钥","help":"获取访问密钥参考<a href=\"https://support.huaweicloud.com/usermanual-ca/zh-cn_topic_0046606340.html\" target=\"_blank\">这里</a>。"},"projectId":{"label":"项目ID","placeholder":"CCE项目ID","help":"获取项目ID参考<a href=\"https://support.huaweicloud.com/usermanual-ca/zh-cn_topic_0046606344.html\" target=\"_blank\">这里</a>。","required":"项目ID必须填写"},"region":{"label":"区域","helpText":"获取区域参考<a href=\"https://developer.huaweicloud.com/endpoint\" target=\"_blank\">这里</a>。","required":"区域必须填写","cn_north_1":"华北-北京一","cn_north_4":"华北-北京四","cn_east_3":"华东-上海一","cn_east_2":"华东-上海二","cn_south_1":"华南-广州","cn_southwest_2":"西南-贵阳一","ap_southeast_1":"亚太-香港","ap_southeast_2":"亚太-曼谷","ap_southeast_3":"亚太-新加坡","af_south_1":"非洲-约翰内斯堡","sa_brazil_1":"拉美-圣保罗一","la_south_2":"拉美-圣地亚哥"},"business":{"label":"业务"},"checkAccount":"下一步: 配置集群","checkingAccount":"用户校验中...","configureNode":"下一步: 配置节点","configuringNode":"配置中...","clusterOption":{"title":"集群选项","detail":"为集群自定义Kubernetes选项"},"clusterType":{"label":"集群类型","VirtualMachine":{"label":"混合集群"},"BareMetal":{"label":"裸金属集群"},"ARM64":{"label":"鲲鹏集群"}},"clusterFlavor":{"label":"Cluster Flavor"},"masterVersion":{"label":"版本","warningNotRecommend":"“{version}”，此版本华为 CCE 不推荐使用。具体请查阅华为官方文档。","warningRacher":"“{version}”，此版本不在 Rancher 支持矩阵范围内，请升级 Rancher 版本。可参考","warningRancherTip":"Rancher 支持矩阵。"},"vpcId":{"label":"虚拟私有云"},"subnetId":{"label":"所在子网","none":"无可用子网"},"highwaySubnet":{"label":"高速网卡","placeholder":"高速子网","none":"没有高速子网被使用"},"nodeOption":{"title":"节点选项","detail":"为节点自定义选项"},"dataVolumeType":{"label":"数据盘类型"},"dataVolumeSize":{"label":"数据盘大小","placeholder":"容量范围: 100 ~ 32768"},"volumetype":{"SAS":"高IO","SSD":"超高IO","SATA":"普通IO","GPSSD":"通用SSD"},"description":{"label":"描述","placeholder":"例如: 华为CCE集群"},"eipBandwidthSize":{"label":"带宽"},"eipChargeMode":{"label":"计费模式"},"eipCount":{"label":"数量"},"availableZone":{"label":"当前区域"},"billingMode":{"label":"计费模式","payPerUse":"按需计费","yearly":"包年/包月"},"containerNetworkCidr":{"label":"容器网段","placeholder":"例如: 172.16.0.0/16","none":"无配置","cidrFormatError":"\"容器网段\" 格式错误"},"containerNetworkMode":{"label":"网络模型","none":"无配置","overlay":{"label":"容器隧道网络"},"underlayIpvlan":{"label":"Underlay l2网络"},"vpcRouter":{"label":"VPC网络"}},"rootVolumeType":{"label":"系统盘类型"},"rootVolumeSize":{"label":"系统盘大小","placeholder":"容量范围: 40 ~ 1024"},"nodeCount":{"label":"节点个数"},"nodeFlavor":{"label":"节点规格"},"ssh":{"label":"密钥对"},"eip":{"label":"弹性IP"},"eipSelection":{"none":"暂不使用","new":"创建新的","exist":"使用已有"},"eipIds":{"label":"弹性 IP","none":"无可用弹性 IP","countError":"已选或新建的弹性 IP数量必须和节点数保持一致"},"eipType":{"label":"Eip 类型"},"clusterLabels":{"label":"集群标签","none":"无标签"},"nodeLabels":{"label":"主机标签"},"clusterEipId":{"label":"弹性公网IP","prompt":"请选择...","required":"必须选择弹性公网IP"},"vipSubnetId":{"label":"ELB所在子网","prompt":"请选择..."},"externalServerEnabled":{"label":"外部服务器","enabled":"启用 - 只支持内网","disabled":"禁用 - CCE集群将部署在Rancher所在的VPC"},"highAvailability":{"label":"高可用"},"managementScale":{"label":"集群管理规模"},"nodeOperationSystem":{"label":"操作系统"},"authenticatingProxyCa":{"label":"CA根证书"},"validityPeriod":{"label":"有效期"},"bmsIsAutoRenew":{"label":"自动更新"},"loginMode":{"label":"登录方式","password":"密码","keyPair":"密钥对"},"password":{"label":"密码","placeholder":"请输入密码"},"userName":{"label":"用户名"},"authentiactionMode":{"label":"认证模式","rbac":"RBAC","authenticating_proxy":"认证代理"},"eipShareType":{"label":"共享Eip类型"},"generic":{"mbitS":"Mbit/s","isRequired":"必须填写"}}}},
  'zh-hant': {"clusterNew":{"huaweicce":{"label":"華為雲容器引擎","shortLabel":"Huawei CCE","name":{"label":"集羣名稱","required":"集羣名稱必須填寫","minLengthError":"集羣名稱不能小於4字節"},"access":{"title":"帳戶訪問","detail":"選擇用於啟動華為雲容器引擎的區域和API KEY。"},"accessKey":{"label":"訪問密鑰ID","placeholder":"CCE訪問密鑰ID","help":"創建訪問密鑰ID參考<a href=\"https://support.huaweicloud.com/usermanual-ca/zh-cn_topic_0046606340.html\" target=\"_blank\">這裡</a>。"},"secretKey":{"label":"訪問密鑰","placeholder":"CCE訪問密鑰","help":"獲取訪問密鑰參考<a href=\"https://support.huaweicloud.com/usermanual-ca/zh-cn_topic_0046606340.html\" target=\"_blank\">這裡</a>。"},"projectId":{"label":"項目ID","placeholder":"CCE項目ID","help":"獲取項目ID參考<a href=\"https://support.huaweicloud.com/usermanual-ca/zh-cn_topic_0046606344.html\" target=\"_blank\">這裡</a>。","required":"項目ID必須填寫"},"region":{"label":"區域","helpText":"獲取區域參考<a href=\"https://developer.huaweicloud.com/endpoint\" target=\"_blank\">這裡</a>。","required":"區域必須填寫","cn_north_1":"華北-北京一","cn_north_4":"華北-北京四","cn_east_3":"華東-上海一","cn_east_2":"華東-上海二","cn_south_1":"華南-廣州","cn_southwest_2":"西南-貴陽一","ap_southeast_1":"亞太-香港","ap_southeast_2":"亞太-曼谷","ap_southeast_3":"亞太-新加坡","af_south_1":"非洲-約翰內斯堡","sa_brazil_1":"拉美-聖保羅一","la_south_2":"拉美-聖地亞哥"},"business":{"label":"業務"},"checkAccount":"下一步: 配置集羣","checkingAccount":"用戶校驗中...","configureNode":"下一步: 配置節點","configuringNode":"配置中...","clusterOption":{"title":"集羣選項","detail":"為集羣自定義Kubernetes選項"},"clusterType":{"label":"集羣類型","VirtualMachine":{"label":"混合集羣"},"BareMetal":{"label":"裸金屬集群"},"ARM64":{"label":"鯤鵬集羣"}},"clusterFlavor":{"label":"Cluster Flavor"},"masterVersion":{"label":"版本","warningNotRecommend":"“{version}”，此版本華為 CCE 不推薦使用。具體請查閱華為官方文檔。","warningRacher":"“{version}”，此版本不在 Rancher 支持矩陣範圍內，請升級 Rancher 版本。可參考","warningRancherTip":"Rancher 支持矩陣。"},"vpcId":{"label":"虛擬私有雲"},"subnetId":{"label":"所在子網","none":"無可用子網"},"highwaySubnet":{"label":"高速網卡","placeholder":"高速子網","none":"沒有高速子網被使用"},"nodeOption":{"title":"節點選項","detail":"為節點自定義選項"},"dataVolumeType":{"label":"數據盤類型"},"dataVolumeSize":{"label":"數據盤大小","placeholder":"容量範圍: 100 ~ 32768"},"volumetype":{"SAS":"高IO","SSD":"超高IO","SATA":"普通IO","GPSSD":"通用SSD"},"description":{"label":"描述","placeholder":"例如: 華為CCE集羣"},"eipBandwidthSize":{"label":"帶寬"},"eipChargeMode":{"label":"計費模式"},"eipCount":{"label":"數量"},"availableZone":{"label":"當前區域"},"billingMode":{"label":"計費模式","payPerUse":"按需計費","yearly":"包年/包月"},"containerNetworkCidr":{"label":"容器網段","placeholder":"例如: 172.16.0.0/16","none":"無配置","cidrFormatError":"\"容器網段\" 格式错误"},"containerNetworkMode":{"label":"網絡模型","none":"無配置","overlay":{"label":"容器隧道網絡"},"underlayIpvlan":{"label":"Underlay l2網絡"},"vpcRouter":{"label":"VPC網絡"}},"rootVolumeType":{"label":"系統盤類型"},"rootVolumeSize":{"label":"系統盤大小","placeholder":"容量範圍: 40 ~ 1024"},"nodeCount":{"label":"節點個數"},"nodeFlavor":{"label":"節點規格"},"ssh":{"label":"密鑰對"},"eip":{"label":"彈性IP"},"eipSelection":{"none":"暫不使用","new":"創建新的","exist":"使用已有"},"eipIds":{"label":"彈性 IP","none":"無可用彈性 IP","countError":"已選或新建的彈性 IP數量必須和節點數保持一致"},"eipType":{"label":"Eip 類型"},"clusterLabels":{"label":"集羣標籤","none":"無標籤"},"nodeLabels":{"label":"主機標籤"},"clusterEipId":{"label":"彈性公網IP","prompt":"請選擇...","required":"必須選擇彈性公網IP"},"vipSubnetId":{"label":"ELB所在子網","prompt":"請選擇..."},"externalServerEnabled":{"label":"外部服務器","enabled":"啟用 - 只支持內網","disabled":"禁用 - CCE集羣將部署在Rancher所在的VPC"},"highAvailability":{"label":"高可用"},"managementScale":{"label":"集羣管理規模"},"nodeOperationSystem":{"label":"操作系統"},"authenticatingProxyCa":{"label":"CA根證書"},"validityPeriod":{"label":"有效期"},"bmsIsAutoRenew":{"label":"自動更新"},"loginMode":{"label":"登錄方式","password":"密碼","keyPair":"密鑰對"},"password":{"label":"密碼","placeholder":"請輸入密碼"},"userName":{"label":"用戶名"},"authentiactionMode":{"label":"認證模式","rbac":"RBAC","authenticating_proxy":"認證代理"},"eipShareType":{"label":"共享Eip類型"},"generic":{"mbitS":"Mbit/s","isRequired":"必須填寫"}}}},
  'zh-hant-tw': {"clusterNew":{"huaweicce":{"label":"華為雲容器引擎","shortLabel":"Huawei CCE","name":{"label":"叢集名稱","required":"叢集名稱必須填寫","minLengthError":"叢集名稱不能小於4字節"},"access":{"title":"帳戶訪問","detail":"選擇用於啟動華為雲容器引擎的區域和API KEY。"},"accessKey":{"label":"訪問密鑰ID","placeholder":"CCE訪問密鑰ID","help":"創建訪問密鑰ID參考<a href=\"https://support.huaweicloud.com/usermanual-ca/zh-cn_topic_0046606340.html\" target=\"_blank\">這裡</a>。"},"secretKey":{"label":"訪問密鑰","placeholder":"CCE訪問密鑰","help":"獲取訪問密鑰參考<a href=\"https://support.huaweicloud.com/usermanual-ca/zh-cn_topic_0046606340.html\" target=\"_blank\">這裡</a>。"},"projectId":{"label":"項目ID","placeholder":"CCE項目ID","help":"獲取項目ID參考<a href=\"https://support.huaweicloud.com/usermanual-ca/zh-cn_topic_0046606344.html\" target=\"_blank\">這裡</a>。","required":"項目ID必須填寫"},"region":{"label":"區域","helpText":"獲取區域參考<a href=\"https://developer.huaweicloud.com/endpoint\" target=\"_blank\">這裡</a>。","required":"區域必須填寫","cn_north_1":"華北-北京一","cn_north_4":"華北-北京四","cn_east_3":"華東-上海一","cn_east_2":"華東-上海二","cn_south_1":"華南-廣州","cn_southwest_2":"西南-貴陽一","ap_southeast_1":"亞太-香港","ap_southeast_2":"亞太-曼谷","ap_southeast_3":"亞太-新加坡","af_south_1":"非洲-約翰內斯堡","sa_brazil_1":"拉美-聖保羅一","la_south_2":"拉美-聖地亞哥"},"business":{"label":"業務"},"checkAccount":"下一步: 配置叢集","checkingAccount":"用戶校驗中...","configureNode":"下一步: 配置節點","configuringNode":"配置中...","clusterOption":{"title":"叢集選項","detail":"為叢集自定義Kubernetes選項"},"clusterType":{"label":"叢集類型","VirtualMachine":{"label":"混合叢集"},"BareMetal":{"label":"裸金屬集群"},"ARM64":{"label":"鯤鵬叢集"}},"clusterFlavor":{"label":"Cluster Flavor"},"masterVersion":{"label":"版本","warningNotRecommend":"“{version}”，此版本華為 CCE 不推薦使用。具體請查閱華為官方文檔。","warningRacher":"“{version}”，此版本不在 Rancher 支持矩陣範圍內，請升級 Rancher 版本。可參考","warningRancherTip":"Rancher 支持矩陣。"},"vpcId":{"label":"虛擬私有雲"},"subnetId":{"label":"所在子網","none":"無可用子網"},"highwaySubnet":{"label":"高速網卡","placeholder":"高速子網","none":"沒有高速子網被使用"},"nodeOption":{"title":"節點選項","detail":"為節點自定義選項"},"dataVolumeType":{"label":"數據盤類型"},"dataVolumeSize":{"label":"數據盤大小","placeholder":"容量範圍: 100 ~ 32768"},"volumetype":{"SAS":"高IO","SSD":"超高IO","SATA":"普通IO","GPSSD":"通用SSD"},"description":{"label":"描述","placeholder":"例如: 華為CCE叢集"},"eipBandwidthSize":{"label":"帶寬"},"eipChargeMode":{"label":"計費模式"},"eipCount":{"label":"數量"},"availableZone":{"label":"當前區域"},"billingMode":{"label":"計費模式","payPerUse":"按需計費","yearly":"包年/包月"},"containerNetworkCidr":{"label":"容器網段","placeholder":"例如: 172.16.0.0/16","none":"無配置","cidrFormatError":"\"容器網段\" 格式错误"},"containerNetworkMode":{"label":"網路模型","none":"無配置","overlay":{"label":"容器隧道網路"},"underlayIpvlan":{"label":"Underlay l2網路"},"vpcRouter":{"label":"VPC網路"}},"rootVolumeType":{"label":"系統盤類型"},"rootVolumeSize":{"label":"系統盤大小","placeholder":"容量範圍: 40 ~ 1024"},"nodeCount":{"label":"節點個數"},"nodeFlavor":{"label":"節點規格"},"ssh":{"label":"密鑰對"},"eip":{"label":"彈性IP"},"eipSelection":{"none":"暫不使用","new":"創建新的","exist":"使用已有"},"eipIds":{"label":"彈性 IP","none":"無可用彈性 IP","countError":"已選或新建的彈性 IP數量必須和節點數保持一致"},"eipType":{"label":"Eip 類型"},"clusterLabels":{"label":"叢集標籤","none":"無標籤"},"nodeLabels":{"label":"主機標籤"},"clusterEipId":{"label":"彈性公網IP","prompt":"請選擇...","required":"必須選擇彈性公網IP"},"vipSubnetId":{"label":"ELB所在子網","prompt":"請選擇..."},"externalServerEnabled":{"label":"外部伺服器","enabled":"啟用 - 只支持內網","disabled":"禁用 - CCE叢集將部署在Rancher所在的VPC"},"highAvailability":{"label":"高可用"},"managementScale":{"label":"叢集管理規模"},"nodeOperationSystem":{"label":"操作系統"},"authenticatingProxyCa":{"label":"CA根證書"},"validityPeriod":{"label":"有效期"},"bmsIsAutoRenew":{"label":"自動更新"},"loginMode":{"label":"登錄方式","password":"密碼","keyPair":"密鑰對"},"password":{"label":"密碼","placeholder":"請輸入密碼"},"userName":{"label":"用戶名"},"authentiactionMode":{"label":"認證模式","rbac":"RBAC","authenticating_proxy":"認證代理"},"eipShareType":{"label":"共享Eip類型"},"generic":{"mbitS":"Mbit/s","isRequired":"必須填寫"}}}},
};

const ZONES = [
  {
    label: 'clusterNew.huaweicce.region.cn_north_1',
    value: 'cn-north-1',
  },{
    label: 'clusterNew.huaweicce.region.cn_north_4',
    value: 'cn-north-4',
  },{
    label: 'clusterNew.huaweicce.region.cn_east_3',
    value: 'cn-east-3',
  },{
    label: 'clusterNew.huaweicce.region.cn_east_2',
    value: 'cn-east-2',
  },{
    label: 'clusterNew.huaweicce.region.cn_south_1',
    value: 'cn-south-1',
  },{
    label: 'clusterNew.huaweicce.region.cn_southwest_2',
    value: 'cn-southwest-2',
  },{
    label: 'clusterNew.huaweicce.region.ap_southeast_1',
    value: 'ap-southeast-1',
  },{
    label: 'clusterNew.huaweicce.region.ap_southeast_2',
    value: 'ap-southeast-2',
  },{
    label: 'clusterNew.huaweicce.region.ap_southeast_3',
    value: 'ap-southeast-3',
  },{
    label: 'clusterNew.huaweicce.region.af_south_1',
    value: 'af-south-1',
  },{
    label: 'clusterNew.huaweicce.region.sa_brazil_1',
    value: 'sa-brazil-1',
  },{
    label: 'clusterNew.huaweicce.region.la_south_2',
    value: 'la-south-2',
  },
];

const MANAGEMENT_SCALE_BAREMETAL = [
  {
    label: '10',
    value: 'small',
  }, {
    label: '100',
    value: 'medium',
  }, {
    label: '500',
    value: 'large',
  }]

const MANAGEMENT_SCALE_VIRTUAL = [
  {
    label: '50',
    value: 'small',
  }, {
    label: '200',
    value: 'medium',
  }, {
    label: '1000',
    value: 'large',
  }]

const CONTAINER_NETWORK_MODES = [
  {
    label: 'clusterNew.huaweicce.containerNetworkMode.overlay.label',
    value: 'overlay_l2',
    bare: false,
  }, {
    label: 'clusterNew.huaweicce.containerNetworkMode.underlayIpvlan.label',
    value: 'underlay_ipvlan',
    bare: true,
  }, {
    label: 'clusterNew.huaweicce.containerNetworkMode.vpcRouter.label',
    value: 'vpc-router',
    bare: false
  }]


/*!!!!!!!!!!!DO NOT CHANGE START!!!!!!!!!!!*/
export default Ember.Component.extend(ClusterDriver, {
  driverName:  '%%DRIVERNAME%%',
  configField: '%%DRIVERNAME%%EngineConfig',
  app:         service(),
  router:      service(),
  session:     service(),
  intl:        service(),

  layout:       null,
  configField: 'huaweiEngineConfig',
  volumeTypes: [],
  zones:       ZONES,
  clusterType: [
    {
      label: 'clusterNew.huaweicce.clusterType.VirtualMachine.label',
      value: 'VirtualMachine',
    }
  ],
  masterVersions: [
    {
      label: 'v1.23',
      value: 'v1.23',
      rancherEnabeld: true,
    },
    {
      label: 'v1.21',
      value: 'v1.21',
      rancherEnabeld: true,
    },
    {
      label: 'v1.19',
      value: 'v1.19',
      rancherEnabeld: true,
    },
  ],
  eipChargeModeContent: [
    {
      label: 'BandWith',
      value: null,
    }, {
      label: 'Traffic',
      value: 'traffic',
    }],
  eipTypeContent: [
    {
      label: '5_bgp',
      value: '5_bgp',
    }, {
      label: '5_sbgp',
      value: '5_sbgp',
    }],
  nodeOperationSystemContent: [
    {
      label: 'EulerOS 2.9',
      value: 'EulerOS 2.9',
    }, {
      label: 'CentOS 7.6',
      value: 'CentOS 7.6',
    }, {
      label: 'Ubuntu 18.04',
      value: 'Ubuntu 18.04',
    }, {
      label: 'EulerOS 2.5',
      value: 'EulerOS 2.5',
    }],

  validityPeriodContent: [
    {
      label: '1 month',
      value: '1 month'
    },
    {
      label: '2 months',
      value: '2 month'
    },
    {
      label: '3 months',
      value: '3 month'
    },
    {
      label: '4 months',
      value: '4 month'
    },
    {
      label: '5 months',
      value: '5 month'
    },
    {
      label: '6 months',
      value: '6 month'
    },
    {
      label: '7 months',
      value: '7 month'
    },
    {
      label: '8 months',
      value: '8 month'
    },
    {
      label: '9 months',
      value: '9 month'
    },
    {
      label: '1 year',
      value: '1 year'
    },
  ],
  eipShareTypeContent: [
    {
      label: 'PER',
      value: 'PER'
    },
  ],
  vpcs:                    null,
  subnets:                 null,
  eipIds:                  null,
  nodeFlavors:             null,
  keypairs:                null,
  availableZones:          null,
  step:                    1,
  eipSelection:            'none',
  highAvailabilityEnabled: 's2',
  managementScale:         'small',
  validityPeriod:          '1 month',
  authConfigured:           false,
  publicCloud:             null,

  editing:                 equal('mode', 'edit'),

  config: null,
  // config:      alias('cluster.%%DRIVERNAME%%kcsEngineConfig'),

  init() {
    // This does on the fly template compiling, if you mess with this :cry:
    const decodedLayout = window.atob(LAYOUT);
    const template      = Ember.HTMLBars.compile(decodedLayout, {
      moduleName: 'shared/components/cluster-driver/driver-%%DRIVERNAME%%/template'
    });
    set(this,'layout', template);
    this._super(...arguments);

    const lang = get(this, 'session.language');

    get(this, 'intl.locale');
    this.loadLanguage(lang);

    let config      = get(this, 'config');
    let configField = get(this, 'configField');

    if ( !config ) {
      config = this.get('globalStore').createRecord({
        type:                  'huaweiEngineConfig',
        accessKey:             null,
        secretKey:             null,
        region:                'cn-north-1',
        projectId:             null,
        dataVolumeSize:        100,
        vpcId:                 null,
        clusterType:           'VirtualMachine',
        masterVersion:         'v1.21',
        billingMode:           0,
        containerNetworkMode:  'overlay_l2',
        clusterFlavor:         'cce.s2.small',
        dataVolumeType:        null,
        rootVolumeType:        null,
        nodeCount:             1,
        rootVolumeSize:        40,
        externalServerEnabled: false,
        nodeOperationSystem:   'EulerOS 2.9',
        containerNetworkCidr:  '',
        bmsIsAutoRenew:        'false',
        userName:              'root',
      });

      set(this, 'cluster.%%DRIVERNAME%%EngineConfig', config);
      set(this, 'config', config);
      this.validityPeriodChange();
    } else {
      const clusterFlavor = get(config, 'clusterFlavor');

      if ( clusterFlavor ) {
        const arr = clusterFlavor.split('.')

        setProperties(this, {
          'highAvailabilityEnabled': arr[1],
          'managementScale':         arr[2]
        });
      }

      setProperties(config, {
        accessKey: null,
        secretKey: null,
      });

      if ( get(config, 'nodeLabels') === null ) {
        set(config, 'nodeLabels', {});
      }

      if ( get(config, 'eipIds') === null ) {
        set(config, 'eipIds', []);
      }
    }
  },
  /*!!!!!!!!!!!DO NOT CHANGE END!!!!!!!!!!!*/
  // Add custom validation beyond what can be done from the config API schema

  validate() {
    this._super(...arguments);
    let errors = get(this, 'errors') || [];

    // errors = this.validateFields(errors, ['sshKey'], 'config')

    if (get(this, 'config.authentiactionMode') === 'authenticating_proxy') {
      errors = this.validateFields(errors, ['authenticatingProxyCa'], 'config')
    }
    set(this, 'errors', errors);

    return errors.length === 0
  },

  actions: {
    async checkAccount(cb) {
      const requiredConfig = ['projectId', 'accessKey', 'secretKey', 'region']

      set(this, 'errors', [])
      let errors = [];

      errors = this.validateFields(errors, requiredConfig, 'config')
      if (errors.length > 0) {
        set(this, 'errors', errors);
        cb();

        return;
      }

      setProperties(this, {
        'errors':           null,
        'config.accessKey': (get(this, 'config.accessKey') || '').trim(),
        'config.secretKey': (get(this, 'config.secretKey') || '').trim(),
      });

      try {
        await this.getVpcs();
        await this.getEipIds();
        await this.getVipSubnet();
        await this.getVolumeTypes();

        set(this, 'step', 2);
        cb();
      } catch (e) {
        const errors = get(this, 'errors') || [];

        errors.pushObject(e.message || e);
        set(this, 'errors', errors);
        cb();

        return;
      }
    },

    async configureNode(cb) {
      const requiredConfig = ['vpcId', 'subnetId', 'containerNetworkCidr'];
      const cidrIPV4RegExp = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\/\d{1,2}$/;
      const intl = get(this, 'intl');

      set(this, 'errors', [])
      let errors = [];

      errors = this.validateFields(errors, requiredConfig, 'config');

      if(get(this, 'config.containerNetworkCidr') && !cidrIPV4RegExp.test(get(this, 'config.containerNetworkCidr'))){
        errors.pushObject(intl.t('clusterNew.huaweicce.containerNetworkCidr.cidrFormatError'))
      }

      if (errors.length > 0) {
        set(this, 'errors', errors);
        cb();

        return;
      }

      if (get(this, 'authConfigured')) {
        set(this, 'step', 3)
        cb()

        return
      }
      try {
        await this.getAvaliableZone();
        await this.listCloudServerFlavors();
        await this.listKeypairs();

        set(this, 'step', 3)
      } catch (err) {
        const errors = get(this, 'errors') || [];

        errors.pushObject(err.message || err);
        set(this, 'errors', errors);
        cb();

        return;
      }
    },

    setLabels(section) {
      let obj = {}

      section.map((s) => {
        if (s.key && s.value) {
          obj[s.key] = s.value
        }
      })
      set(this, 'config.labels', obj)
    },

    setNodeLabels(section) {
      let obj = {}

      section.map((s) => {
        if (s.key && s.value) {
          obj[s.key] = s.value
        }
      })
      set(this, 'config.nodeLabels', obj)
    },

    save(cb) {
      setProperties(this, { 'errors': null });

      const errors = get(this, 'errors') || [];
      const intl = get(this, 'intl');
      const requiredCluster = ['name']
      const nameErrors = this.validateFields(errors, requiredCluster, 'cluster')
      const eipSelection = get(this, 'eipSelection');
      const nodeCount = parseInt(get(this, 'config.nodeCount'));

      if(get(this, 'primaryResource.name') && get(this, 'primaryResource.name.length') < 4){
        errors.pushObject(intl.t('clusterNew.huaweicce.name.minLengthError'))
      }

      if (eipSelection === 'exist' && get(this, 'config.eipIds').length !== nodeCount) {
        errors.pushObject(intl.t('clusterNew.huaweicce.eipIds.countError'))
      }

      if (eipSelection === 'new' && parseInt(get(this, 'config.eipCount')) !== nodeCount) {
        errors.pushObject(intl.t('clusterNew.huaweicce.eipIds.countError'))
      }

      if (errors.length > 0 || nameErrors.length > 0) {
        set(this, 'errors', errors);
        cb();

        return;
      }

      set(this, 'cluster.%%DRIVERNAME%%EngineConfig', get(this, 'config'));

      this.send('driverSave', cb);
    },

    cancel(){
      // probably should not remove this as its what every other driver uses to get back
      get(this, 'router').transitionTo('global-admin.clusters.index');
    },
  },

  languageDidChanged: observer('intl.locale', function() {
    const lang = get(this, 'intl.locale');
    if (lang) {
      this.loadLanguage(lang[0]);
    }

  }),

  loadLanguage(lang) {
    const translation = languages[lang] || languages['en-us'];
    const intl = get(this, 'intl');

    if (intl.addTranslation) {
      intl.addTranslation(lang, 'clusterNew.huaweicce', translation.clusterNew.huaweicce);
    } else {
      intl.addTranslations(lang, translation);
    }

    intl.translationsFor(lang);
    set(this, 'refresh', false);
    next(() => {
      set(this, 'refresh', true);
      set(this, 'lanChanged', +new Date());
    });
  },
  // Any computed properties or custom logic can go here

  clusterTypeChange: observer('config.clusterType', function() {
    const clusterType = get(this, 'config.clusterType')
    const publicCloud = get(this, 'publicCloud')

    if (clusterType === 'VirtualMachine') {
      set(this, 'config.billingMode', 0)
      set(this, 'config.highwaySubnet', null)
      set(this, 'highAvailabilityEnabled', 's2')
    }
    if (clusterType !== 'BareMetal' || get(this, 'mode') !== 'new') {
      return
    }
    const networks = get(this, 'networks') || []
    let filter = []

    if (publicCloud) {
      filter = networks.filter((n) => n.status === 'ACTIVE' && n.tenant_id === get(this, 'config.projectId') && n[`provider:network_type`] === 'geneve')
    } else {
      filter = networks.filter((n) => n.status === 'ACTIVE')
    }
    set(this, 'config.highwaySubnet', filter[0] && filter[0].id)
    set(this, 'highAvailabilityEnabled', 't2')
  }),

  vpcIdChange: observer('config.vpcId', function() {
    this.getSubnet();
    const vpcId = get(this, 'config.vpcId')
    const subnets = get(this, 'subnets') || []

    const filter = subnets.filter((s) => s.vpc_id === vpcId)

    set(this, 'config.subnetId', filter[0] && filter[0].id || null)
  }),

  eipSelectionChange: observer('eipSelection', function() {
    const eipSelection = get(this, 'eipSelection')

    if (eipSelection === 'none') {
      setProperties(this, {
        'config.eipIds':           [],
        'config.eipCount':         null,
        'config.eipType':          null,
        'config.eipShareType':     null,
        'config.eipChargeMode':    null,
        'config.eipBandwidthSize': null,
      })
    }
    if (eipSelection === 'exist') {
      setProperties(this, {
        'config.eipCount':         null,
        'config.eipType':          null,
        'config.eipShareType':     null,
        'config.eipChargeMode':    null,
        'config.eipBandwidthSize': null,
      })
    }
    if (eipSelection === 'new') {
      setProperties(this, {
        'config.eipIds':           [],
        'config.eipCount':         1,
        'config.eipType':          '5_bgp',
        'config.eipBandwidthSize': 1,
        'config.eipShareType':     'PER',
      })
    }
  }),

  clusterFlavorObserver: observer('managementScale', 'highAvailabilityEnabled', function() {
    const { managementScale, highAvailabilityEnabled } = this;

    set(this, 'config.clusterFlavor', `cce.${ highAvailabilityEnabled }.${ managementScale }`)
  }),

  validityPeriodChange: observer('validityPeriod', function() {
    const validityPeriod = get(this, 'validityPeriod')

    if (!validityPeriod) {
      setProperties(this, {
        'config.bmsPeriodNum':  null,
        'config.bmsPeriodType': null,
      })

      return
    }
    const arr = validityPeriod.split(' ')

    setProperties(this, {
      'config.bmsPeriodNum':  parseInt(arr[0]),
      'config.bmsPeriodType': arr[1]
    })
  }),

  billingModeChange: observer('config.billingMode', function() {
    const billingMode = get(this, 'config.billingMode')

    if (billingMode === 0) {
      setProperties(this, {
        'validityPeriod':        null,
        'config.bmsIsAutoRenew': null,
      })
    }
    if (billingMode === 2) {
      setProperties(this, {
        'config.bmsIsAutoRenew': 'false',
        'validityPeriod':        '1 month',
      })
    }
  }),

  availableZoneChange: observer('config.availableZone', async function() {
    try {
      await this.listCloudServerFlavors();
    } catch (err) {
      const errors = get(this, 'errors') || [];

      errors.pushObject(err.message || err);
      set(this, 'errors', errors);

      return;
    }
  }),

  containerNetworkModeContentChange: observer('containerNetworkModeContent.[]', function() {
    set(this, 'config.containerNetworkMode', get(this, 'containerNetworkModeContent.firstObject.value'))
  }),

  eipIdContentChange: observer('eipIdContent.@each.active', function() {
    set(this, 'config.eipIds', []);
    get(this, 'eipIdContent').forEach((item) => {
      if (item.active) {
        get(this, 'config.eipIds').pushObject(get(item, 'value'))
      }
    })
  }),

  containerNetworkModeContent: computed('config.clusterType', function() {
    const choices     = CONTAINER_NETWORK_MODES;
    const clusterType = get(this, 'config.clusterType');

    return choices.filter((choice) => choice.bare === (clusterType === 'BareMetal'))
  }),

  regionShowValue: computed('config.region', 'intl.locale', function() {
    const intl    = get(this, 'intl');
    const choices = get(this, 'zones');
    const current = get(this, 'config.region');

    return intl.t(get(choices.findBy('value', current), 'label'))
  }),

  clusterTypeShowValue: computed('config.clusterType', 'intl.locale', function() {
    const intl    = get(this, 'intl');
    const choices = get(this, 'clusterType');
    const current = get(this, 'config.clusterType');

    return intl.t(get(choices.findBy('value', current), 'label'));
  }),

  containerNetworkModeShowValue: computed('containerNetworkModeContent.[]', 'config.containerNetworkMode', 'intl.locale', function() {
    const intl    = get(this, 'intl');
    const choices = get(this, 'containerNetworkModeContent');
    const current = get(this, 'config.containerNetworkMode');

    return intl.t(get(choices.findBy('value', current), 'label'));
  }),

  managementScaleContent: computed('config.clusterType', function() {
    const clusterType = get(this, 'config.clusterType')

    if (clusterType === 'BareMetal') {
      return MANAGEMENT_SCALE_BAREMETAL
    }

    return MANAGEMENT_SCALE_VIRTUAL
  }),

  managementScaleShowValue: computed('config.clusterType', 'managementScale', function() {
    const clusterType = get(this, 'config.clusterType');
    let choices       = MANAGEMENT_SCALE_VIRTUAL;
    const current     = get(this, 'managementScale');

    if (clusterType === 'BareMetal') {
      choices = MANAGEMENT_SCALE_BAREMETAL
    }
    return get(choices.findBy('value', current), 'label');
  }),

  vpcContent: computed('vpcs.[]', function() {
    const vpcs = get(this, 'vpcs') || []

    return vpcs.map((v) => {
      return {
        label: v.name,
        value: v.id
      }
    })
  }),

  editedVpcName: computed('config.vpcId', function() {
    const vpcId = get(this, 'config.vpcId')
    const vpcs = get(this, 'vpcs') || []
    const filter = vpcs.filter((v) => v.id === vpcId)[0] || {}

    return filter.name
  }),

  subnetContent: computed('config.vpcId', 'subnets.[]', function() {
    const subnets = get(this, 'subnets') || []
    const vpcId = get(this, 'config.vpcId')
    const filter = subnets.filter((s) => s.vpc_id === vpcId).map((s) => ({
      label: s.name,
      value: s.id,
    }))

    return filter
  }),

  vipSubnetContent: computed('vipSubnets.[]', function() {
    const vipSubnets = get(this, 'vipSubnets') || []
    const filter = vipSubnets.map((s) => ({
      label: s.name,
      value: s.id,
    }))

    return filter
  }),

  editedSubnetName: computed('config.subnetId', function() {
    const subnetId = get(this, 'config.subnetId')
    const subnets = get(this, 'subnets') || []
    const filter = subnets.filter((s) => s.id === subnetId)[0] || {}

    return filter.name
  }),

  editedVipSubnetName: computed('config.vipSubnetId', function() {
    const subnetId = get(this, 'config.vipSubnetId')
    const vipSubnets = get(this, 'vipSubnets') || []
    const filter = vipSubnets.filter((s) => s.id === subnetId)[0] || {}

    return filter.name
  }),

  eipIdContent: computed('eipIds.[]', 'config.{externalServerEnabled}', function() {
    const eipIds = get(this, 'eipIds') || [];

    return eipIds.filter((e) => e.status === 'DOWN').map((e) => ({
      label: e.public_ip_address,
      value: e.id
    }))
  }),

  nodeFlavorContent: computed('nodeFlavors.[]', function() {
    const nodeFlavors = get(this, 'nodeFlavors') || []

    return nodeFlavors.filter((n) => {
      const az   = get(this, 'config.availableZone');
      let statusString = get(n, 'os_extra_specs.cond:operation:az')
      let statusSubString = '';

      if (statusString === undefined) {
        return true
      }

      statusSubString = statusString.split(',').find(item => item.indexOf(az) !== -1)

      if (statusSubString === undefined) {
        return true
      }

      statusSubString = statusSubString.match(/\([a-z]+\)/)

      return !(statusSubString === '(abandon)' || statusSubString === '(sellout)');
    }).map((n) => {
      return {
        label: `${ n.name } ( vCPUs: ${ n.vcpus }, memory: ${ n.ram / 1024 } GB )`,
        value: n.name
      }
    })
  }),

  availableZoneContent: computed('availableZones.[]', function() {
    const zones = get(this, 'availableZones') || [];

    return zones.map((z) => {
      if (z.zoneState.available) {
        return {
          label: z.zoneName,
          value: z.zoneName
        }
      }
    })
  }),

  sshkeyContent: computed('keypairs.[]', function() {
    const keypairs = get(this, 'keypairs') || [];

    return keypairs.map((k) => {
      return {
        label: k.keypair.name,
        value: k.keypair.name
      }
    })
  }),

  volumeTypeContent: computed('volumeTypes.[]', 'config.availableZone', function() {
    const out = [];
    const volumeTypes = get(this, 'volumeTypes') || [];
    const zone = get(this, 'config.availableZone') || '';

    volumeTypes.forEach(obj=>{
      if(obj.availabilityZones.includes(zone)){
        out.push({
          label: `clusterNew.huaweicce.volumetype.${obj.name}`,
          value: obj.name,
        })
      }
    });

    if (get(this, 'mode') === 'new') {
      set(this, 'config.rootVolumeType', out[0] && out[0].value || null)
      set(this, 'config.dataVolumeType', out[0] && out[0].value || null)
    }

    return out;
  }),

  editedSshName: computed('config.sshKey', function() {
    const sshKey = get(this, 'config.sshKey')
    const keypairs = get(this, 'keypairs') || [];
    const filter = keypairs.filter((k) => k.keypair.name === sshKey)[0] || {}

    return filter.keypair && filter.keypair.name || ''
  }),

  nodeCountMax: computed('config.clusterFlavor', function() {
    const clusterFlavor = get(this, 'config.clusterFlavor') || ''

    if (clusterFlavor.endsWith('small')) {
      return 50
    }
    if (clusterFlavor.endsWith('medium')) {
      return 200
    }

    return 1000
  }),

  managementScaleDisplay: computed('managementScale', function() {
    const managementScale = get(this, 'managementScale')
    const managementScaleContent = get(this, 'managementScaleContent') || []
    const filter = managementScaleContent.filter((m) => m.value === managementScale)[0] || {}

    return filter.label
  }),

  billingModeName: computed('config.billingMode', function() {
    const billingMode = get(this, 'config.billingMode')
    const intl = get(this, 'intl')

    return billingMode === 0 ? intl.t('clusterNew.huaweicce.billingMode.payPerUse') : intl.t('clusterNew.huaweicce.billingMode.yearly')
  }),

  billingModeContent: computed('config.clusterType', function() {
    const clusterType = get(this, 'config.clusterType')
    const intl = get(this, 'intl')

    if (clusterType === 'VirtualMachine') {
      return [
        {
          label: intl.t('clusterNew.huaweicce.billingMode.payPerUse'),
          value: 0,
        }]
    } else {
      return [
        {
          label: intl.t('clusterNew.huaweicce.billingMode.payPerUse'),
          value: 0,
        }, {
          label: intl.t('clusterNew.huaweicce.billingMode.yearly'),
          value: 2,
        }]
    }
  }),

  validityPeriodName: computed('config.bmsPeriodNum', 'config.bmsPeriodType', function() {
    const { bmsPeriodNum, bmsPeriodType } = get(this, 'config');

    return `${ bmsPeriodNum } ${ bmsPeriodType }`
  }),

  bmsIsAutoRenewName: computed('config.bmsIsAutoRenew', function() {
    return get(this, 'config.bmsIsAutoRenew') === 'true' ? 'Enabled' : 'Disabled'
  }),

  kubernetesVersionNotRecommend: computed('intl.locale', 'config.masterVersion', function() {
    const kubernetesVersion = get(this, 'config.masterVersion');
    const versionChoices = get(this, 'masterVersions') || [];

    return versionChoices.find(v=>{
      return v.value === kubernetesVersion && v.notRecommend
    })
  }),
  kubernetesVersionDisabeldRancher: computed('intl.locale', 'config.masterVersion', function() {
    const kubernetesVersion = get(this, 'config.masterVersion');
    const versionChoices = get(this, 'masterVersions') || [];

    return versionChoices.find(v=>{
      return v.value === kubernetesVersion && !v.rancherEnabeld
    })
  }),

  validateFields(errors = [], requiredFields = [], parent = null) {
    const intl = get(this, 'intl')

    if (parent) {
      requiredFields.map((item) => {
        if (!get(this, `${ parent }.${ item }`)) {
          errors.pushObject(`"${ intl.t(`clusterNew.huaweicce.${ item }.label`) }" ${ intl.t(`clusterNew.huaweicce.generic.isRequired`) }`);
        }
      })
    } else {
      requiredFields.map((item) => {
        if (!get(this, `${ item }`)) {
          errors.pushObject(`"${ intl.t(`clusterNew.huaweicce.${ item }.label`) }" ${ intl.t(`clusterNew.huaweicce.generic.isRequired`) }`);
        }
      })
    }

    return errors
  },

  willSave() {
    if (get(this, 'mode') === 'new') {
      const authenticatingProxyCa = get(this, 'authenticatingProxyCa') || ''

      if (get(this, 'config.authentiactionMode') === 'authenticating_proxy') {
        set(this, 'config.authenticatingProxyCa', AWS.util.base64.encode(authenticatingProxyCa))
      } else {
        set(this, 'config.authenticatingProxyCa', null)
      }
    }

    return this._super(...arguments);
  },

  getVpcs() {
    set(this, 'vpcs', []);
    set(this, 'vpcId', null);

    return this.fetchResoures('vpcs').then((res) => {
      set(this, 'vpcs', res)

      if (get(this, 'mode') === 'new') {
        set(this, 'config.vpcId', res[0] && res[0].id || null)
      }

      return res;
    })

  },

  getSubnet() {
    return this.fetchResoures('subnets', {vpcID: get(this, 'config.vpcId') || undefined}).then(res => {
      set(this, 'subnets', res)

      if (get(this, 'mode') === 'new') {
        set(this, 'config.subnetId', res[0] && res[0].id || null)
      }

      return res;
    })
  },

  getVipSubnet() {
    return this.fetchResoures('subnets').then(res => {
      const subnets = res || [];

      set(this, 'subnets', subnets)
      set(this, 'vipSubnets', subnets)

      if (get(this, 'mode') === 'new') {
        set(this, 'config.subnetId', subnets[0] && subnets[0].id || null)
        set(this, 'config.vipSubnetId', subnets[0] && subnets[0].id || null)
      }

      return res;
    })
  },

  getEipIds() {
    return this.fetchResoures('listPublicIPs').then( res => {
      set(this, 'eipIds', res);

      return res
    })
  },

  getVolumeTypes() {
    const types = ['SSD', 'SAS', 'SATA'];
    return this.fetchResoures('volumeTypes').then(res => {
      const out = [];


      res.forEach(obj=>{
        let availabilityZones = [];
        const availability = get(obj, 'extra_specs.RESKEY:availability_zones');

        if(!availability || !types.includes(obj.name)){
          return;
        }

        const availabilityArr = availability.split(',');
        const soldOut = get(obj, 'extra_specs.os-vendor-extended:sold_out_availability_zones');

        if(!soldOut){
          availabilityZones = availabilityArr;
        } else {
          const soldOutArr = get(obj, 'extra_specs.os-vendor-extended:sold_out_availability_zones').split(',');
          availabilityZones = availabilityArr.filter(item => !soldOutArr.includes(item));
        }

        availabilityZones && availabilityZones.length && out.push({
          availabilityZones,
          name: obj.name
        });
      })

      set(this, 'volumeTypes', out);

      return out;
    })
  },

  listCloudServerFlavors() {
    return this.fetchResoures('flavors', { zone: get(this, 'config.availableZone') }).then(res => {
      set(this, 'nodeFlavors', res)

      if (get(this, 'mode') === 'new') {
        set(this, 'config.nodeFlavor', res[0] && res[0].name || null)
      }

      return res;
    })
  },

  listKeypairs() {
    return this.fetchResoures('osKeypairs').then(res => {
      set(this, 'keypairs', res)

      const keypairs = res || []

      set(this, 'config.sshKey', keypairs[0] && keypairs[0].keypair.name)
    })

    return res;
  },

  getAvaliableZone() {
    return this.fetchResoures('osAvailabilityZone').then(res => {
      const availableZones = (res || []).filter((z) => z.zoneState.available)

      set(this, 'availableZones', availableZones)

      if (get(this, 'mode') === 'new') {
        setProperties(this, {
          'config.keypairs':      res[0] && res[0].zoneName || null,
          'config.availableZone': availableZones.get('firstObject.zoneName'),
        })
      }
    })

    return res;
  },

  fetchResoures(resource, externalParams = {}) {
    const url = `/meta/cce/${resource}`
    const query = Object.assign({}, externalParams, {
      accessKey: get(this, 'config.accessKey'),
      secretKey: get(this, 'config.secretKey'),
      projectID: get(this, 'config.projectId'),
      regionID: get(this, 'config.region'),
    });

    const req = {
      url:     `${ url }?${ this.getQueryParamsString(query) }`,
      method:  'GET',
    };

    return get(this, 'globalStore').rawRequest(req).then((res) => {
      return res.body || res;
    }).catch((err) => {
      let message = get(err, 'body.message');

      if(message){
        try {
          const error = JSON.parse(message);
          if(error.error_message){
            message = error.error_message;
          }
        } catch (error) {

        }
      }

      const error = message || get(err, 'body.error') || JSON.stringify(err);

      return reject(error);
    });
  },
  getQueryParamsString(params, deep = false) {
    const keys = Object.keys(params).sort((a, b) => {
      return a < b ? -1 : 1;
    });

    return keys.map((key) => {
      if (params[key] === undefined) {
        return '';
      }

      return `${ key }${ deep ? encodeURIComponent('=') : '=' }${ encodeURIComponent(params[key]) }`;
    }).join(deep ? encodeURIComponent('&') : '&');
  },
});
