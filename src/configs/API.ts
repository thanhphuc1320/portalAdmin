import { EVN } from '../constants';

enum APIServices {
  account,
  login,
  ams,
  auth,
  msgs,
  tripisocial,
  assets,
  tripisocialV2,
  flyx,
}

function getBaseUrl(service: APIServices) {
  if (service === APIServices.ams) {
    if (EVN === 'dev') {
      return 'https://gate.dev.tripi.vn/ams';
    }
    if (EVN === 'stage') {
      return 'https://gate.stage.tripi.vn/ams';
    }
    return 'https://gate.tripi.vn/ams';
  }

  if (service === APIServices.msgs) {
    if (EVN === 'dev') {
      return 'https://gate.dev.tripi.vn/msgs';
    }
    if (EVN === 'stage') {
      return 'https://gate.stage.tripi.vn/msgs';
    }
    return 'https://gate.tripi.vn/msgs';
  }

  if (service === APIServices.flyx) {
    if (EVN === 'dev') {
      return 'https://gate.dev.tripi.vn/flyx';
    }
    if (EVN === 'stage') {
      return 'https://gate.stage.tripi.vn/flyx';
    }
    return 'https://gate.tripi.vn/flyx';
  }

  if (service === APIServices.tripisocial) {
    if (EVN === 'dev') {
      return 'https://gate.dev.tripi.vn/tripi-social/api/v1';
    }
    return 'https://gate.tripi.vn/tripi-social/api/v1';
  }

  if (service === APIServices.tripisocialV2) {
    if (EVN === 'dev') {
      return 'https://gate.dev.tripi.vn/tripi-social/api/v2';
    }
    return 'https://gate.tripi.vn/tripi-social/api/v2';
  }

  if (service === APIServices.assets) {
    if (EVN === 'dev') {
      return '//assets.dev.tripi.vn/assets';
    }
    if (EVN === 'stage') {
      return 'https://assets.tripi.vn/assets';
    }
    return 'https://assets.tripi.vn/assets';
  }

  if (service === APIServices.login) {
    return EVN === 'dev'
      ? 'https://dev-api.tripi.vn/account/loginV2'
      : 'https://tourapi.tripi.vn/v3/account/loginV2';
  }
  if (service === APIServices.auth) {
    if (EVN === 'dev') {
      return 'https://gate.dev.tripi.vn/auth';
    }
    if (EVN === 'stage') {
      return 'https://gate.stage.tripi.vn/auth';
    }
    return 'https://gate.tripi.vn/auth';
  }
  return null;
}

export const API_PATHS = {
  // uploadImage: `${getBaseUrl(APIServices.one)}/uploadImage`,
  validateAccessToken: `${getBaseUrl(APIServices.ams)}/account/validateAccessToken`,

  login: `${getBaseUrl(APIServices.auth)}/v2/login`,
  actionLoginOauth: `${getBaseUrl(APIServices.auth)}/v2/oauth`,
  getUserPermissions: (id: number) =>
    `${getBaseUrl(APIServices.ams)}/account/permissions?zone=AUTH&userId=${id}`,
  getUserProfile: `${getBaseUrl(APIServices.tripisocial)}/profile`,

  adminPost: `${getBaseUrl(APIServices.tripisocial)}/admin/post`,
  adminPostSearch: `${getBaseUrl(APIServices.tripisocial)}/admin/post/search`,
  adminItemHotel: `${getBaseUrl(APIServices.tripisocial)}/admin/objects/hotel`,
  deActiveAdminItemHotel: `${getBaseUrl(APIServices.tripisocial)}/admin/objects/hotel/deactivate`,

  getCaIdList: `${getBaseUrl(APIServices.tripisocial)}/admin/post/caids`,
  getCreatedUsers: `${getBaseUrl(APIServices.tripisocial)}/admin/post/created-users`,
  getHashtags: `${getBaseUrl(APIServices.tripisocial)}/admin/post/hashtags`,
  activePost: `${getBaseUrl(APIServices.tripisocial)}/admin/post/activate`,
  deactivatePost: `${getBaseUrl(APIServices.tripisocial)}/admin/post/deactivate`,

  listComments: `${getBaseUrl(APIServices.tripisocial)}/comment`,
  listProvinces: `${getBaseUrl(APIServices.tripisocial)}/admin/provinces`,
  searchHotels: `${getBaseUrl(APIServices.tripisocial)}/admin/search/hotels`,
  searchHotelsItem: `${getBaseUrl(APIServices.tripisocial)}/admin/search/hotel-items`,
  searchHotelMedias: `${getBaseUrl(APIServices.tripisocial)}/admin/search/hotel/media`,
  searchHotelReviews: `${getBaseUrl(APIServices.tripisocial)}/admin/search/reviews`,
  searchHotelsName: `${getBaseUrl(APIServices.tripisocial)}/admin/search/hotels/name`,

  bulkPost: `${getBaseUrl(APIServices.tripisocial)}/admin/post/bulk`,
  approvePost: `${getBaseUrl(APIServices.tripisocial)}/admin/post/approve`,
  blockPost: `${getBaseUrl(APIServices.tripisocial)}/admin/post/block`,
  waitPost: `${getBaseUrl(APIServices.tripisocial)}/admin/post/wait`,
  rescheduleScheduledPost: `${getBaseUrl(APIServices.tripisocial)}/admin/post/reschedule-post`,
  searchFlightsServiceAdmin: (caId: number) =>
    `${getBaseUrl(APIServices.tripisocial)}/admin/search/flights?caId=${caId}`,
  getAdminFlightsAirports: `${getBaseUrl(APIServices.tripisocial)}/admin/flights/airports`,

  getHashTagsList: `${getBaseUrl(APIServices.tripisocial)}/admin/hashtags`,
  bulkHashTag: `${getBaseUrl(APIServices.tripisocial)}/admin/hashtags/bulk`,
  suggestUsers: `${getBaseUrl(APIServices.tripisocial)}/admin/suggest/users`,
  getHashTagRanking: `${getBaseUrl(APIServices.tripisocial)}/admin/hashtag-rankings`,
  bulkHashTagRanking: `${getBaseUrl(APIServices.tripisocial)}/admin/hashtag-rankings/bulk`,
  updateStatusHashTagRanking: `${getBaseUrl(
    APIServices.tripisocial,
  )}/admin/hashtag-rankings/update-status`,
  updateStatusHashTag: `${getBaseUrl(APIServices.tripisocial)}/admin/hashtags/update-status`,
  suggestHashTags: `${getBaseUrl(APIServices.tripisocial)}/admin/suggest/hashtags`,
  copyHashTags: `${getBaseUrl(APIServices.tripisocial)}/admin/hashtag-rankings/copy`,

  uploadImage: `${getBaseUrl(APIServices.assets)}/file/upload`,
  uploadFile: `${getBaseUrl(APIServices.assets)}/file/upload`,
  getLocations: `${getBaseUrl(APIServices.tripisocial)}/admin/suggest/locations`,

  apiAdminSource: `${getBaseUrl(APIServices.tripisocial)}/admin/sources`,
  getAdminNameFanpage: `${getBaseUrl(APIServices.tripisocial)}/admin/sources/names`,

  getAdminCrawlers: `${getBaseUrl(APIServices.tripisocial)}/admin/crawlers`,
  deleteAdminCrawlers: `${getBaseUrl(APIServices.tripisocial)}/admin/crawlers`,
  getAdminCrawlersPostIds: `${getBaseUrl(APIServices.tripisocial)}/admin/crawlers/post-ids`,
  getAdminCrawlersCodes: `${getBaseUrl(APIServices.tripisocial)}/admin/crawlers/codes`,
  adminCrawlersConvert: `${getBaseUrl(APIServices.tripisocial)}/admin/crawlers/convert`,
  getAdminCrawlersSearch: `${getBaseUrl(APIServices.tripisocial)}/admin/crawlers/search`,
  getAdminUsersAdmins: `${getBaseUrl(APIServices.tripisocial)}/admin/users/admins`,
  getAdminSourcesSearch: `${getBaseUrl(APIServices.tripisocial)}/admin/sources/search`,

  getApiAdminUser: `${getBaseUrl(APIServices.tripisocial)}/admin/users`,
  getApiAdminExportUser: `${getBaseUrl(APIServices.tripisocial)}/admin/users/export`,
  getApiAdminSearchUser: `${getBaseUrl(APIServices.tripisocial)}/admin/users/search`,
  getApiAdminHistoryActivityUser: `${getBaseUrl(
    APIServices.tripisocial,
  )}/admin/users/activity-logs`,

  apiAdminBadWord: `${getBaseUrl(APIServices.tripisocial)}/admin/badwords`,
  apiImportAdminListBadWord: `${getBaseUrl(APIServices.tripisocial)}/admin/badwords/import`,
  apiExportAdminListBadWord: `${getBaseUrl(APIServices.tripisocial)}/admin/badwords/export`,
  apiGetAdminListBadWord: `${getBaseUrl(APIServices.tripisocial)}/admin/badwords/search`,
  apiGetAdminListBadWordSample: `${getBaseUrl(
    APIServices.tripisocial,
  )}/admin/application-settings?key=bad_word_import_template`,

  // Upload V2
  uploadVideoInitV2: `${getBaseUrl(APIServices.tripisocialV2)}/admin/video/initialize`,
  uploadVideoStatusV2: `${getBaseUrl(APIServices.tripisocialV2)}/video/status`,
  uploadVideoTusInitializeV2: `${getBaseUrl(APIServices.tripisocialV2)}/admin/video/tus/initialize`,

  uploadViaLinkVideoV2: `${getBaseUrl(APIServices.tripisocialV2)}/admin/video/upload-via-link`,

  postApprove: `${getBaseUrl(APIServices.tripisocial)}/admin/post/approve`,
  denyApprove: `${getBaseUrl(APIServices.tripisocial)}/admin/post/deny`,
  historyApprove: `${getBaseUrl(APIServices.tripisocial)}/admin/post/histories`,
  denyReasons: `${getBaseUrl(APIServices.tripisocial)}/admin/post/deny-reasons`,
  checkTimeRange: `${getBaseUrl(APIServices.tripisocial)}/admin/hashtag-rankings/check-time-range`,

  getYouFollwer: `${getBaseUrl(APIServices.tripisocial)}/admin/user/following`,
  searchSourceUser: `${getBaseUrl(APIServices.tripisocial)}/admin/suggest/internal-users`,
  unfollowFollwering: `${getBaseUrl(APIServices.tripisocial)}/admin/user/unfollow`,

  getFollwer: `${getBaseUrl(APIServices.tripisocial)}/admin/user/followers`,

  getNotifications: `${getBaseUrl(APIServices.tripisocial)}/admin/notifications`,
  getNotificationsDelete: `${getBaseUrl(APIServices.tripisocial)}/admin/notifications`,
  updateNotificationsRespond: `${getBaseUrl(APIServices.tripisocial)}/admin/notifications/respond`,
  updateStatusNotifications: `${getBaseUrl(
    APIServices.tripisocial,
  )}/admin/notifications/update-status`,
  statisticNotifications: `${getBaseUrl(APIServices.tripisocial)}/admin/notifications/statistic`,
  getAdminCommentsRepliesHistory: `${getBaseUrl(
    APIServices.tripisocial,
  )}/admin/comments/replies-history`,

  // firebase
  firebase: `${getBaseUrl(APIServices.msgs)}/notify/token/register`,
  firebaseUnregister: `${getBaseUrl(APIServices.msgs)}/notify/token/unregister`,

  statisticPost: `${getBaseUrl(APIServices.tripisocial)}/admin/post/statistic`,

  getAdminPins: `${getBaseUrl(APIServices.tripisocial)}/admin/pins`,
  getAdminPinSectionList: `${getBaseUrl(APIServices.tripisocial)}/admin/pins/section`,
  adminPinsActivate: `${getBaseUrl(APIServices.tripisocial)}/admin/pins/activate`,
  adminPinsDeactivate: `${getBaseUrl(APIServices.tripisocial)}/admin/pins/deactivate`,
  deletePins: `${getBaseUrl(APIServices.tripisocial)}/admin/pins`,
  createPins: `${getBaseUrl(APIServices.tripisocial)}/admin/pins/bulk?newVersion`,
  updatePin: `${getBaseUrl(APIServices.tripisocial)}/admin/pins`,
  adminCheckConflictPin: `${getBaseUrl(APIServices.tripisocial)}/admin/pins/check-conflict`,

  getAdminRewardList: `${getBaseUrl(APIServices.tripisocial)}/admin/reward`,
  createReward: `${getBaseUrl(APIServices.tripisocial)}/admin/reward`,
  updateReward: `${getBaseUrl(APIServices.tripisocial)}/admin/reward`,
  deleteReward: `${getBaseUrl(APIServices.tripisocial)}/admin/reward`,
  getAdminRewardTypeList: `${getBaseUrl(APIServices.tripisocial)}/admin/reward/type`,
  getAdminRewardValueTypeList: `${getBaseUrl(APIServices.tripisocial)}/admin/reward/value-type`,
  getAdminRewardUnitList: `${getBaseUrl(APIServices.tripisocial)}/admin/reward/unit`,
  adminRewardActivate: `${getBaseUrl(APIServices.tripisocial)}/admin/reward/activate`,
  adminRewardDeactivate: `${getBaseUrl(APIServices.tripisocial)}/admin/reward/deactivate`,

  getAdminEvents: `${getBaseUrl(APIServices.tripisocial)}/admin/events`,
  getAdminEventTargets: `${getBaseUrl(APIServices.tripisocial)}/admin/events/targets`,
  getAdminEventConditions: `${getBaseUrl(APIServices.tripisocial)}/admin/events/conditions`,
  adminEventActivate: `${getBaseUrl(APIServices.tripisocial)}/admin/events/activate`,
  adminEventDeactivate: `${getBaseUrl(APIServices.tripisocial)}/admin/events/deactivate`,

  getAdminWinners: `${getBaseUrl(APIServices.tripisocial)}/admin/winners`,
  adminWinnersUpdateStatus: `${getBaseUrl(APIServices.tripisocial)}/admin/winners/status`,
  getAdminStatusHistories: `${getBaseUrl(APIServices.tripisocial)}/admin/winners/status-histories`,
  putAdminWinnersImport: `${getBaseUrl(APIServices.tripisocial)}/admin/winners`,
  getAdminWinnersExport: `${getBaseUrl(APIServices.tripisocial)}/admin/winners/export`,

  getAdminReports: `${getBaseUrl(APIServices.tripisocial)}/admin/reports`,
  getAdminApplicationSettings: `${getBaseUrl(APIServices.tripisocial)}/admin/application-settings`,
};

export const getBaseUrlWebApp = () => {
  if (EVN === 'dev') {
    return 'https://social-dev.tripi.vn';
  }
  return 'https://social.tripi.vn';
};
