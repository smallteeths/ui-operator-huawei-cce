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

const languages = LANGUAGE;

const MANAGEMENT_SCALE_VIRTUAL = [{
  label: '50',
  value: 'small',
}, {
  label: '200',
  value: 'medium',
}, {
  label: '1000',
  value: 'large',
}, {
  label: '2000',
  value: 'xlarge',
}]

const CONTAINER_NETWORK_MODES = [{
  label: 'clusterNew.huaweicce.containerNetworkMode.overlay.label',
  value: 'overlay_l2',
  bare: false,
// }, {
//   label: 'clusterNew.huaweicce.containerNetworkMode.underlayIpvlan.label',
//   value: 'underlay_ipvlan',
//   bare: true,
}, {
  label: 'clusterNew.huaweicce.containerNetworkMode.vpcRouter.label',
  value: 'vpc-router',
  bare: false
}]

const BILLING_MODES = [{
  label: 'clusterNew.huaweicce.billingMode.payPerUse',
  value: 0,
}, {
  label: 'clusterNew.huaweicce.billingMode.yearly',
  value: 1,
}];

const DEFAULT_NODE_GROUP_CONFIG = {
  name:            'default-nodepool',
  flavor:          't6.large.2',
  availableZone:   null,
  sshKey:          null,
  rootVolume:      {},
  dataVolumes:     [],
	billingMode:     null, 
	OperatingSystem: null, 
	// PublicIP:        null, 
	// extendParam:     null, 
	tags:            null, 
	count:           null, 
  runtime:         'containerd',
}

const BILLING_MODE_VALIDITY_PERIOD = {
  month: [1,2,3,4,5,6,7,8,9],
  year:  [1,2,3],
}

/*!!!!!!!!!!!GLOBAL CONST END!!!!!!!!!!!*/

export default Ember.Component.extend(ClusterDriver, {
  driverName:  '%%DRIVERNAME%%',
  configField: 'cceConfig',
  app:         service(),
  router:      service(),
  session:     service(),
  intl:        service(),

  layout:       null,
  volumeTypes: [],
  versionChoices: [
    {
      label: 'v1.23',
      value: 'v1.23',
      rancherEnabled: true,
    },
  ],
  eipChargeModeChoices: [
    {
      label: 'clusterNew.huaweicce.eipChargeMode.bandwidth',
      value: 'bandwidth',
    }, {
      label: 'clusterNew.huaweicce.eipChargeMode.traffic',
      value: 'traffic',
    }],
  eipTypeChoices: [
    {
      label: 'clusterNew.huaweicce.eipType.bgp',
      value: '5_bgp',
    }, {
      label: 'clusterNew.huaweicce.eipType.sbgp',
      value: '5_sbgp',
    },
  ],


  vpcs:                    null,
  subnets:                 null,
  eipIds:                  null,
  step:                    1,
  eipSelection:            'none',
  highAvailabilityEnabled: 's2',
  managementScale:         'small',
  validityPeriod:          '1 month',
  publicCloud:             null,
  nodePoolList:            [],
  config:                  null,

  authenticatingProxyCa:         null,
  authenticatingProxyCert:       null,
  authenticatingProxyPrivateKey: null,

  sshKeyChoices:           [],
  securityGroupChoices:    [],
  validityPeriodChoices:   [],
  eipChoices:              [],

  flavorChoicesByZones:     {},
  volumeTypeChoicesByZones: {},
  
  loadedRegionFor:             null,
  cloudCredentialDriverName:   'huawei',
  containerNetworkModeChoices: CONTAINER_NETWORK_MODES,
  managementScaleChoices:      MANAGEMENT_SCALE_VIRTUAL,
  billingModeChoices:          BILLING_MODES,
  clusterChoices:              [],

  isNew:   equal('mode', 'new'),
  editing: equal('mode', 'edit'),

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
        regionID:              '',
        dataVolumeSize:        100,
        vpcId:                 null,
        version:               'v1.23',
        billingMode:           0,
        containerNetworkMode:  'vpc-router',
        clusterFlavor:         'cce.s2.small',
        dataVolumeType:        null,
        rootVolumeType:        null,
        rootVolumeSize:        40,
        externalServerEnabled: false,
        containerNetworkCidr:  '10.0.0.0/16',
        kubernetesSvcIPRange:  '10.247.0.0/16',
        bmsIsAutoRenew:        'false',
        userName:              'root',
        authentiactionMode:    'rbac',
        eipChargeMode:         'bandwidth',
        securityGroup:         '',
        kubeProxyMode:         'iptables',
      });

      set(this, 'config', config);
      this.validityPeriodChange();
    } else {
      const clusterFlavor = get(config, 'flavor');

      if ( clusterFlavor ) {
        const arr = clusterFlavor.split('.')

        setProperties(this, {
          'highAvailabilityEnabled': arr[1],
          'managementScale':         arr[2]
        });
      }
      this.initConfig(config);
    }

    this.setValidityPeriodChoices();
  },

  validate() {
    this._super(...arguments);

    const errors = [];
    const intl = get(this, 'intl');

    this.validateFields(errors, ['name'], 'cluster');
    this.validateFields(errors, ['sshKey', 'flavor', 'nodePoolName'], 'nodePoolList')

    // nodepool name unique validate
    const nodePoolList = get(this, 'nodePoolList');
    const nodePoolNames = [];

    nodePoolList.forEach(nodePool=>{
      if(nodePoolNames.includes(nodePool.nodePoolName)){
        errors.pushObject(intl.t('clusterNew.huaweicce.nodePoolName.same', {name: nodePool.nodePoolName}))
      } else {
        nodePoolNames.push(nodePool.nodePoolName);
      }
    })

    if(get(this, 'primaryResource.name') && get(this, 'primaryResource.name.length') < 4){
      errors.pushObject(intl.t('clusterNew.huaweicce.name.minLengthError'))
    }

    if (get(this, 'config.authentiactionMode') === 'authenticating_proxy') {
      this.validateFields(errors, ['authenticatingProxyCa', 'authenticatingProxyCert', 'authenticatingProxyPrivateKey'], 'config')
    }

    return errors
  },

  actions: {
    async huaweiLogin(cb) {
      try {
        let step;
        let hash = [
          this.getVpcs(),
          this.getEipIds(),
          this.getVipSubnet(),
          this.fetchVolumeTypes(),
          this.fetchAvailableZones(),
          this.fetchSecurityGroups(),
          this.fetchKeypairs(),
          this.fetchEips(),
        ];

        if (this.isImportProvider && this.isNew){
          step = 1.5;
          await this.fetchClusters();

          set(this, 'step', step);
          cb && cb(true);

          return;
        } else if (this.isImportProvider && !this.isNew) {
          step = 3;
        } else {
          step = 2;
        }

        await all(hash);
        set(this, 'step', step);
        cb && cb(true);
      } catch (e) {
        const errors = [];

        errors.push(get(e, 'body.Message') || get(e, 'body.message') || e);
        set(this, 'errors', errors);
        cb && cb();
      }
    },

    registerCluster(cb){
      setProperties(this, { 'errors': null });

      const errors = get(this, 'errors') || [];
      const clusterID = get(this, 'config.clusterId')
      const intl    = get(this, 'intl');

      if ( !clusterID ) {
        errors.push(intl.t('clusterNew.huaweicce.clusterSelect.required'));
      }

      if (errors.length > 0) {
        set(this, 'errors', errors);
        cb();

        return;
      }

      const config = {
        imported: true,
        name: get(this, 'primaryResource.name'),
        huaweiCredentialSecret: get(this, 'primaryResource.cloudCredentialId'),
        clusterID,
        regionID: get(this, 'selectedCloudCredential.regionID'),
      }

      set(this, 'cluster.cceConfig', config);

      this.send('driverSave', cb);
    },

    async configureNode(cb) {
      const requiredConfig = ['containerNetworkCidr', 'kubernetesSvcIPRange'];
      const cidrIPV4RegExp = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\/\d{1,2}$/;
      const intl = get(this, 'intl');

      set(this, 'errors', [])
      let errors = [];

      errors = this.validateFields(errors, requiredConfig, 'config');

      if(get(this, 'config.containerNetworkCidr') && !cidrIPV4RegExp.test(get(this, 'config.containerNetworkCidr'))){
        errors.pushObject(intl.t('clusterNew.huaweicce.containerNetworkCidr.cidrFormatError'))
      }
      if(get(this, 'config.kubernetesSvcIPRange') && !cidrIPV4RegExp.test(get(this, 'config.kubernetesSvcIPRange'))){
        errors.pushObject(intl.t('clusterNew.huaweicce.kubernetesSvcIPRange.cidrFormatError'))
      }

      if (errors.length > 0) {
        set(this, 'errors', errors);
        cb();

        return;
      }

      if(!this.nodePoolList || !this.nodePoolList.length){
        this.send('addNodePool');
      } else {

        // edited
        this.nodePoolList.forEach(nodePool=>{
          const displayShowValue = {
            displayFlavor:         nodePool.flavor,
            displayRootVolumeType: intl.t(`clusterNew.huaweicce.volumetype.${nodePool.rootVolumeType}`),
            displayDataVolumeType: intl.t(`clusterNew.huaweicce.volumetype.${nodePool.dataVolumeType}`),
            displayBillingMode:    this.configNameDisplay(nodePool.billingMode, get(this,'billingModeChoices'), true),
            displayAvailableZone:  this.configNameDisplay(nodePool.availableZone, get(this,'availableZoneChoices')),
            displaySshKey:         this.configNameDisplay(nodePool.sshKey, get(this,'sshKeyChoices')),
          }

          Object.assign(nodePool, displayShowValue);
        })
          
      }

      try {
        const hash = [
          // this.listKeypairs(),
        ];

        this.nodePoolList.forEach(nodePool=>{
          hash.push(this.fetchFlavors(nodePool));
        })

        // await this.getAvaliableZone();
        // await this.fetchFlavors();
        // await this.listKeypairs();
        // await this.fetchAvailableZones();

        
        await all(hash);
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
      if( !section ){
        return;
      }
      let obj = {}

      section.map((s) => {
        if (s.key && s.value) {
          obj[s.key] = s.value
        }
      })

      set(this, 'config.tags', obj)
      set(this, 'config.taglength', Object.keys(obj).length)
    },

    finishAndSelectCloudCredential(cred) {
      if (cred) {
        set(this, 'config.regionID', get(cred, 'huaweicredentialConfig.regionID'));
        set(this, 'primaryResource.cloudCredentialId', get(cred, 'id'));

        this.send('huaweiLogin');
      }
    },

    addNodePool() {
      let nodePoolList = get(this, 'nodePoolList');
      const volumeTypeChoicesByZones = get(this, 'volumeTypeChoicesByZones');
      const availableZone = this.getDefaultSelected(this.availableZoneChoices);
      const volumeTypeChoices = volumeTypeChoicesByZones[availableZone]  || [];
      const volumeType = this.getDefaultSelected(volumeTypeChoices);
      const flavorChoicesByZones = get(this, 'flavorChoicesByZones');
      const flavorChoices = flavorChoicesByZones[availableZone] || [];
      const { sshKeyChoices, operatingSystemChoices } = this;
      const nodePoolConfig = {
        ...DEFAULT_NODE_GROUP_CONFIG,
        availableZone,
        billingMode:       0,
        bmsIsAutoRenew:    false,
        rootVolumeType:    volumeType,
        dataVolumeType:    volumeType,
        dataVolumeSize:    '100',
        rootVolumeSize:    '50',
        initialNodeCount:  '1',
        operatingSystem:   this.getDefaultSelected(operatingSystemChoices),
        sshKey:            this.getDefaultSelected(sshKeyChoices),
        flavor:            this.getDefaultSelected(flavorChoices, 'c7.large.2'),
        volumeTypeChoices,
        flavorChoices,
        // securityGroup:     this.getDefaultSelected(securityGroupChoices),
      };

      if (!Array.isArray(nodePoolList)) {
        nodePoolList = [];
      }

      nodePoolList.pushObject(nodePoolConfig);

      set(this, 'nodePoolList', nodePoolList);
    },

    removeNodePool(nodeGroup) {
      let { nodePoolList } = this;

      if (nodePoolList && nodePoolList.length) {
        nodePoolList.removeObject(nodeGroup);
      }

      set(this, 'nodePoolList', nodePoolList);
    },

    save(cb) {
      const errors = this.validate();

      if (errors.length > 0) {
        set(this, 'errors', errors);
        cb();

        return;
      }

      const intl = get(this, 'intl');


      
      const config = this.formatConfig();

      set(this, 'cluster.cceConfig', config);

      this.send('driverSave', cb);
    },

    cancel(){
      // probably should not remove this as its what every other driver uses to get back
      get(this, 'router').transitionTo('global-admin.clusters.index');
    },

    // nodePool choices config change
    availableZoneChange(nodePool) {
      const flavorChoicesByZones = get(this, 'flavorChoicesByZones');
      const volumeTypeChoicesByZones = get(this, 'volumeTypeChoicesByZones');
      const zoneID = get(nodePool, 'availableZone');
      const flavorChoices = flavorChoicesByZones[zoneID] || [];
      const volumeTypeChoices = volumeTypeChoicesByZones[zoneID] || [];

      set(nodePool, 'flavorChoices', flavorChoices);
      set(nodePool, 'flavor', this.getDefaultSelected(flavorChoices, 'c7.large.2'));
      set(nodePool, 'volumeTypeChoices', volumeTypeChoices);
      set(nodePool, 'volumeType', this.getDefaultSelected(volumeTypeChoices));
      set(nodePool, 'rootVolumeType', this.getDefaultSelected(volumeTypeChoices));

    },
    billingModeChange(nodePool, billingMode){
      if(get(billingMode, 'value') === 1){
        set(nodePool, 'validityPeriod', this.getDefaultSelected(get(this, 'validityPeriodChoices')));
        set(nodePool, 'bmsIsAutoRenew', 'false');
      }
    }
  },

  languageDidChanged: observer('intl.locale', function() {
    const lang = get(this, 'intl.locale');
    if (lang) {
      this.loadLanguage(lang[0]);
    }

  }),

  initConfig(config){
    const nodePoolList = [];
    const nodePools = get(this, 'config.nodePools') || [];

    nodePools.forEach(nodePool=>{
      const {flavor, availableZone, operatingSystem, sshKey, rootVolume, dataVolumes, billingMode, runtime} = get(nodePool, 'nodeTemplate');
      const out = {
        nodePoolName: nodePool.name,
        initialNodeCount: nodePool.initialNodeCount,
        // nodeTemplate
        flavor,
        availableZone,
        operatingSystem,
        sshKey,
        rootVolumeSize: rootVolume.size,
        rootVolumeType: rootVolume.type,
        dataVolumeSize: dataVolumes[0].size,
        dataVolumeType: dataVolumes[0].type,
        billingMode,
        runtime,
      }

      if(nodePool.nodePoolID){
        out.nodePoolID = nodePool.nodePoolID;
      }

      let displayShowValue = {};

      nodePoolList.push(Object.assign(out, displayShowValue));
    });

    const { containerNetwork, version, hostNetwork, kubernetesSvcIPRange, description, authentication, tags, clusterID, publicIP, kubeProxyMode } = get(this, 'config');

    const out = {
      containerNetworkCidr: containerNetwork.cidr,
      containerNetworkMode: containerNetwork.mode,
      version,
      vpcId: hostNetwork.vpcID,
      subnetId: hostNetwork.subnetID,
      securityGroup: hostNetwork.securityGroup,
      kubernetesSvcIPRange,
      description,
      authentiactionMode: authentication.mode,
      tags,
      taglength: Object.keys(tags || {}).length,
      clusterID,
      kubeProxyMode,
    };

    if(get(config, 'publicAccess')){
      if(get(config, 'publicIP.eip.ipType')){
        set(this, 'eipSelection', 'new')
        out.eipBandwidthSize = get(publicIP, 'eip.bandwidth.size');
        out.eipChargeMode = get(publicIP, 'eip.bandwidth.chargeMode');
        out.eipType = get(publicIP, 'eip.ipType');
      } else if (get(config, 'extendParam.clusterExternalIP') || get(this, 'cluster.cceStatus.clusterExternalIP')) {
        set(this, 'eipSelection', 'exist')
      }
    } else {
      set(this, 'eipSelection', 'none')
    }

    if(authentication.mode === 'authenticating_proxy'){
      const {ca, cert, privateKey} = get(authentication, 'authenticatingProxy') || {};

      out.authenticatingProxyCa = AWS.util.base64.decode(ca);
      out.authenticatingProxyCert = AWS.util.base64.decode(cert);
      out.authenticatingProxyPrivateKey = AWS.util.base64.decode(privateKey);
    }

    set(this, 'nodePoolList', nodePoolList);
    set(this, 'config', out);
  },

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
  vpcIdChange: observer('config.vpcId', function() {
    this.getSubnet();
    const vpcId = get(this, 'config.vpcId')
    const subnets = get(this, 'subnets') || []

    const filter = subnets.filter((s) => s.vpc_id === vpcId)

    set(this, 'config.subnetId', '')
  }),

  eipSelectionChange: observer('eipSelection', function() {
    const eipSelection = get(this, 'eipSelection');
    const eipChoices = get(this, 'eipChoices');
    
    if (eipSelection === 'new') {
      setProperties(this, {
        'config.eipType':          '5_bgp',
        'config.eipBandwidthSize': 1,
        'config.eipShareType':     'PER',
      })
    } else if (eipSelection === 'exist'){
      setProperties(this, {
        'config.clusterExternalIP':    this.getDefaultSelected(eipChoices),
      })
    }
  }),

  managementScaleObserver: observer('managementScaleNum', function() {
    const { managementScaleNum } = this;

    if(managementScaleNum > 200){
      set(this, 'highAvailabilityEnabled', 's2');
    }
  }),

  // Any computed properties or custom logic can go here
  isActive: computed('cluster', function() {
    return get(this, 'cluster.isActive');
  }),
  isImportProvider: computed('router.currentRoute.queryParams', 'config.imported', function() {
    const { router } = this;
    const imported = get(this, 'config.imported');

    return imported || get(router, 'currentRoute.queryParams.importProvider') === 'cce';
  }),

  cloudCredentials: computed('model.cloudCredentials', function() {
    const { model: { cloudCredentials } } = this;

    return cloudCredentials.filter((cc) => get(cc, 'huaweicredentialConfig'));
  }),
  selectedCloudCredential: computed('primaryResource.cloudCredentialId', 'model.cloudCredentials.length', 'config.regionID', function() {
    const cloudCredential = get(this, 'model.cloudCredentials').findBy('id', get(this, 'primaryResource.cloudCredentialId'));

    if( !cloudCredential ){
      return {};
    }

    const intl = get(this, 'intl');
    const regionId = get(cloudCredential, 'huaweicredentialConfig.regionID') || get(this, 'config.regionID') || '';
    cloudCredential.regionName = intl.t(`clusterNew.huaweicce.region.${regionId.replace(/\-/g, '_')}`);
    cloudCredential.regionID = regionId;

    return cloudCredential;
  }),

  nodePoolActive: computed('nodePoolList.@each.{nodePoolID,nodePoolList}', function() {
    const list = get(this, 'nodePoolList') || [];

    return list.every((item) => {
      return item.nodePoolID;
    })
  }),

  managementScaleNum: computed('managementScale', function() {
    const { managementScale, managementScaleChoices } = this;

    const option = managementScaleChoices.findBy('value', managementScale);


    return get(managementScaleChoices.findBy('value', managementScale), 'label');
  }),

  clusterFlavorObserver: observer('managementScale', 'highAvailabilityEnabled', function() {
    const { managementScale, highAvailabilityEnabled } = this;

    set(this, 'config.clusterFlavor', `cce.${ highAvailabilityEnabled }.${ managementScale }`)
    // cce.s2.small
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
    if (billingMode === 1) {
      setProperties(this, {
        'config.bmsIsAutoRenew': 'false',
        'validityPeriod':        '1 month',
      })
    }
  }),

  containerNetworkModeChoicesChange: observer('containerNetworkModeChoices.[]', function() {
    set(this, 'config.containerNetworkMode', get(this, 'containerNetworkModeChoices.firstObject.value'))
  }),

  eipIdChoicesChange: observer('eipIdChoices.@each.active', function() {
    set(this, 'config.eipIds', []);
    get(this, 'eipIdChoices').forEach((item) => {
      if (item.active) {
        get(this, 'config.eipIds').pushObject(get(item, 'value'))
      }
    })
  }),

  operatingSystemChoices: computed('config.version', function() {
    const types = ['EulerOS 2.9', 'CentOS 7.6', 'EulerOS 2.5'];
    const containerNetworkMode = get(this, 'config.containerNetworkMode');

    if(containerNetworkMode !== 'overlay_l2'){
      types.push('Huawei Cloud EulerOS 2.0', 'Ubuntu 22.04', 'Ubuntu 18.04');
    }

    return types.map(item=>({
      label: item,
      value: item
    }))
  }),

  securityGroupShowValue: computed('securityGroupChoices.[]', 'config.securityGroup', 'intl.locale', function() {
    return this.configNameDisplay(get(this, 'config.securityGroup'), get(this, 'securityGroupChoices'));
  }),
  vpcShowValue: computed('vpcChoices.[]', 'config.vpcId', 'intl.locale', function() {
    return this.configNameDisplay(get(this, 'config.vpcId'), get(this, 'vpcChoices'));
  }),
  subnetShowValue: computed('subnetChoices.[]', 'config.subnetId', 'intl.locale', function() {
    return this.configNameDisplay(get(this, 'config.subnetId'), get(this, 'subnetChoices'));
  }),
  eipSelectionShowValue: computed('eipSelection', 'intl.locale', function() {
    const eipSelection = get(this, 'eipSelection');
    return get(this, 'intl').t(`clusterNew.huaweicce.eipSelection.${eipSelection}`)
  }),
  clusterEipShowValue: computed('config.clusterExternalIP', 'cluster.cceStatus.clusterExternalIP', function() {
    return get(this, 'config.clusterExternalIP') || get(this, 'cluster.cceStatus.clusterExternalIP');
  }),
  eipTypeShowValue: computed('eipSelection', 'eipTypeChoices.[]', 'config.eipType', 'intl.locale', function() {
    return this.configNameDisplay(get(this, 'config.eipType'), get(this, 'eipTypeChoices'), true);
  }),
  eipChargeModeShowValue: computed('eipSelection', 'eipChargeModeChoices.[]', 'config.eipChargeMode', 'intl.locale', function() {
    return this.configNameDisplay(get(this, 'config.eipChargeMode'), get(this, 'eipChargeModeChoices'), true);
  }),
  authentiactionModeShowValue: computed('config.authentiactionMode', 'intl.locale', function() {
    const authentiactionMode = get(this, 'config.authentiactionMode');
    return get(this, 'intl').t(`clusterNew.huaweicce.authentiactionMode.${authentiactionMode}`)
  }),


  containerNetworkModeShowValue: computed('containerNetworkModeChoices.[]', 'config.containerNetworkMode', 'intl.locale', function() {
    const intl    = get(this, 'intl');
    const choices = get(this, 'containerNetworkModeChoices');
    const current = get(this, 'config.containerNetworkMode');

    return intl.t(get(choices.findBy('value', current), 'label'));
  }),

  managementScaleShowValue: computed('managementScale', function() {
    let choices       = MANAGEMENT_SCALE_VIRTUAL;
    const current     = get(this, 'managementScale');

    return get(choices.findBy('value', current), 'label');
  }),

  vpcChoices: computed('vpcs.[]', function() {
    const vpcs = get(this, 'vpcs') || []
    const intl = get(this, 'intl');

    return vpcs.reduce((prev, v)=>{
      prev.push({
        label: v.name,
        value: v.id
      });

      return prev;
    },[{
      label: intl.t('clusterNew.huaweicce.vpcId.default'),
      value: '',
    }])
  }),

  subnetChoices: computed('config.vpcId', 'subnets.[]', function() {
    const subnets = get(this, 'subnets') || []
    const vpcId = get(this, 'config.vpcId');
    const intl = get(this, 'intl');

    return subnets.reduce((prev, s)=>{
      if(s.vpc_id === vpcId){
        prev.push({
          label: s.name,
          value: s.id,
        });
      }

      return prev;
    }, [{
      label: intl.t('clusterNew.huaweicce.subnetId.default'),
      value: '',
    }]);
  }),

  vipSubnetChoices: computed('vipSubnets.[]', function() {
    const vipSubnets = get(this, 'vipSubnets') || []
    const filter = vipSubnets.map((s) => ({
      label: s.name,
      value: s.neutron_subnet_id,
    }))

    return filter
  }),

  eipIdChoices: computed('eipIds.[]', 'config.{externalServerEnabled}', function() {
    const eipIds = get(this, 'eipIds') || [];

    return eipIds.filter((e) => e.status === 'DOWN').map((e) => ({
      label: e.public_ip_address,
      value: e.id
    }))
  }),

  initialNodeCountMax: computed('config.clusterFlavor', function() {
    const clusterFlavor = get(this, 'config.clusterFlavor') || ''

    if (clusterFlavor.endsWith('small')) {
      return 50
    }
    if (clusterFlavor.endsWith('medium')) {
      return 200
    }
    if (clusterFlavor.endsWith('large')) {
      return 1000
    }
    if (clusterFlavor.endsWith('xlarge')) {
      return 1000
    }

    return 50;
  }),

  managementScaleDisplay: computed('managementScale', function() {
    const managementScale = get(this, 'managementScale')
    const managementScaleChoices = get(this, 'managementScaleChoices') || []
    const filter = managementScaleChoices.filter((m) => m.value === managementScale)[0] || {}

    return filter.label
  }),

  validityPeriodName: computed('config.bmsPeriodNum', 'config.bmsPeriodType', function() {
    const { bmsPeriodNum, bmsPeriodType } = get(this, 'config');

    return `${ bmsPeriodNum } ${ bmsPeriodType }`
  }),

  bmsIsAutoRenewName: computed('config.bmsIsAutoRenew', function() {
    return get(this, 'config.bmsIsAutoRenew') === 'true' ? 'Enabled' : 'Disabled'
  }),

  kubernetesVersionNotRecommend: computed('intl.locale', 'config.version', function() {
    const kubernetesVersion = get(this, 'config.version');
    const versionChoices = get(this, 'versionChoices') || [];

    return versionChoices.find(v=>{
      return v.value === kubernetesVersion && v.notRecommend
    })
  }),
  kubernetesVersionDisabeldRancher: computed('intl.locale', 'config.version', function() {
    const kubernetesVersion = get(this, 'config.version');
    const versionChoices = get(this, 'versionChoices') || [];

    return versionChoices.find(v=>{
      return v.value === kubernetesVersion && !v.rancherEnabled
    })
  }),

  validateFields(errors = [], requiredFields = [], parent = null) {
    const intl = get(this, 'intl');

    if (parent) {
      const parentVal = get(this, parent);

      if(parentVal && Array.isArray(parentVal)){
        parentVal.forEach(p => {
          requiredFields.map((item) => {
            if (!get(p, `${ item }`)) {
              errors.pushObject(`"${ intl.t(`clusterNew.huaweicce.${ item }.label`) }" ${ intl.t(`clusterNew.huaweicce.generic.isRequired`) }`);
            }
          })
        });

        return errors;
      }
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

  configNameDisplay(val, choices, localizedLabel){
    if(val === null || val === undefined || !choices){
      return 'n/a'
    }

    const selected = choices.findBy('value', val) || {};
    const label = get(selected, 'label');

    if(localizedLabel && label){
      const intl = get(this, 'intl');

      return intl.t(label)
    }

    return label || 'n/a';
  },

  // fetch API
  fetchClusters() {
    return this.queryFromHuawei('clusters', {regionID: get(this, 'config.regionID')}).then((res) => {
      const out = [];

      res.forEach(c=>{
        out.push({
          label: c.metadata.name,
          value: c.metadata.uid
        });
      });

      set(this, 'clusterChoices', out);
      this.setDefaultSelected(out, 'config.clusterId')
    }).catch((err)=>{
      set(this, 'clusterChoices', []);
    });
  },
  fetchFlavors(nodePool) {
    return this.queryFromHuawei('flavors').then(res => {
      const flavorChoicesByZones = {};
      res.forEach(flavor=>{
        const spec_az = get(flavor, 'os_extra_specs.cond:operation:az') || '';

        spec_az.split(',').forEach(az=>{
          if(az.includes('(normal)')){
            const zone = az.substr(0, az.length-8);

            flavorChoicesByZones[zone] = flavorChoicesByZones[zone] || [];
            flavorChoicesByZones[zone].push({
              label: `${ flavor.name } ( vCPUs: ${ flavor.vcpus }, memory: ${ flavor.ram / 1024 } GB )`,
              value: flavor.name,
              group: flavor.name.split('.')[0]
            })
          }
        });
      });

      set(this, 'flavorChoicesByZones', flavorChoicesByZones);
      this.send('availableZoneChange', nodePool)
    })
  },
  fetchAvailableZones() {
    const intl = get(this, 'intl');

    return this.queryFromHuawei('osAvailabilityZone').then((res) => {
      const availableZoneChoices = res.reduce((prev,zone)=>{
        if(get(zone, 'zoneState.available')){
          const id = get(zone, 'zoneName') || '';
          const selectedCloudCredential = get(this, 'selectedCloudCredential');
          const regionId = get(selectedCloudCredential, 'regionID');

          if(id.startsWith(regionId)) {
            const num = id.substr(regionId.length,1).charCodeAt() - 96;
    
            prev.push({
              label: intl.t('clusterNew.huaweicce.availableZone.value', {num}),
              value: id
            })
          } else {
            prev.push({
              label:      get(zone, 'zoneName'),
              value:      get(zone, 'zoneName'),
            })
          }
        }

        return prev;
      },[]);

      // availableZoneChoices.push({
      //   label: intl.t('clusterNew.huaweicce.availableZone.random'),
      //   value: 'random'
      // });

      set(this, 'availableZoneChoices', availableZoneChoices);
    });
  },
  fetchSecurityGroups() {
    const intl = get(this, 'intl');
    return this.queryFromHuawei('securityGroups').then((res) => {
      const securityGroupChoices = res.map((item) => {
        return {
          label: get(item, 'name'),
          value: get(item, 'id')
        };
      });

      securityGroupChoices.unshift({
          label: intl.t('clusterNew.huaweicce.securityGroup.default'),
          value: '',
      })

      set(this, 'securityGroupChoices', securityGroupChoices);
    });
  },
  fetchVolumeTypes(){
    const volumeTypeChoicesByZones = {};
    const types = ['SSD', 'SAS', 'SATA']; // todo
    return this.queryFromHuawei('volumeTypes').then(res => {
      const out = [];


      res.forEach(volumeType=>{
        let availableZones = [];
        const availability = get(volumeType, 'extra_specs.RESKEY:availability_zones');

        if(!availability || !types.includes(volumeType.name)){
          return;
        }

        const availabilityArr = availability.split(',');
        const soldOut = get(volumeType, 'extra_specs.os-vendor-extended:sold_out_availability_zones');

        if(!soldOut){
          availableZones = availabilityArr;
        } else {
          const soldOutArr = get(volumeType, 'extra_specs.os-vendor-extended:sold_out_availability_zones').split(',');
          availableZones = availabilityArr.filter(item => !soldOutArr.includes(item));
        }

        availableZones.reduce((prev, availableZone)=>{
          prev[availableZone] = prev[availableZone] || [];
          prev[availableZone].push({
            label: `clusterNew.huaweicce.volumetype.${volumeType.name}`,
            value: volumeType.name,
          });

          return prev;
        }, volumeTypeChoicesByZones)
      })

      set(this, 'volumeTypeChoicesByZones', volumeTypeChoicesByZones);
    })
  },
  fetchKeypairs() {
    return this.queryFromHuawei('osKeypairs').then(res => {
      const sshKeyChoices = res.map(sshKey=>{
        return {
          label: get(sshKey, 'keypair.name'),
          value: get(sshKey, 'keypair.name'),
        }
      })

      set(this, 'sshKeyChoices', sshKeyChoices);
    })
  },
  fetchEips() {
    return this.queryFromHuawei('listPublicIPs').then(res => {
      const eipChoices = res.reduce((prev, eip)=>{
        if(eip.status === 'DOWN'){
          prev.push({
            label: `${get(eip, 'public_ip_address')}(${get(eip, 'type')}) `,
            value: get(eip, 'public_ip_address'),
          });
        }
        
        return prev;
      }, []);

      set(this, 'eipChoices', eipChoices);
    })
  },

  volumeTypeChoices: computed('volumeTypes.[]', 'config.availableZone', function() {
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

  getVpcs() {
    set(this, 'vpcs', []);
    set(this, 'vpcId', null);

    return this.queryFromHuawei('vpcs').then((res) => {
      set(this, 'vpcs', res)

      if (get(this, 'mode') === 'new') {
        set(this, 'config.vpcId', '')
      }

      return res;
    })
  },

  getSubnet() {
    return this.queryFromHuawei('subnets', {vpcID: get(this, 'config.vpcId') || undefined}).then(res => {
      set(this, 'subnets', res)

      if (get(this, 'mode') === 'new') {
        set(this, 'config.subnetId', '')
      }

      return res;
    })
  },

  getVipSubnet() {
    return this.queryFromHuawei('subnets').then(res => {
      const subnets = res || [];

      set(this, 'subnets', subnets)
      set(this, 'vipSubnets', subnets)

      if (get(this, 'mode') === 'new') {
        set(this, 'config.subnetId', '')
        set(this, 'config.vipSubnetId', '')
      }

      return res;
    })
  },

  getEipIds() {
    return this.queryFromHuawei('listPublicIPs').then( res => {
      set(this, 'eipIds', res);

      return res
    })
  },

  getDefaultSelected(choices, specifyVal){
    if(!choices || !choices.length){
      return null;
    }

    if(specifyVal){
      const selected = choices.findBy('value', specifyVal);

      if(selected){
        return specifyVal;
      }
    }

    return get(choices, 'firstObject.value');
  },

  setDefaultSelected(choices, target, specifyVal){
    if(!get(this, 'isNew')){
      return
    }

    if(!specifyVal){
      specifyVal = get(this, target);
    }
    const selectedVal = this.getDefaultSelected(choices, specifyVal);

    set(this, target, selectedVal);

    return selectedVal;
  },

  setNodePoollNameDisplay(choices, key){  // todo
    const nodePoolList = get(this, 'nodePoolList') || [];

    nodePoolList.forEach(node=>{
      node[`display${key.charAt(0).toUpperCase()}${key.slice(1)}`] = this.configNameDisplay(node[key], choices)
    })
  },

  formatConfig(){
    const nodePoolList = [];
    const {containerNetworkCidr, kubernetesSvcIPRange, containerNetworkMode, version, clusterFlavor, vpcId, subnetId, description, tags, authentiactionMode, eipType, eipChargeMode, eipBandwidthSize, securityGroup, clusterExternalIP, kubeProxyMode} = get(this, 'config');
    const { eipSelection } = this;

    get(this, 'nodePoolList').forEach(nodePool=>{
      const out = {
        name: nodePool.nodePoolName,
        type: 'vm',
        initialNodeCount: nodePool.initialNodeCount,
        nodeTemplate: {
          flavor: nodePool.flavor,
          availableZone: nodePool.availableZone,
          operatingSystem: nodePool.operatingSystem,
          sshKey: nodePool.sshKey,
          rootVolume: {
            size: nodePool.rootVolumeSize,
            type: nodePool.rootVolumeType,
          },
          dataVolumes: [{
            size: nodePool.dataVolumeSize,
            type: nodePool.dataVolumeType,
          }],
          count: 1,
          billingMode: nodePool.billingMode,
          runtime: nodePool.runtime,
        },
        customSecurityGroups: [],
      }

      if(nodePool.nodePoolID){
        out.nodePoolID = nodePool.nodePoolID;
      }

      // if(nodePool.securityGroup){
      //   out.customSecurityGroups = [nodePool.securityGroup]
      // }

      if(nodePool.billingMode === 1){
        const validityPeriod = get(nodePool, 'validityPeriod').split(' ');
        out.nodeTemplate.extendParam = {
          periodType: validityPeriod[1],
          periodNum: validityPeriod[0],
          isAutoRenew: nodePool.bmsIsAutoRenew
        }
      }

      nodePoolList.push(out);
    });

    const config =  {
      name: get(this, 'primaryResource.name'),
      type: 'VirtualMachine',
      category: 'CCE',
      huaweiCredentialSecret: get(this, 'primaryResource.cloudCredentialId'),
      regionID: get(this, 'selectedCloudCredential.regionID'),
      imported: false,
      containerNetwork:{
        cidr: containerNetworkCidr,
        mode: containerNetworkMode
      },
      version,
      flavor: clusterFlavor, 
      hostNetwork: {
        vpcID: vpcId,
        subnetID: subnetId,
        securityGroup,
      },
      kubernetesSvcIPRange,
      description,
      authentication: {
        mode: authentiactionMode
      },
      tags,
      publicAccess: eipSelection !== 'none',
      nodePools: nodePoolList,
      extendParam: {},
      kubeProxyMode,
    }

    if(config.clusterID){
      out.clusterID = config.clusterID;
    }


    // eip config
    if(config.publicAccess){
      if(eipSelection === 'new'){
        config.publicIP = {
          createEIP: true,
          eip:       {
            ipType:    eipType,
            bandwidth: {
              chargeMode: eipChargeMode,
              size:       eipBandwidthSize,
              shareType:  'PER'
            }
          }
        }
      } else if(eipSelection === 'exist'){
        config.extendParam.clusterExternalIP = clusterExternalIP;
      }
    }

    // ca config
    if(authentiactionMode === 'authenticating_proxy'){
      const {authenticatingProxyCa, authenticatingProxyCert, authenticatingProxyPrivateKey} = get(this, 'config');
      set(config, 'authentication.authenticatingProxy', {
        ca:         AWS.util.base64.encode(authenticatingProxyCa),
        cert:       AWS.util.base64.encode(authenticatingProxyCert),
        privateKey: AWS.util.base64.encode(authenticatingProxyPrivateKey),
      })
    }

    return config;
  },

  setValidityPeriodChoices(){
    const intl = get(this, 'intl');
    const validityPeriodChoices = Object.keys(BILLING_MODE_VALIDITY_PERIOD).reduce((prev, period)=>{
      BILLING_MODE_VALIDITY_PERIOD[period].forEach(item=>{
        prev.push({
          label: item + ' ' + intl.t(`clusterNew.huaweicce.bmsIsAutoRenew.${period}s`, {count: item}),
          value: `${item} ${period}`
        })
      })
  
      return prev;
    }, []);

    set(this, 'validityPeriodChoices', validityPeriodChoices);
  },

  flavorChoices: computed('flavors.[]', function() {
    const flavors = get(this, 'flavors') || []

    return flavors.filter((n) => {
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
        value: n.name,
        group: n.name.split('.')[0]
      }
    })
  }),

  queryFromHuawei(resource, externalParams = {}) {
    const cloudCredentialId = get(this, 'primaryResource.cloudCredentialId');
    const url = `/meta/cce/${resource}`
    const query = Object.assign({}, externalParams, {
      cloudCredentialId,
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
