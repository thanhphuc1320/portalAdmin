import { EVN, some } from '../../../src/constants';

export const ACCESS_TOKEN = 'ACCESS_TOKEN';
export const USER_DATA = 'USER_DATA';
export const USER_ID = 'userId';
export const APP_ID = 'ams-web';

function checkAPPKEY() {
  if (EVN === 'stage') {
    return 'aaakakkzkkakakkakak11zkkzxkakkskakq';
  }
  return 'kasdhasdhakdjkad';
}

export const APP_KEY = checkAPPKEY();

export const APP_ID_SOCIAL = 'tripi-social-portal';
function checkAPPKEYSOCIAL() {
  return 'dbmnmnsdnmnssansmNSKKmzmlL';
}
export const APP_KEY_SOCIAL = checkAPPKEYSOCIAL();

export const TOKEN = 'TOKEN';
export const REFRESH_TOKEN = 'REFRESH_TOKEN';
export const CA_ID: string = 'caId';

export interface caIDInfoProps {
  TRIPI_PARTNER: number;
  DINOGO: number;
  MYTOUR: number;
}

export const CA_ID_INFO: caIDInfoProps = {
  TRIPI_PARTNER: 1,
  DINOGO: 3,
  MYTOUR: 17,
};

export interface caIDItemProps {
  name: string;
  appId: string;
  appKey: string;
  caId: number | string;
  id: number | string;
}
export const CA_INFO_DEV: caIDItemProps[] = [
  {
    id: 1,
    caId: 1,
    name: 'Tripi',
    appId: 'csp_portal',
    appKey: '123axxafafacaxxaf1',
  },
  {
    id: 3,
    caId: 3,
    name: 'Dinogo',
    appId: 'csp.dinogo.tripi.vn',
    appKey: '1234khanhhahahahaha12355',
  },
  {
    id: 17,
    caId: 17,
    name: 'Mytour',
    appId: 'afwsax2y0smfv9wgg43kcabc9r9ksk1j',
    appKey: '91%qc2!Nbd%840nFRZ0#5Y^8oevm#sHc',
  },
  {
    id: 21,
    caId: 21,
    name: 'Tripi One',
    appId: 'tripione-web',
    appKey: 'kasdhasdhakdjkad',
  },
  {
    id: 9999,
    caId: 9999,
    name: 'Vntravel Group',
    appId: 'vntravel-group-csp',
    appKey: 'f95f5e49-0fc9-4e3f-8a38-e9096ea96fe6123',
  },
];

export const CA_INFO: caIDItemProps[] = [
  {
    id: 1,
    caId: 1,
    name: 'Tripi',
    appId: 'chat_portal',
    appKey: 'axddsd12fvfaaxxa123faf',
  },
  {
    id: 3,
    caId: 3,
    name: 'Dinogo',
    appId: 'csp.dinogo.tripi.vn',
    appKey: '123fffasxvgswetsvgssggssccsggs',
  },
  {
    id: 17,
    caId: 17,
    name: 'Mytour',
    appId: 'csp-mytour',
    appKey: '95b9699c-25e5-4811-bb7e-5dd8',
  },
  {
    id: 21,
    caId: 21,
    name: 'Tripi One',
    appId: 'tripone-web',
    appKey: 'kajahhazzanqhqi19zjanaj18xzjhh1q8shahzai1hzjaqj19s',
  },
  {
    id: 9999,
    caId: 9999,
    name: 'Vntravel Group',
    appId: 'vntravel-group-csp',
    appKey: '741ccvca-8a14-9063-8769-abnn1akax',
  },
];

export const googleInfo: some = {
  SECRET: 'wWh-OArZMWCez9DdaLAzIi-1',
  ID: '125756005771-1kqtlprik59t2p95plkkfn363vbhqi35.apps.googleusercontent.com',
};

export const UUID: string = 'UUID';
