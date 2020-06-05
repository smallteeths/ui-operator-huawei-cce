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

/*!!!!!!!!!!!GLOBAL CONST END!!!!!!!!!!!*/

const languages = {
  'en-us':   {"clusterNew":{"huaweicce":{"label":"Huawei Cloud Container Engine","shortLabel":"Huawei CCE","name":{"label":"Cluster Name","required":"Cluster name is required."},"access":{"title":"Account Access","detail":"Choose the region and API Key that will be used to launch Huawei Cloud Container Engine."},"accessKey":{"label":"Access Key","placeholder":"Your Huawei access key","help":"You can find instructions on how to create Access Key <a href=\"https://support.huaweicloud.com/usermanual-ca/zh-cn_topic_0046606340.html\" target=\"_blank\">here</a>."},"secretKey":{"label":"Secret Key","placeholder":"Your Huawei secret key","help":"You can find instructions on how to obtain Secret Key <a href=\"https://support.huaweicloud.com/usermanual-ca/zh-cn_topic_0046606340.html\" target=\"_blank\">here</a>."},"projectId":{"label":"Project Id","placeholder":"Your CCE project id","help":"You can find instructions on how to obtain Project Id <a href=\"https://support.huaweicloud.com/usermanual-ca/zh-cn_topic_0046606344.html\" target=\"_blank\">here</a>.","required":"Project Id is required."},"region":{"label":"Region","helpText":"You can find instructions on how to obtain Region <a href=\"https://developer.huaweicloud.com/endpoint\" target=\"_blank\">here</a>.","required":"Region is required.","cn_north_1":"CN North-Beijing1","cn_north_4":"CN North-Beijing4","cn_east_3":"CN East-Shanghai1","cn_east_2":"CN East-Shanghai2","cn_south_1":"CN South-Guangzhou","cn_southwest_2":"CN Southwest-Guiyang1","ap_southeast_1":"AP-Hong-Kong","ap_southeast_2":"AP-Bangkok","ap_southeast_3":"AP-Singapore","af_south_1":"AF-Johannesburg","sa_brazil_1":"LA-Sao Paulo1","la_south_2":"LA-Santiago"},"business":{"label":"Business"},"checkAccount":"Next: Configure cluster","checkingAccount":"Authenticating...","configureNode":"Next: Configure Node","configuringNode":"Configuring...","clusterOption":{"title":"Cluster Options","detail":"Customize the cluster that will be used to launch Huawei Cloud Container Engine."},"clusterType":{"label":"Cluster Type","VirtualMachine":{"label":"VirtualMachine"},"BareMetal":{"label":"BareMetal"}},"clusterFlavor":{"label":"Cluster Flavor"},"masterVersion":{"label":"Master Version"},"vpcId":{"label":"VPC Name"},"subnetId":{"label":"Subnet Name","none":"No subnet in this VPC"},"highwaySubnet":{"label":"Highway Subnet","placeholder":"Highway Subnet","none":"No Highway Subnet can be used"},"nodeOption":{"title":"Nodes","detail":"Customize the nodes that will be used to launch Huawei Cloud Container Engine."},"dataVolumeType":{"label":"Data Volume Type"},"dataVolumeSize":{"label":"Data Volume Size"},"description":{"label":"Description","placeholder":"e.g. Cluster for Huawei CCE"},"eipBandwidthSize":{"label":"Eip Bandwidth Size"},"eipChargeMode":{"label":"Eip Charge Mode"},"eipCount":{"label":"Eip Count"},"availableZone":{"label":"Zone"},"billingMode":{"label":"Billing Mode","payPerUse":"Pay-per-use","yearly":"Yearly/Monthly"},"containerNetworkCidr":{"label":"Container Network Cidr","placeholder":"e.g. 172.16.0.0/16"},"containerNetworkMode":{"label":"Container Network Mode","none":"No config","overlay":{"label":"overlay_l2"},"underlayIpvlan":{"label":"underlay_ipvlan"},"vpcRouter":{"label":"vpc-router"}},"rootVolumeType":{"label":"Root Volume Type"},"rootVolumeSize":{"label":"Root Volume Size"},"nodeCount":{"label":"Node Count"},"nodeFlavor":{"label":"Node Flavor"},"ssh":{"label":"SSH Key Name"},"eip":{"label":"Eip"},"eipSelection":{"none":"Disabled","new":"Create Eip","exist":"Select Existed Eip"},"eipIds":{"label":"Eip","none":"No available Eip"},"eipType":{"label":"Eip Type"},"clusterLabels":{"label":"Cluster Label","none":"No label"},"nodeLabels":{"label":"Node Label"},"clusterEipId":{"label":"Cluster Eip","prompt":"Choose a Eip..."},"externalServerEnabled":{"label":"External Server","enabled":"Enabled - Only support in intranet","disabled":"Disabled - Setup cce cluster in the same vpc as Rancher server"},"highAvailability":{"label":"High Availability"},"managementScale":{"label":"Management Scale count"},"nodeOperationSystem":{"label":"Node Operation System"},"authenticatingProxyCa":{"label":"Certificate"},"validityPeriod":{"label":"Validity Period"},"bmsIsAutoRenew":{"label":"Auto Renew"},"loginMode":{"label":"Login Mode","password":"Password","keyPair":"Key Pair"},"password":{"label":"Password","placeholder":"Please enter password"},"userName":{"label":"User Name"},"authentiactionMode":{"label":"Authentiaction Mode","rbac":"RBAC","authenticating_proxy":"Authenticating Proxy"},"eipShareType":{"label":"EIP Share Type"}}}},
  'zh-hans': {"clusterNew":{"huaweicce":{"label":"华为云容器引擎","shortLabel":"Huawei CCE","name":{"label":"集群名称","required":"集群名称必须填写"},"access":{"title":"帐户访问","detail":"选择用于启动华为云容器引擎的区域和API KEY。"},"accessKey":{"label":"访问密钥ID","placeholder":"CCE访问密钥ID","help":"创建访问密钥ID参考<a href=\"https://support.huaweicloud.com/usermanual-ca/zh-cn_topic_0046606340.html\" target=\"_blank\">这里</a>。"},"secretKey":{"label":"访问密钥","placeholder":"CCE访问密钥","help":"获取访问密钥参考<a href=\"https://support.huaweicloud.com/usermanual-ca/zh-cn_topic_0046606340.html\" target=\"_blank\">这里</a>。"},"projectId":{"label":"项目ID","placeholder":"CCE项目ID","help":"获取项目ID参考<a href=\"https://support.huaweicloud.com/usermanual-ca/zh-cn_topic_0046606344.html\" target=\"_blank\">这里</a>。","required":"项目ID必须填写"},"region":{"label":"区域","helpText":"获取区域参考<a href=\"https://developer.huaweicloud.com/endpoint\" target=\"_blank\">这里</a>。","required":"区域必须填写","cn_north_1":"华北-北京一","cn_north_4":"华北-北京四","cn_east_3":"华东-上海一","cn_east_2":"华东-上海二","cn_south_1":"华南-广州","cn_southwest_2":"西南-贵阳一","ap_southeast_1":"亚太-香港","ap_southeast_2":"亚太-曼谷","ap_southeast_3":"亚太-新加坡","af_south_1":"非洲-约翰内斯堡","sa_brazil_1":"拉美-圣保罗一","la_south_2":"拉美-圣地亚哥"},"business":{"label":"业务"},"checkAccount":"下一步: 配置集群","checkingAccount":"用户校验中...","configureNode":"下一步: 配置节点","configuringNode":"配置中...","clusterOption":{"title":"集群选项","detail":"为集群自定义Kubernetes选项"},"clusterType":{"label":"集群类型","VirtualMachine":{"label":"混合集群"},"BareMetal":{"label":"裸金属集群"}},"clusterFlavor":{"label":"Cluster Flavor"},"masterVersion":{"label":"版本"},"vpcId":{"label":"虚拟私有云"},"subnetId":{"label":"所在子网","none":"无可用子网"},"highwaySubnet":{"label":"高速网卡","placeholder":"高速子网","none":"没有高速子网被使用"},"nodeOption":{"title":"节点选项","detail":"为节点自定义选项"},"dataVolumeType":{"label":"数据盘类型"},"dataVolumeSize":{"label":"数据盘大小"},"description":{"label":"描述","placeholder":"例如: 华为CCE集群"},"eipBandwidthSize":{"label":"带宽"},"eipChargeMode":{"label":"计费模式"},"eipCount":{"label":"数量"},"availableZone":{"label":"当前区域"},"billingMode":{"label":"计费模式","payPerUse":"按需计费","yearly":"包年/包月"},"containerNetworkCidr":{"label":"容器网段","placeholder":"例如: 172.16.0.0/16"},"containerNetworkMode":{"label":"网络模型","none":"无配置","overlay":{"label":"容器隧道网络"},"underlayIpvlan":{"label":"Underlay l2网络"},"vpcRouter":{"label":"VPC网络"}},"rootVolumeType":{"label":"系统盘类型"},"rootVolumeSize":{"label":"系统盘大小"},"nodeCount":{"label":"节点个数"},"nodeFlavor":{"label":"节点规格"},"ssh":{"label":"密钥对"},"eip":{"label":"弹性IP"},"eipSelection":{"none":"暂不使用","new":"创建新的","exist":"使用已有"},"eipIds":{"label":"弹性 IP","none":"无可用弹性 IP"},"eipType":{"label":"Eip 类型"},"clusterLabels":{"label":"集群标签","none":"无标签"},"nodeLabels":{"label":"主机标签"},"clusterEipId":{"label":"Cluster Eip","prompt":"选择Eip..."},"externalServerEnabled":{"label":"外部服务器","enabled":"启用 - 只支持内网","disabled":"禁用 - CCE集群将部署在Rancher所在的VPC"},"highAvailability":{"label":"高可用"},"managementScale":{"label":"集群管理规模"},"nodeOperationSystem":{"label":"操作系统"},"authenticatingProxyCa":{"label":"CA根证书"},"validityPeriod":{"label":"有效期"},"bmsIsAutoRenew":{"label":"自动更新"},"loginMode":{"label":"登录方式","password":"密码","keyPair":"密钥对"},"password":{"label":"密码","placeholder":"请输入密码"},"userName":{"label":"用户名"},"authentiactionMode":{"label":"认证模式","rbac":"RBAC","authenticating_proxy":"认证代理"},"eipShareType":{"label":"共享Eip类型"}}}}
};

const ZONES = [
  {
    label: 'clusterNew.huaweicce.region.cn_north_1',
    value: 'cn-north-1',
    supportBareMetal: true
  },{
    label: 'clusterNew.huaweicce.region.cn_north_4',
    value: 'cn-north-4',
    supportBareMetal: true
  },{
    label: 'clusterNew.huaweicce.region.cn_east_3',
    value: 'cn-east-3',
  },{
    label: 'clusterNew.huaweicce.region.cn_east_2',
    value: 'cn-east-2',
  },{
    label: 'clusterNew.huaweicce.region.cn_south_1',
    value: 'cn-south-1',
    supportBareMetal: true
  },{
    label: 'clusterNew.huaweicce.region.cn_southwest_2',
    value: 'cn-southwest-2',
    supportBareMetal: true
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


/*!!!!!!!!!!!DO NOT CHANGE START!!!!!!!!!!!*/
export default Ember.Component.extend(ClusterDriver, {
  driverName:  '%%DRIVERNAME%%',
  configField: '%%DRIVERNAME%%EngineConfig',
  app:         service(),
  router:      service(),
  session:     service(),
  intl:        service(),

  layout:            null,
  configField:       'huaweiEngineConfig',

  zones:       ZONES,
  clusterType: [
    {
      label: 'clusterNew.huaweicce.clusterType.VirtualMachine.label',
      value: 'VirtualMachine',
    }, {
      label: 'clusterNew.huaweicce.clusterType.BareMetal.label',
      value: 'BareMetal',
    }],
  masterVersions: [
    {
      label: 'v1.13.10',
      value: 'v1.13.10',
    }, {
      label: 'v1.15.6',
      value: 'v1.15.6',
    }],
  eipChargeModeContent: [
    {
      label: 'BandWith',
      value: null,
    }, {
      label: 'Traffic',
      value: 'traffic',
    }],
  containerNetworkMode: [
    {
      label: 'overlay_l2',
      value: 'overlay_l2',
    }, {
      label: 'underlay_ipvlan',
      value: 'underlay_ipvlan',
    }, {
      label: 'vpc-router',
      value: 'vpc-router',
    }],
  volumeTypeContent: [
    {
      label: 'SATA',
      value: 'SATA',
    }, {
      label: 'SAS',
      value: 'SAS',
    }, {
      label: 'SSD',
      value: 'SSD',
    }],
  eipTypeContent: [
    {
      label: '5_bgp',
      value: '5_bgp',
    }, {
      label: '5_sbgp',
      value: '5_sbgp',
    }],
  containerNetworkModeContent: [
    {
      label: 'clusterNew.huaweicce.containerNetworkMode.overlay.label',
      value: 'overlay_l2',
    }, {
      label: 'clusterNew.huaweicce.containerNetworkMode.underlayIpvlan.label',
      value: 'underlay_ipvlan',
    }, {
      label: 'clusterNew.huaweicce.containerNetworkMode.vpcRouter.label',
      value: 'vpc-router',
    }],
  nodeOperationSystemContent: [
    {
      label: 'EulerOS 2.5',
      value: 'EulerOS 2.5',
    }, {
      label: 'CentOS 7.6',
      value: 'CentOS 7.6',
    }],
  containerNetworkCidrContent: [
    {
      label: '172.16.0.0/16',
      value: '172.16.0.0/16'
    }
  ],
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
  authConfigred:           false,
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
        masterVersion:         'v1.13.10',
        billingMode:           0,
        containerNetworkMode:  'overlay_l2',
        clusterFlavor:         'cce.s2.small',
        dataVolumeType:        'SATA',
        rootVolumeType:        'SATA',
        nodeCount:             1,
        rootVolumeSize:        40,
        externalServerEnabled: false,
        nodeOperationSystem:   'EulerOS 2.5',
        containerNetworkCidr:  '172.16.0.0/16',
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

    errors = this.validateFields(errors, ['sshKey'], 'config')

    if (get(this, 'config.authentiactionMode') === 'authenticating_proxy') {
      errors = this.validateFields(errors, ['authenticatingProxyCa'], 'config')
    }
    set(this, 'errors', errors);

    return errors.length === 0
  },

  actions: {
    multiEipSelect() {
      let options = Array.prototype.slice.call(this.$('.existing-eips')[0], 0);
      let selectedOptions = [];

      options.filterBy('selected', true).forEach((cap) => {
        return selectedOptions.push(cap.value);
      });

      set(this, 'config.eipIds', selectedOptions || []);
    },

    async checkAccount(cb) {
      const requiredConfig = ['projectId', 'accessKey', 'secretKey', 'region']
      const requiredCluster = ['name']

      set(this, 'errors', [])
      let errors = [];

      errors = this.validateFields(errors, requiredConfig, 'config')
      errors = this.validateFields(errors, requiredCluster, 'cluster')
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

      this.regionChange();

      try {
        await this.getVpcs();
        await this.getSubnet();
        await this.getNetwork();
        // await this.getVersions();

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

    configreNode(cb) {
      const requiredConfig = ['vpcId', 'subnetId', 'containerNetworkCidr']

      set(this, 'errors', [])
      let errors = [];

      errors = this.validateFields(errors, requiredConfig, 'config')
      if (errors.length > 0) {
        set(this, 'errors', errors);
        cb();

        return;
      }

      if (get(this, 'authConfigred')) {
        set(this, 'step', 3)
        cb()

        return
      }
      try {
        const location = window.location;
        const region = get(this, 'config.region')
        let endpoint = `ecs.${ region }.myhuaweicloud.com`;

        endpoint = `${ get(this, 'app.proxyEndpoint')  }/${  endpoint.replace('//', '/') }`;
        endpoint = `${ location.origin }${ endpoint }`;

        var client = new HW.ECS({
          ak:           get(this, 'config.accessKey'),
          sk:           get(this, 'config.secretKey'),
          projectId:    get(this, 'config.projectId'),
          endpoint,
          region,
          toSignedHost: `ecs.${ region }.myhuaweicloud.com`,
          service:      'ecs',
        })

        client.listCloudServerFlavors((err, response) => {
          if (err) {
            let errors = this.get('errors') || [];

            errors.pushObject(err);
            set(this, 'errors', errors);
            cb();

            return;
          }

          set(this, 'nodeFlavors', response.body.flavors)

          if (get(this, 'mode') === 'new') {
            set(this, 'config.nodeFlavor', response.body.flavors[0] && response.body.flavors[0].name || null)
          }
          client.listKeypairs((err, response) => {
            if (err) {
              let errors = this.get('errors') || [];

              errors.pushObject(err);
              set(this, 'errors', errors);
              cb();

              return;
            }

            set(this, 'keypairs', response.body.keypairs)

            const keypairs = response.body.keypairs || []

            set(this, 'config.sshKey', keypairs[0] && keypairs[0].keypair.name)

            client.getAvaliableZone((err, response) => {
              if (err) {
                let errors = this.get('errors') || [];

                errors.pushObject(err);
                set(this, 'errors', errors);
                cb();

                return;
              }

              const availableZones = (response.body.availabilityZoneInfo || []).filter((z) => z.zoneState.available)

              set(this, 'availableZones', availableZones)

              if (get(this, 'mode') === 'new') {
                setProperties(this, {
                  'config.keypairs':      response.body.availabilityZoneInfo[0] && response.body.availabilityZoneInfo[0].zoneName || null,
                  'config.availableZone': availableZones.get('firstObject.zoneName'),
                })
              }
              set(this, 'step', 3)
            })
          })
        })
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

      if (errors.length > 0) {
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

  regionChange: observer('config.region', function() {
    const clusterTypes = [];
    const region = get(this, 'config.region');
    const selectedRegion = get(this, 'zones').find((item) => item.value === region);

    if (!selectedRegion) {
      return;
    }

    if (get(selectedRegion, 'supportBareMetal')) {
      return set(get(this, 'clusterType').find((item) => item.value === 'BareMetal'), 'disabled', false)
    }

    set(get(this, 'clusterType').find((item) => item.value === 'BareMetal'), 'disabled', true)

  }),

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

  externalServerChange: observer('config.externalServerEnabled', function() {
    const externalServerEnabled = get(this, 'config.externalServerEnabled')

    if ( !externalServerEnabled ) {
      set(this, 'config.clusterEipId', null)
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

  managementScaleContent: computed('config.clusterType', function() {
    const clusterType = get(this, 'config.clusterType')

    if (clusterType === 'BareMetal') {
      return [
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
    }

    return [
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

  editedSubnetName: computed('config.subnetId', function() {
    const subnetId = get(this, 'config.subnetId')
    const subnets = get(this, 'subnets') || []
    const filter = subnets.filter((s) => s.id === subnetId)[0] || {}

    return filter.name
  }),

  eipIdContent: computed('eipIds.[]', function() {
    const eipIds = get(this, 'eipIds') || []

    return eipIds.filter((e) => e.status === 'DOWN').map((e) => ({
      label: e.public_ip_address,
      value: e.id
    }))
  }),

  clusterEipName: computed('config.clusterEipId', function() {
    const eipIds = get(this, 'eipIds') || []
    const clusterEipId = get(this, 'config.clusterEipId')
    const filter = eipIds.filter((e) => e.id === clusterEipId)[0] || {}

    return filter.public_ip_address
  }),

  nodeFlavorContent: computed('nodeFlavors.[]', function() {
    const nodeFlavors = get(this, 'nodeFlavors') || []

    return nodeFlavors.map((n) => {
      return {
        label: `${ n.name } ( vCPUs: ${ n.vcpus }, memory: ${ n.ram / 1024 } GB )`,
        value: n.name
      }
    })
  }),

  availableZoneContent: computed('availableZones.[]', function() {
    const zones = get(this, 'availableZones')

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
    const keypairs = get(this, 'keypairs')

    return keypairs.map((k) => {
      return {
        label: k.keypair.name,
        value: k.keypair.name
      }
    })
  }),

  editedSshName: computed('config.sshKey', function() {
    const sshKey = get(this, 'config.sshKey')
    const keypairs = get(this, 'keypairs')
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

  networkContent: computed('networks.[]', function() {
    const networks = get(this, 'networks')
    const publicCloud = get(this, 'publicCloud')
    let arr = []

    if (publicCloud) {
      arr = networks.filter((n) => n.status === 'ACTIVE' && n.tenant_id === get(this, 'config.projectId') && n[`provider:network_type`] === 'geneve')
    } else {
      arr = networks.filter((n) => n.status === 'ACTIVE')
    }

    return arr.map((a) => ({
      label: a.name,
      value: a.id
    }))
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

  validateFields(errors = [], requiredFields = [], parent = null) {
    const intl = get(this, 'intl')

    if (parent) {
      requiredFields.map((item) => {
        if (!get(this, `${ parent }.${ item }`)) {
          errors.pushObject(`"${ intl.t(`clusterNew.huaweicce.${ item }.label`) }" ${ intl.t(`generic.isRequired`) }`);
        }
      })
    } else {
      requiredFields.map((item) => {
        if (!get(this, `${ item }`)) {
          errors.pushObject(`"${ intl.t(`clusterNew.huaweicce.${ item }.label`) }" ${ intl.t(`generic.isRequired`) }`);
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

    return new EmberPromise((resolve, reject) => {
      this.getClient('vpc').getVpcs((err, res) => {
        if ( err ) {
          return reject(err)
        }

        set(this, 'vpcs', res.body.vpcs)

        if (get(this, 'mode') === 'new') {
          set(this, 'config.vpcId', res.body.vpcs[0] && res.body.vpcs[0].id || null)
        }

        resolve()
      })
    })

  },

  getSubnet() {
    return new EmberPromise((resolve, reject) => {
      this.getClient('vpc').getSubnet((err, response) => {
        if (err) {
          return reject(err);
        }

        set(this, 'subnets', response.body.subnets)

        if (get(this, 'mode') === 'new') {
          set(this, 'config.subnetId', response.body.subnets[0] && response.body.subnets[0].id || null)
        }

        resolve()
      })
    })

  },

  getNetwork() {
    return new EmberPromise((resolve, reject) => {
      this.getClient('vpc').getNetwork((err, response) => {
        if (err) {
          return reject(err)
        }
        set(this, 'publicCloud', true)
        set(this, 'networks', response.body.networks)

        resolve()
      })
    })
  },

  getVersions() {
    return new EmberPromise((resolve, reject) => {
      this.getClient('cce').getVersions((err, response) => {
        if (err) {
          return reject(err)
        }
        console.log(response.body)
        resolve()
      })
    })
  },

  getClient(prefix) {
    const location = window.location;
    const region = get(this, 'config.region')
    let endpoint = `${ prefix }.${ region }.myhuaweicloud.com`;

    endpoint = `${ get(this, 'app.proxyEndpoint')  }/${  endpoint.replace('//', '/') }`;
    endpoint = `${ location.origin }${ endpoint }`;

    return new HW.ECS({
      ak:           get(this, 'config.accessKey'),
      sk:           get(this, 'config.secretKey'),
      projectId:    get(this, 'config.projectId'),
      endpoint,
      region,
      toSignedHost: `${ prefix }.${ region }.myhuaweicloud.com`,
    })
  },
});
