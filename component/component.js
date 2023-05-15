/*!!!!!!!!!!!Do not change anything between here (the DRIVERNAME placeholder will be automatically replaced at buildtime)!!!!!!!!!!!*/
import ClusterDriver from 'shared/mixins/cluster-driver';

// do not remove LAYOUT, it is replaced at build time with a base64 representation of the template of the hbs template
// we do this to avoid converting template to a js file that returns a string and the cors issues that would come along with that
const LAYOUT;
const LANGUAGE;
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

const languages = LANGUAGE;

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
      label: 'v1.25',
      value: 'v1.25',
      rancherEnabled: false,
    },
    {
      label: 'v1.23',
      value: 'v1.23',
      rancherEnabled: true,
    },
  ],
  eipChargeModeContent: [
    {
      label: 'clusterNew.huaweicce.eipChargeMode.bandwith',
      value: 'bandwith',
    }, {
      label: 'clusterNew.huaweicce.eipChargeMode.traffic',
      value: 'traffic',
    }],
  eipTypeContent: [
    {
      label: 'clusterNew.huaweicce.eipType.bgp',
      value: '5_bgp',
    }, {
      label: 'clusterNew.huaweicce.eipType.sbgp',
      value: '5_sbgp',
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
        kubernetesSvcIpRange:  '',
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
      const requiredConfig = ['vpcId', 'subnetId', 'containerNetworkCidr', 'kubernetesSvcIpRange'];
      const cidrIPV4RegExp = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\/\d{1,2}$/;
      const intl = get(this, 'intl');

      set(this, 'errors', [])
      let errors = [];

      errors = this.validateFields(errors, requiredConfig, 'config');

      if(get(this, 'config.containerNetworkCidr') && !cidrIPV4RegExp.test(get(this, 'config.containerNetworkCidr'))){
        errors.pushObject(intl.t('clusterNew.huaweicce.containerNetworkCidr.cidrFormatError'))
      }
      if(get(this, 'config.kubernetesSvcIpRange') && !cidrIPV4RegExp.test(get(this, 'config.kubernetesSvcIpRange'))){
        errors.pushObject(intl.t('clusterNew.huaweicce.kubernetesSvcIpRange.cidrFormatError'))
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

  nodeOperationSystemContent: computed('config.masterVersion', function() {
    const types = ['EulerOS 2.9', 'CentOS 7.6', 'EulerOS 2.5'];
    const containerNetworkMode = get(this, 'config.containerNetworkMode');

    if(containerNetworkMode !== 'overlay_l2'){
      types.push('Ubuntu 18.04');
    }

    return types.map(item=>({
      label: item,
      value: item
    }))
  }),
  containerNetworkModeContent: computed('config.clusterType', function() {
    const choices     = CONTAINER_NETWORK_MODES;
    const clusterType = get(this, 'config.clusterType');

    return choices.filter((choice) => choice.bare === (clusterType === 'BareMetal'))
  }),

  rootVolumeTypeShowValue: computed('config.rootVolumeType', 'intl.locale', function() {
    return this.displayField('rootVolumeType', get(this, 'volumeTypeContent'));
  }),
  dataVolumeTypeShowValue: computed('config.dataVolumeType', 'intl.locale', function() {
    return this.displayField('dataVolumeType', get(this, 'volumeTypeContent'));
  }),

  regionShowValue: computed('config.region', 'intl.locale', function() {
    return this.displayField('region', get(this, 'zones'));
  }),
  availableZoneShowValue: computed('config.availableZone', 'intl.locale', function() {
    return this.displayField('availableZone');
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
      value: s.neutron_subnet_id,
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
    const filter = vipSubnets.filter((s) => s.neutron_subnet_id === subnetId)[0] || {}

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
    const intl = get(this, 'intl');
    const zones = get(this, 'availableZones') || [];
    const region = get(this, 'config.region');
    const out = [];

    zones.forEach(obj=>{
      const id = get(obj, 'zoneName') || '';

      if(get(obj, 'zoneState.available') && id.startsWith(region)) {

        const num = id.substr(region.length,1).charCodeAt() - 96;

        out.push({
          label: intl.t('clusterNew.huaweicce.availableZone.value', {num}),
          value: id
        });
      }
    });

    return out;
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
      return v.value === kubernetesVersion && !v.rancherEnabled
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

  displayField(key, choices){
    const intl = get(this, 'intl');
    const value = get(this, `config.${key}`);
    const content = choices || get(this, `${key}Content`);
    const current = content.findBy('value', value);
    const label = get(current, 'label');

    return label.includes('clusterNew.huaweicce') ? intl.t(label) : label;
  }
});
